import raf from 'raf';
require('visibly.js');

export default class AppAudio {

	get FFT_SIZE() { return 512; }
	get BINS() { return 128; }

	constructor() {
		this.playing = new Map();
		this.muted = false;

		// check initial state of the AudioContext
		createjs.Sound.initializeDefaultPlugins();
		createjs.Sound.alternateExtensions = ['mp3'];

		this.initAnalyser();

		if (createjs.Sound.activePlugin.context.state === 'suspended') {
			this.muted = true;
		}

		// pause/resume with page visibility
		visibly.onHidden(() => {
			this.wasMuted = this.muted;
			this.mute();
		});

		visibly.onVisible(() => {
			if (!this.wasMuted) this.unmute();
		});
	}

	init() {
		// start ticking
		raf(this.update.bind(this));
	}

	initAnalyser() {
		const context = createjs.Sound.activePlugin.context;

		// create an analyser node
		this.analyserNode = context.createAnalyser();
		this.analyserNode.fftSize = this.FFT_SIZE;
		this.analyserNode.smoothingTimeConstant = 0.85;
		this.analyserNode.connect(context.destination);

		// attach visualizer node to our existing dynamicsCompressorNode, which was connected to context.destination
		const dynamicsNode = createjs.Sound.activePlugin.dynamicsCompressorNode;
		dynamicsNode.disconnect();  // disconnect from destination
		dynamicsNode.connect(this.analyserNode);

		this.values = [];
	}

	getPlayer(name) {
		return this.playing.get(name);
	}

	play(name, params, volume = 1) {
		if (!params) params = {};

		// start player
		const player = createjs.Sound.play(name);
		player.name = name;
		player.paused = this.muted;
		if (params.startAt) player.position = params.startAt;

		// loop to position
		if (params.loopTo !== undefined) {
			player.loopTo = params.loopTo;
			player.loopAt = player.duration - 200;
		}

		player.volume = volume;

		// store
		this.playing.set(name, player);

		return player;
	}

	stop(name) {
		if (this.playing.get(name)) {
			this.playing.get(name).stop();
			this.playing.delete(name);
		}
	}

	mute() {
		// pause all
		for (let [name, player] of this.playing) {
			player.paused = true;
		}

		this.muted = true;
	}

	unmute() {
		// resume all
		for (let [name, player] of this.playing) {
			if (player.paused) player.paused = false;
		}

		this.muted = false;
	}

	update() {
		for (let [name, player] of this.playing) {
			// clear finished
			if (player.playState === createjs.Sound.PLAY_FINISHED) {
				this.stop(name);
			}

			// loop
			if (!player.loopAt) continue;

			if (player.position >= player.loopAt) {
				const diff = player.position - player.loopAt;

				let loopTo;
				if (typeof player.loopTo === 'function') {
					loopTo = player.loopTo();
				} else {
					loopTo = player.loopTo;
				}

				this.play(player.name, { startAt: loopTo + diff, loopTo: loopTo }, this.playing.get(player.name).volume);
				player.loopAt = 0;
			}
		}

		// analyser
		const freqData = new Uint8Array(this.analyserNode.frequencyBinCount);
		this.analyserNode.getByteFrequencyData(freqData);
		const length = freqData.length;

		const bin = Math.ceil(length / this.BINS);
		for (let i = 0; i < this.BINS; i++) {
			let sum = 0;
			for (let j = 0; j < bin; j++) {
				sum += freqData[(i * bin) + j];
			}

			// Calculate the average frequency of the samples in the bin
			const average = sum / bin;

			// Divide by number of bins to normalize
			// this.values[i] = (average / this.BINS) / this.playbackRate;
			this.values[i] = (average / this.BINS);
		}

		raf(this.update.bind(this));
	}
}
