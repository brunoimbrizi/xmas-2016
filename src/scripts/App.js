import AppAudio from './audio/AppAudio';
import AppView from './view/AppView';

export default class App {

	constructor(el) {
		this.el = el;

		if ('ontouchstart' in window) {
			document.body.classList.add('is-touch-device');
		}

		this.initLoader();
		this.initAudio();
		this.initView();
		this.initKnm();
	}

	initLoader() {
		this.preloader = new createjs.LoadQueue();
		this.preloader.installPlugin(createjs.Sound);

		this.preloader.addEventListener('progress', (e) => {
			// console.log('preloader', e);
			const progress = Math.round(e.progress * 100);
			document.querySelector('.info .content h2').innerHTML = `LOADING ${progress}`;
		});

		this.preloader.addEventListener('complete', (e) => {
			// console.log('preloader', e);
			requestAnimationFrame(() => {
				document.querySelector('.info').classList.add('hide');
				this.view.init();
				this.audio.init();
			});
		});

		this.preloader.loadManifest('data/manifest.json');
	}

	initAudio() {
		this.audio = new AppAudio();
	}

	initView() {
		this.view = new AppView(this.audio);
	}

	initKnm() {
		this.knm = {};
		this.knm.input = '';
		this.knm.timeout = null;
		this.knm.delay = 2000;
		this.knm.active = false;

		this.knm.keyup = this.onKeyUp.bind(this);
		document.addEventListener('keyup', this.knm.keyup);
	}

	onKeyUp(e) {
		this.knm.input += e.keyCode;
		if (this.knm.input === '38384040373937396665') {
			this.knm.active = !this.knm.active;
			this.view.knm(this.knm.active);
		}

		clearTimeout(this.knm.timeout);
		this.knm.timeout = setTimeout(() => {
			this.knm.input = '';
		}, this.knm.delay);
	}
}
