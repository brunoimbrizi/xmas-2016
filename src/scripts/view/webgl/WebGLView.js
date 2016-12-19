const glslify = require('glslify');

import ManDeer from './mandeer/ManDeer';

// import NormalLines from './effects/NormalLines';
// import Arrows from './effects/Arrows';
// import Dots from './effects/Dots';

export default class WebGLView {

	constructor(view, audio) {
		this.view = view;
		this.audio = audio;

		this.renderer = this.view.renderer;
		this.clock = new THREE.Clock;
		this.center = new THREE.Vector3();

		this.initThree();
		this.initControls();
		// this.initObject();
		this.initLights();
		this.initFloor();
	}

	init() {
		this.initManDeer();
		// this.initNormalLines();
		// this.initArrows();
		// this.initDots();

		// show
		const time = 2;
		const ease = Expo.easeIn;

		TweenMax.to(this.camera.position, time * 2, { x: -100, y: 96.19, z: -6.1232, ease, onComplete: () => {
			// this.controls.enabled = true;
			this.camera.auto = true;
			TweenMax.to(this.camera, 1, { thetaf: 1, ease: Quad.easeOut });
			document.querySelector('.info').classList.add('none');
		} });
		TweenMax.to(this.camera.rotation, time, { x: -HALF_PI, y: -0.80, z: -HALF_PI, ease });
		TweenMax.to(this.camera.up, time, { x: 0, y: 1, z: 0, ease });
	}

	initThree() {
		// scene
		this.scene = new THREE.Scene();

		// camera
		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
		// this.camera.position.set(-98.30, -5.21, -20.20);
		// this.camera.rotation.set(2.88, -1.36, 2.88);
		// this.camera.up.set(-0.053, 0.998, 0.001);

		this.camera.position.set(0, 300, 0);
		this.camera.rotation.set(-HALF_PI, 0, -HALF_PI);
		this.camera.up.set(1, 0, 0);

		this.camera.auto = false;
		this.camera.theta = HALF_PI;
		this.camera.thetaf = 1.2;
	}

	initControls() {
		this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
		this.controls.target.set(0, 0, 0);
		this.controls.rotateSpeed = 2.0;
		this.controls.zoomSpeed = 0.8;
		this.controls.panSpeed = 0.8;
		this.controls.noZoom = false;
		this.controls.noPan = true;
		this.controls.staticMoving = false;
		this.controls.dynamicDampingFactor = 0.15;
		this.controls.maxDistance = 300;
		this.controls.enabled = false;
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

		const lightB = new THREE.PointLight(0xE6335A, 0.4);
		lightB.position.set(300, 1, -150);
		lightB.iniPosition = lightB.position.clone();
		this.camera.add(lightB);

		// const lightC = new THREE.PointLight(0xCCCCCC);
		const lightC = new THREE.PointLight(0x00FFFF, 0.4);
		lightC.position.set(-120, -30, -220);
		this.camera.add(lightC);

		const lightD = new THREE.PointLight(0xCCCC00, 0.4);
		lightD.position.set(50, 0, -150);
		lightD.visible = false;
		this.camera.add(lightD);

		this.lightB = lightB;
		this.lightC = lightC;
		this.lightD = lightD;

		this.scene.add(this.camera);
	}

	initManDeer() {
		this.mandeer = new ManDeer(this);
		this.mandeer.object.position.y = -25;
		this.scene.add(this.mandeer.object);
		// this.scene.add(this.mandeer.helper);

		this.mandeer.object.material.needsUpdate = true;
	}

	initFloor() {
		let texture = null;
		if (this.view.canvasFloor) texture = new THREE.Texture(this.view.canvasFloor.canvas);

		const geometry = new THREE.CircleBufferGeometry(512, 32);
		const material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, map: texture });

		this.floor = new THREE.Mesh(geometry, material);
		this.floor.rotation.x = -HALF_PI;
		this.floor.position.y = -24;
		this.scene.add(this.floor);
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
		// this.scene.add(this.dots.object);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
		if (!this.camera.auto) {
			this.controls.update();
		} else {
			this.camera.theta += 0.01 * this.camera.thetaf;

			this.camera.position.x = sin(this.camera.theta) * -100;
			this.camera.position.y = cos(this.camera.theta * 0.25) * 50 + 50;
			this.camera.position.z = cos(this.camera.theta) * -100;
			this.camera.lookAt(this.center);
		}

		if (this.mandeer) {
			this.mandeer.update(this.clock.getDelta());
			// this.normalLines.update();
			// this.arrows.update();
			// this.dots.update();
		}

		if (this.floor && this.floor.material.map) {
			this.floor.material.map.needsUpdate = true;
		}

		this.lightB.position.z = this.audio.values[10] * this.lightB.iniPosition.z;
	}

	draw() {
		this.renderer.render(this.scene, this.camera);
	}

	dance() {
		if (this.mandeer) {
			this.mandeer.dance();
			return true;
		}

		return false;
	}

	knm(active) {
		this.lightD.visible = active;
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

	touchstart(touch) {
		if (!this.camera.auto) return;
		this.controls.enabled = true;
		this.camera.auto = false;
	}
}
