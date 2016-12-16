import SimplexNoise from 'simplex-noise';
const glslify = require('glslify');

import { getCentroid } from '../../../util/geom';
import { getNormal } from '../../../util/geom';
import { getMorphedFace } from '../../../util/geom';
import { getMorphedVertex } from '../../../util/geom';

export default class Dots {

	constructor(target) {
		this.target = target;

		this.numPoints = 100;
		this.boundingBox = new THREE.Vector3(100, 200, 100);

		this.simplex = new SimplexNoise();

		this.initDots();
	}

	initDots() {
		const uniforms = {};
		// uniforms.map = { value: this.params.map };

		const material = new THREE.RawShaderMaterial({
			uniforms: uniforms,
			vertexShader: glslify('../../../../shaders/instanced-dot.vert'),
			fragmentShader: glslify('../../../../shaders/instanced-dot.frag'),
			// depthTest: false,
			transparent: true,
		});

		const geometry = new THREE.InstancedBufferGeometry();

		/*
		// positions
		const positions = [];
		positions.push(-5, 5, 0);
		positions.push(5, 5, 0);
		positions.push(5, -5, 0);
		positions.push(-5, -5, 0);
		geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( positions ), 3 ) );

		// uvs
		// geometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( this.params.data.uvs ), 2 ) );

		// index
		const indices = [];
		indices.push(0, 1, 2);
		indices.push(3, 0, 2);
		geometry.setIndex( new THREE.BufferAttribute( new Uint16Array( indices ), 1 ) );
		*/

		// geometry.copy( new THREE.PlaneBufferGeometry( 1, 1 ) );
		geometry.copy( new THREE.CircleBufferGeometry( 1, 12 ) );

		const vertices = this.target.object.geometry.vertices;
		const faces = this.target.object.geometry.faces;

		// vertices
		this.numPoints = vertices.length;

		const sizes = new Float32Array( this.numPoints );
		const offsets = new Float32Array( this.numPoints * 3 );

		for (let i = 0, i3 = 0; i < vertices.length; i++, i3 += 3) {
			const vertex = vertices[i];
			vertex.multiplyScalar(this.target.scale);
			vertex.add(this.target.object.position);

			offsets[ i3 + 0 ] = vertex.x;
			offsets[ i3 + 1 ] = vertex.y;
			offsets[ i3 + 2 ] = vertex.z;

			sizes[ i ] = 0.4;
		}

		/*
		// face centroids
		this.numPoints = faces.length;

		const sizes = new Float32Array( this.numPoints );
		const offsets = new Float32Array( this.numPoints * 3 );

		for (let i = 0, i3 = 0; i < faces.length; i++, i3 += 3) {
			const face = faces[i];
			const centroid = getCentroid(vertices[face.a], vertices[face.b], vertices[face.c]);
			centroid.multiplyScalar(this.target.scale);
			centroid.add(this.target.object.position);

			offsets[ i3 + 0 ] = centroid.x;
			offsets[ i3 + 1 ] = centroid.y;
			offsets[ i3 + 2 ] = centroid.z;

			sizes[ i ] = 0.4;
		}
		*/

		geometry.addAttribute( 'size', new THREE.InstancedBufferAttribute( sizes, 1, 1 ) );
		geometry.addAttribute( 'offset', new THREE.InstancedBufferAttribute( offsets, 3, 1 ) );
		
		this.object = new THREE.Mesh( geometry, material );
	}

	update() {
		if (!this.target.object) return;
		if (!this.target.object.geometry.morphTargets.length) return;

		const vertices = this.target.object.geometry.vertices;
		const faces = this.target.object.geometry.faces;

		const offsets = this.object.geometry.attributes.offset.array;
		const sizes = this.object.geometry.attributes.size.array;

		const time = Date.now() * 0.001;

		for ( let i = 0, i3 = 0; i < this.numPoints; i++, i3 += 3 ) {
			const noise = this.simplex.noise2D(time, i);

			// vertices
			const morphedVertex = getMorphedVertex(this.target.object, i);
			morphedVertex.multiplyScalar(this.target.scale);
			morphedVertex.add(this.target.object.position);

			offsets[ i3 + 0 ] = morphedVertex.x;
			offsets[ i3 + 1 ] = morphedVertex.y;
			offsets[ i3 + 2 ] = morphedVertex.z;

			sizes[ i ] = noise * 0.2;

			/*
			// face centroids
			const morphedFace = getMorphedFace(this.target.object, i);
			const centroid = getCentroid(morphedFace[0], morphedFace[1], morphedFace[2]);
			centroid.multiplyScalar(this.target.scale);
			centroid.add(this.target.object.position);

			offsets[ i3 + 0 ] = centroid.x;
			offsets[ i3 + 1 ] = centroid.y;
			offsets[ i3 + 2 ] = centroid.z;
			*/
		}

		this.object.geometry.attributes.offset.needsUpdate = true;
		this.object.geometry.attributes.size.needsUpdate = true;
	}
}
