import raf from 'raf';
require('visibly.js');

export default class AppAudio {
	constructor() {
		this.playing = new Map();
		this.muted = false;

		// check initial state of the AudioContext
		createjs.Sound.initializeDefaultPlugins();
		if (createjs.Sound.activePlugin.context.state === 'suspended') {
			this.muted = true;
		}

		// start ticking
		raf(this.update.bind(this));

		// pause/resume with page visibility
		visibly.onHidden(() => {
			this.wasMuted = this.muted;
			this.mute();
		});

		visibly.onVisible(() => {
			if (!this.wasMuted) this.unmute();
		});
	}

	play(name, params) {
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
				this.play(player.name, { startAt: player.loopTo - diff, loopTo: player.loopTo });
				player.loopAt = 0;
			}
		}

		raf(this.update.bind(this));
	}
}