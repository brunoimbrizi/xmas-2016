export default class ManDeer {

	constructor() {
		this.initSkinnedMesh();
	}

	initSkinnedMesh() {
		const loader = new THREE.JSONLoader();

		// loader.load('models/man-deer-08.json', (geometry, materials) => {
		const obj = loader.parse(app.preloader.getResult('model'));
		const geometry = obj.geometry;
		const materials = obj.materials;

		for (const m of materials) {
			m.skinning = true;
			m.morphTargets = true;
		}

		// const material = materials[0];
		// const material = new THREE.MeshPhongMaterial();
		const material = new THREE.MeshBasicMaterial();
		material.skinning = true;
		// material.specular.setHSL(0, 0, 0.1);
		material.color.setHSL(0.6, 0, 0.6);
		material.shading = THREE.FlatShading;
		material.wireframe = true;

		this.object = new THREE.SkinnedMesh(geometry, material);
		this.object.scale.set(30, 30, 30);

		this.mixer = new THREE.AnimationMixer(this.object);
		// this.mixer.clipAction(this.object.geometry.animations[0]).play();

		this.helper = new THREE.SkeletonHelper(this.object);
		this.helper.material.linewidth = 3;
		// });
	}

	update(delta) {
		this.object.updateMatrixWorld();
		this.mixer.update(delta);
		this.helper.update();
	}

}