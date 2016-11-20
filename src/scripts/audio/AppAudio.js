export default class AppAudio {

	constructor() {
		this.trackName = 'billie-jean';

		this.muted = false;

		// check initial state of the AudioContext
		createjs.Sound.initializeDefaultPlugins();
		if (createjs.Sound.activePlugin.context.state === 'suspended') {
			this.muted = true;
		}
	}

	play() {
		this.player = createjs.Sound.play(this.trackName);
		this.player.paused = this.muted;

		this.player.volume = 0;
		TweenMax.to(this.player, 0.2, { volume: 1 });

		this.player.delayedLoop = TweenMax.delayedCall(
			this.player.duration * 0.001 - 70,
			this.onCrossLoop,
			[],
			this
		);

		if (this.muted) this.player.delayedLoop.pause();
	}

	stop() {
		if (this.player.delayedLoop) this.player.delayedLoop.kill();
		this.player.stop();
	}

	onCrossLoop(player) {
		console.log('SoundController.onCrossLoop', player);
		this.play();
	}

	mute() {
		// pause all
		this.player.paused = true;
		if (this.player.delayedLoop) this.player.delayedLoop.pause();

		this.muted = true;
	}

	unmute() {
		// resume all
		if (this.player.paused) this.player.paused = false;
		if (this.player.delayedLoop && this.player.delayedLoop.paused) this.player.delayedLoop.resume();

		this.muted = false;
	}
}