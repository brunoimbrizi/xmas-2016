const glslify = require('glslify');

export default class AppThree {

	constructor(view) {
		this.view = view;
		this.renderer = this.view.renderer;
		this.clock = new THREE.Clock;

		this.initThree();
		this.initControls();
		// this.initObject();
		this.initLights();
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

	initLights() {
		const lightA = new THREE.DirectionalLight(0xFFFFFF)
		this.scene.add(lightA);
	}

	initSkinnedMesh() {
		const loader = new THREE.JSONLoader();

		loader.load('models/man-deer-08.js', (geometry, materials) => {

			for (const m of materials) {
				m.skinning = true;
				m.morphTargets = true;
			}

			// const material = materials[0];
			const material = new THREE.MeshPhongMaterial();
			material.skinning = true;
			material.specular.setHSL(0, 0, 0.1);
			material.color.setHSL(0.6, 0, 0.6);
			material.shading = THREE.FlatShading;

			const skinnedMesh = new THREE.SkinnedMesh(geometry, material);
			skinnedMesh.scale.set(30, 30, 30);

			this.scene.add(skinnedMesh);

			this.mixer = new THREE.AnimationMixer(skinnedMesh);
			this.mixer.clipAction(skinnedMesh.geometry.animations[0]).play();

			this.helper = new THREE.SkeletonHelper(skinnedMesh);
			this.helper.material.linewidth = 3;
			// this.helper.visible = false;
			this.scene.add(this.helper);
		});
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
		this.controls.update();

		if (this.skinnedMesh) this.skinnedMesh.updateMatrixWorld();
		if (this.mixer) this.mixer.update(this.clock.getDelta());
		if (this.helper) this.helper.update();
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
