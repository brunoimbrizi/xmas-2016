const glslify = require('glslify');

import ManDeer from './mandeer/ManDeer';

import NormalLines from './effects/NormalLines';
import Arrows from './effects/Arrows';
import Dots from './effects/Dots';

export default class WebGLView {

	constructor(view) {
		this.view = view;
		this.renderer = this.view.renderer;
		this.clock = new THREE.Clock;

		this.initThree();
		this.initControls();
		this.initObject();
		this.initLights();
		this.initManDeer();
		// this.initNormalLines();
		// this.initArrows();
		this.initDots();
	}

	initThree() {
		// scene
		this.scene = new THREE.Scene();

		// camera
		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.z = 140;
	}

	initControls() {
		this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
		this.controls.target.set(0, 0, 0);
		this.controls.rotateSpeed = 2.0;
		this.controls.zoomSpeed = 0.8;
		this.controls.panSpeed = 0.8;
		this.controls.noZoom = false;
		this.controls.noPan = false;
		this.controls.staticMoving = false;
		this.controls.dynamicDampingFactor = 0.15;
		this.controls.maxDistance = 3000;
		this.controls.enabled = true;
	}

	initObject() {
		const geometry = new THREE.BoxGeometry(200, 200, 200);
		// const geometry = new THREE.PlaneGeometry(400, 400, 20, 20);

		const material = new THREE.ShaderMaterial({
			uniforms: {},
			vertexShader: glslify('../../../shaders/default.vert'),
			fragmentShader: glslify('../../../shaders/default.frag'),
			wireframe: true
		});

		const mesh = new THREE.Mesh(geometry, material);
		this.scene.add(mesh);
	}

	initLights() {
		const lightA = new THREE.DirectionalLight(0x222222);
		lightA.position.set(0, 1, 0);
		// this.scene.add(lightA);
		// this.camera.add(lightA);
		// this.scene.add(this.camera);

		const lightB = new THREE.PointLight(0xE6335A);
		lightB.position.set(300, 1, -150);
		this.camera.add(lightB);

		const lightC = new THREE.PointLight(0xCCCCCC);
		// const lightC = new THREE.PointLight(0x00FFFF);
		lightC.position.set(-300, 1, -240);
		this.camera.add(lightC);

		this.scene.add(this.camera);
	}

	initManDeer() {
		this.mandeer = new ManDeer();
		this.mandeer.object.position.y = -25;
		this.scene.add(this.mandeer.object);
		// this.scene.add(this.mandeer.other);
	}

	initNormalLines() {
		this.normalLines = new NormalLines(this.mandeer.object, this.camera);
		// this.scene.add(this.normalLines.object);
	}

	initArrows() {
		this.arrows = new Arrows(this.mandeer);
		// this.scene.add(this.arrows.object);
	}

	initDots() {
		this.dots = new Dots(this.mandeer);
		this.scene.add(this.dots.object);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
		this.controls.update();

		if (this.mandeer) {
			this.mandeer.update(this.clock.getDelta());
			// this.normalLines.update();
			// this.arrows.update();
			this.dots.update();
		}

		// const dot = this.face.normal.dot(this.camera.position.clone().normalize());
		// this.line.material.opacity = dot;
	}

	draw() {
		this.renderer.render(this.scene, this.camera);
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	resize() {
		if (!this.renderer) return;
		this.camera.aspect = this.view.sketch.width / this.view.sketch.height;
		this.camera.updateProjectionMatrix();;

		this.renderer.setSize(this.view.sketch.width, this.view.sketch.height);
	}
}
