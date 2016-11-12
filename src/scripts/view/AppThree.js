const glslify = require('glslify');

export default class AppThree {

	constructor(view) {
		this.view = view;
		this.renderer = this.view.renderer;
		this.clock = new THREE.Clock;

		this.initThree();
		this.initControls();
		this.initObject();
		this.initSkinnedMesh();
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
			vertexShader: glslify('../../shaders/default.vert'),
			fragmentShader: glslify('../../shaders/default.frag'),
			wireframe: true
		});

		const mesh = new THREE.Mesh(geometry, material);
		this.scene.add(mesh);
	}

	initSkinnedMesh() {
		// const url = 'models/simple-1.json';
		// const url = 'models/new_exporter_test_pyramid_scene.json';
		const url = 'models/test-02.json';
		const loader = new THREE.ObjectLoader();

		loader.load(url, (obj) => {
			const skinnedMesh = obj.children[0];
			// console.log(skinnedMesh);
			skinnedMesh.material.skinning = true;
			skinnedMesh.material.shininess = 0.0;

			skinnedMesh.updateMatrixWorld();

			this.scene.add(skinnedMesh);

			this.mixer = new THREE.AnimationMixer(skinnedMesh);
			// for (let i = 0; i < skinnedMesh.geometry.animations.length; ++i) {
				// this.mixer.clipAction(skinnedMesh.geometry.animations[i]);
			// }

			this.mixer.clipAction(skinnedMesh.geometry.animations[0]).play();

			this.skinnedMesh = skinnedMesh;
		});



		/*
		const loader = new THREE.JSONLoader();

		// loader.load('models/test-02.json', (geometry, materials) => {
		loader.load('models/simple.js', (geometry, materials) => {

			for (const m of materials) {
				m.skinning = true;
			}

			const skinnedMesh = new THREE.SkinnedMesh(geometry, new THREE.MultiMaterial(materials));
			skinnedMesh.scale.set(1, 1, 1);

			this.scene.add(skinnedMesh);

			this.mixer = new THREE.AnimationMixer(skinnedMesh);
			this.mixer.clipAction(skinnedMesh.geometry.animations[0]).play();
		});
		*/
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
		this.controls.update();

		if (this.skinnedMesh) this.skinnedMesh.updateMatrixWorld();
		if (this.mixer) this.mixer.update(this.clock.getDelta());
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
