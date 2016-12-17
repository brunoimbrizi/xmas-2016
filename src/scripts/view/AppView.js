import Controls from './ui/Controls';
import WebGLView from './webgl/WebGLView';
import AppUI from './AppUI';

export default class AppView {

	constructor() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

		this.initSketch();
	}

	initSketch() {
		this.sketch = Sketch.create({
			type: Sketch.WEBGL,
			element: this.renderer.domElement,
			context: this.renderer.context,
			autopause: false,
			retina: (window.devicePixelRatio >= 2),
			fullscreen: true
		});

		this.sketch.setup = () => {
			this.initWebGL();
			this.initUI();
			this.initDebugUI();

		};

		this.sketch.update = () => {
			this.webGL.update();
		};

		this.sketch.draw = () => {
			this.webGL.draw();
		};

		this.sketch.resize = () => {
			this.hw = this.sketch.width * 0.5;
			this.hh = this.sketch.height * 0.5;

			this.webGL.resize();
		};

		this.sketch.touchstart = () => {
			const touch = this.sketch.touches[0];
		};

		this.sketch.touchmove = () => {
		};

		this.sketch.touchend = () => {
		};
	}

	// assets loaded
	init() {
		this.start();
		this.webGL.init();
	}

	initWebGL() {
		document.querySelector('.main').appendChild(this.renderer.domElement);
		this.webGL = new WebGLView(this);
	}

	initUI() {
		this.ui = new Controls(document.querySelector('.ui'));
		this.ui.on('controls:toggleTrack', this.onControlsInteraction.bind(this));
		this.ui.on('controls:playGimmick', this.onControlsInteraction.bind(this));
	}

	initDebugUI() {
		this.debugUI = new AppUI(this);
	}

	start() {
		this.ui.start();
		this.ui.show();
	}

	onControlsInteraction(e) {
		if (this.interacted) return;
		this.interacted = this.webGL.dance();
	}

	knm(active) {
		this.webGL.knm(active);
	}
}
