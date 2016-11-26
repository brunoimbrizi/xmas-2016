import keyMap from '../../util/keyMap';;
import { getRandomInt } from '../../util/math';;

const REF_TRACK = 'drums-o';

export default class Controls {
	constructor(element) {
		this.element = element;

		this.tracks = new Map()
			.set('drums', { xmas: false, element: this.element.querySelector('[data-track="drums"]') })
			.set('bass', { xmas: false, element: this.element.querySelector('[data-track="bass"]') })
			.set('key', { xmas: false, element: this.element.querySelector('[data-track="key"]') })
			;

		this.muteButton = this.element.querySelector('.mute');
		this.trackButtons = this.element.querySelectorAll('[data-track]');

		this.addListeners();
	}

	addListeners() {
		this.mute = this.mute.bind(this);
		this.playGimmick = this.playGimmick.bind(this);
		this.toggleTrack = this.toggleTrack.bind(this);

		this.muteButton.addEventListener('click', this.mute.bind(this));

		document.addEventListener('keyup', this.playGimmick.bind(this));
		document.addEventListener('touchend', this.playGimmick.bind(this));

		for (const track of this.tracks.values()) {
			track.element.addEventListener('click', this.toggleTrack.bind(this));
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

	mute() {
		if (app.audio.muted) {
			app.audio.unmute();
			this.muteButton.classList.remove('muted');
		} else {
			app.audio.mute();
			this.muteButton.classList.add('muted');
		}
	}

	toggleTrack(param) {
		let trackId;
		if (typeof param === 'string') {
			trackId = param;
		} else {
			event.preventDefault();
			trackId = event.currentTarget.dataset.track;
		}

		const track = this.tracks.get(trackId);

		track.xmas = !track.xmas;

		const toPlaySuffix = track.xmas ? 'x' : 'o';
		const toStopSuffix = track.xmas ? 'o' : 'x';
		const toPlay = `${trackId}-${toPlaySuffix}`;
		const toStop = `${trackId}-${toStopSuffix}`;

		if (toPlaySuffix === 'x') {
			track.element.classList.add('xmas');
		} else {
			track.element.classList.remove('xmas');
		}

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

	playGimmick(event) {
		if (event.type === 'touchend') {
			app.audio.play(`gimmick-${keyMap.get(getRandomInt(65, 91))}`);
		} else {
			app.audio.play(`gimmick-${keyMap.get(event.keyCode)}`);
		}
	}
}
