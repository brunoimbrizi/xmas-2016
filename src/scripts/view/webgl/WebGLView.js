const glslify = require('glslify');

import ManDeer from './mandeer/ManDeer';

import NormalLines from './effects/NormalLines';

export default class WebGLView {

	constructor(view) {
		this.view = view;
		this.renderer = this.view.renderer;
		this.clock = new THREE.Clock;

		this.initThree();
		this.initControls();
		// this.initObject();
		this.initLights();
		this.initManDeer();
		this.initEffects();
	}

	initThree() {
		// scene
		this.scene = new THREE.Scene();

		// camera
		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.z = 300;
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
		const lightA = new THREE.DirectionalLight(0xFFFFFF)
		this.scene.add(lightA);
	}

	initManDeer() {
		this.mandeer = new ManDeer();
		this.scene.add(this.mandeer.object);
		this.scene.add(this.mandeer.helper);
	}

	initEffects() {
		this.effect = new NormalLines(this.mandeer.object);
		this.scene.add(this.effect.object);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
		this.controls.update();

		if (this.mandeer) {
			this.mandeer.update(this.clock.getDelta());
			this.effect.update();
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
