import UIView from './ui/UIView';
import Controls from './ui/Controls';
import WebGLView from './webgl/WebGLView';

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
			autopause: true,
			retina: (window.devicePixelRatio >= 2),
			fullscreen: true
		});

		this.sketch.setup = () => {
			this.initWebGL();
			this.initUI();
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

	initWebGL() {
		document.querySelector('.main').appendChild(this.renderer.domElement);
		this.webGL = new WebGLView(this);
	}

	initUI() {
		// this.ui = new UIView(this);
		this.ui = new Controls(this);
	}
}
