const glslify = require('glslify');

export default class ManDeer {

	constructor() {
		this.scale = 30;

		this.initMorphedMesh();
		// this.initSkinnedMesh();
	}

	initMorphedMesh() {
		const loader = new THREE.JSONLoader();

		// loader.load('models/man-deer-08.json', (geometry, materials) => {
		const obj = loader.parse(app.preloader.getResult('model'));
		const geometry = obj.geometry;
		const materials = obj.materials;

		geometry.computeVertexNormals();
		geometry.computeMorphNormals();

		// const material = materials[0];
		// const material = new THREE.MeshBasicMaterial();
		const material = new THREE.MeshPhongMaterial();
		// const material = new THREE.MeshLambertMaterial();
		// const material = new THREE.MeshNormalMaterial();
		// material.color = new THREE.Color(0xE6335A);
		// material.color = new THREE.Color(0x222222);

		/*
		const material = new THREE.ShaderMaterial({
			uniforms: {
				directionalLightPos: { value: new THREE.Vector3(1, 0, 1) },
				directionalLightColor: { value: new THREE.Color(0xFFFFFF) },
			},
			vertexShader: glslify('../../../../shaders/light-weight.vert'),
			fragmentShader: glslify('../../../../shaders/light-weight.frag'),
		});
		*/

		material.morphTargets = true;
		material.morphNormals = true;
		material.vertexColors = THREE.FaceColors;
		// material.specular.setHSL(0, 0, 0.1);
		// material.color.setHSL(0.6, 0, 0.6);
		material.shading = THREE.SmoothShading;
		// material.shading = THREE.FlatShading;
		// material.wireframe = true;

		this.object = new THREE.SkinnedMesh(geometry, material);
		this.object.scale.set(this.scale, this.scale, this.scale);

		this.mixer = new THREE.AnimationMixer(this.object);
		this.actionDance = this.mixer.clipAction(this.object.geometry.animations[0]);
		this.actionNod = this.mixer.clipAction(this.object.geometry.animations[1]);
		// this.mixer.clipAction(this.object.geometry.animations[0]).setDuration(4.0).play();

		// this.actionDance.setDuration(4.0).play();
		this.actionNod.setDuration(1.0).play();

	}

	initSkinnedMesh() {
		const loader = new THREE.JSONLoader();

		// loader.load('models/man-deer-08.json', (geometry, materials) => {
		const obj = loader.parse(app.preloader.getResult('model'));
		const geometry = obj.geometry;

		// const material = materials[0];
		const material = new THREE.MeshPhongMaterial();
		// const material = new THREE.MeshBasicMaterial();
		material.skinning = true;
		material.specular.setHSL(0, 0, 0.1);
		material.color.setHSL(0.6, 0, 0.6);
		material.shading = THREE.FlatShading;
		// material.wireframe = true;

		this.object = new THREE.SkinnedMesh(geometry, material);
		this.object.scale.set(this.scale, this.scale, this.scale);

		this.mixer = new THREE.AnimationMixer(this.object);
		this.mixer.clipAction(this.object.geometry.animations[0]).play();

		this.helper = new THREE.SkeletonHelper(this.object);
		this.helper.material.linewidth = 3;
		// });
	}

	update(delta) {
		this.object.updateMatrixWorld();
		this.mixer.update(delta);
		// this.helper.update();
	}

	dance() {
		this.actionNod.stop();
		this.actionDance.setDuration(4.0).play();
	}

}