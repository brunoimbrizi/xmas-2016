import AppAudio from './audio/AppAudio';
import AppView from './view/AppView';

export default class App {

	constructor(el) {
		this.el = el;

		this.initLoader();
	}

	initLoader() {
		this.preloader = new createjs.LoadQueue();
		this.preloader.installPlugin(createjs.Sound);

		this.preloader.addEventListener('progress', (e) => {
			// console.log('preloader', e);
		});

		this.preloader.addEventListener('complete', (e) => {
			// console.log('preloader', e);
			this.initView();
			this.initAudio();
		});

		this.preloader.loadManifest('data/manifest.json');
	}

	initView() {
		this.view = new AppView();
	}

	initAudio() {
		this.audio = new AppAudio();
	}
}
