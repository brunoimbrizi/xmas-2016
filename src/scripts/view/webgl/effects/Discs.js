const glslify = require('glslify');

export default class Discs {

	constructor(target) {
		this.target = target;
		this.frame = 0;

		this.initDiscs();
	}

	initDiscs() {
		const geometry = new THREE.BoxBufferGeometry(4, 4, 4);
		const material = new THREE.MeshBasicMaterial({
			color: 0xFF0000,
		});
		
		this.object = new THREE.Mesh(geometry, material);
	}

	update() {
		const frame = round(this.frame);
		const pos = this.target.geometry.morphTargets[frame].vertices[200].clone().multiplyScalar(30);
		this.object.position.copy(pos);

		if (this.frame < this.target.geometry.morphTargets.length - 1) this.frame++;
		else this.frame = 0;
	}
}
