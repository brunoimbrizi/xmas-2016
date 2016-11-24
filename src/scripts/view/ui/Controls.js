const REF_TRACK = 'drums-o';

export default class Controls {

	constructor() {
		this.tracks = new Map()
			.set('drums', { xmas: false })
			.set('bass', { xmas: false })
			.set('key', { xmas: false })
			;

		this.toggleTrack = this.toggleTrack.bind(this);

		this.buttons = document.querySelectorAll('.ui a');
		for (const button of this.buttons) {
			button.addEventListener('click', this.toggleTrack.bind(this));
		}
	}

	start() {
		app.audio.play('drums-o');

		// TODO: get loop start value + use raf
		setTimeout(() => {
			this.toggleTrack('drums');
			this.toggleTrack('bass');
			this.toggleTrack('key');
		}, 7800);
	}

	toggleTrack(param) {
		let trackId;
		if (typeof param === 'string') {
			trackId = param;
		} else {
			event.preventDefault();
			trackId = event.currentTarget.dataset.track;
		}

		this.tracks.get(trackId).xmas = !this.tracks.get(trackId).xmas;

		const toPlaySuffix = this.tracks.get(trackId).xmas ? 'x' : 'o';
		const toStopSuffix = this.tracks.get(trackId).xmas ? 'o' : 'x';
		const toPlay = `${trackId}-${toPlaySuffix}`;
		const toStop = `${trackId}-${toStopSuffix}`;

		const position = app.audio.playing.get(REF_TRACK).position;

		if (toStop === REF_TRACK) {
			app.audio.playing.get(REF_TRACK).volume = 0;
			app.audio.play(toPlay, { startAt: position });
		} else if (toPlay === REF_TRACK) {
			app.audio.playing.get(REF_TRACK).volume = 1;
			app.audio.stop(toStop);
		} else {
			app.audio.stop(toStop);
			app.audio.play(toPlay, { startAt: position });
		}
	}
}
