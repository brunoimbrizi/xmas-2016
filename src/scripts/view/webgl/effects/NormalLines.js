const glslify = require('glslify');

export default class NormalLines {

	constructor(target, camera) {
		this.target = target;
		this.camera = camera;

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

		for (let i = 0, j = 0; i < tFaces.length; i += 20) {
			const face = tFaces[i];
			const normal = face.normal.clone();
			const centroid = this.getCentroid(tVertices[face.a], tVertices[face.b], tVertices[face.c]);

			const v1 = centroid.clone().multiplyScalar(tScale);
			const v2 = v1.clone().add(normal.multiplyScalar(150));

			positions.push(v1.x, v1.y, v1.z);
			positions.push(v2.x, v2.y, v2.z);

			colors.push(1, 0, 0);
			colors.push(1, 0, 0);

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
			transparent: true
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
		const positions = this.object.geometry.attributes.position.array;
		const colors = this.object.geometry.attributes.color.array;
		const p1 = new THREE.Vector3();
		const p2 = new THREE.Vector3();
		const line = new THREE.Vector3();
		const eye = this.camera.position.clone().normalize();

		for (let i3 = 0, i6 = 0; i6 < positions.length; i3 += 3, i6 += 6) {
			p1.x = positions[i6 + 0];
			p1.y = positions[i6 + 1];
			p1.z = positions[i6 + 2];

			p2.x = positions[i6 + 3];
			p2.y = positions[i6 + 4];
			p2.z = positions[i6 + 5];

			line.x = p2.x - p1.x;
			line.y = p2.y - p1.y;
			line.z = p2.z - p1.z;

			const dot = eye.dot(line.normalize());
			const absDot = (dot < 0) ? dot * -1 : dot;
			// const factor = 1 - absDot;
			const factor = dot;
			
			// green channel
			colors[i6 + 1] = factor;
			colors[i6 + 4] = factor;
		}

		this.object.geometry.attributes.color.needsUpdate = true;
	}
}
