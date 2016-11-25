const glslify = require('glslify');

export default class NormalLines {

	constructor(target) {
		this.target = target;

		this.initLines();
	}

	initLines() {
		const indices = [];
		const positions = [];
		const colors = [];

		// get positions from target
		const tVertices = this.target.geometry.vertices;
		const tFaces = this.target.geometry.faces;
		const tScale = this.target.scale.x;

		for (let i = 19, j = 0; i < 20; i++) {
			const face = tFaces[i];
			const normal = face.normal.clone();
			const centroid = this.getCentroid(tVertices[face.a], tVertices[face.b], tVertices[face.c]);

			const v1 = centroid.clone().multiplyScalar(tScale);
			const v2 = v1.clone().add(normal.multiplyScalar(150));

			positions.push(v1.x, v1.y, v1.z);
			positions.push(v2.x, v2.y, v2.z);

			colors.push(1, 1, 1);
			colors.push(1, 1, 1);

			indices.push(j, j + 1);

			j += 2;
		}

		// construct geometry
		const geometry = new THREE.BufferGeometry();
		geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));
		geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
		geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

		const material = new THREE.ShaderMaterial({
			uniforms: {},
			vertexShader: glslify('../../../../shaders/normal-line.vert'),
			fragmentShader: glslify('../../../../shaders/normal-line.frag'),
			wireframe: true
		});

		this.object = new THREE.LineSegments(geometry, material);
	}

	getCentroid(va, vb, vc) {
		const v = new THREE.Vector3();

		v.x = (va.x + vb.x + vc.x) / 3;
		v.y = (va.y + vb.y + vc.y) / 3;
		v.z = (va.z + vb.z + vc.z) / 3;

		return v;
	}

	update() {

	}
}
