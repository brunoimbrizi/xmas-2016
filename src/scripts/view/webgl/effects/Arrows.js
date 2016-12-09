const glslify = require('glslify');

import { getCentroid } from '../../../util/geom';
import { getNormal } from '../../../util/geom';

export default class Arrows {

	constructor(target) {
		this.target = target;

		this.initArrows();
	}

	initArrows() {
		/*
		const geometry = new THREE.BoxBufferGeometry(2, 2, 2);
		const material = new THREE.MeshBasicMaterial({
			color: 0xFF0000,
		});

		const vertices = this.target.object.geometry.vertices;
		const face = this.target.object.geometry.faces[80];
		const normal = face.normal.clone();
		const centroid = getCentroid(vertices[face.a], vertices[face.b], vertices[face.c]);
		
		// this.object = new THREE.Mesh(geometry, material);
		// const origin = this.target.object.geometry.vertices[210].clone().multiplyScalar(30);
		const origin = centroid.clone().multiplyScalar(30);
		origin.add(this.target.object.position);
		// this.object.position.copy(pos);

		const dir = normal;
		*/

		this.object = new THREE.ArrowHelper(new THREE.Vector3(), new THREE.Vector3(), 10);
	}

	getMorphedFace(index) {
		const vA = new THREE.Vector3();
		const vB = new THREE.Vector3();
		const vC = new THREE.Vector3();

		const tempA = new THREE.Vector3();
		const tempB = new THREE.Vector3();
		const tempC = new THREE.Vector3();

		let fvA, fvB, fvC;
		const geometry = this.target.object.geometry;
		const material = this.target.object.material;
		const vertices = geometry.vertices;
		const faces = geometry.faces;

		// for ( let f = 0, fl = faces.length; f < fl; f ++ ) {
			const face = faces[ index ];
			const faceMaterial = material;

			fvA = vertices[ face.a ];
			fvB = vertices[ face.b ];
			fvC = vertices[ face.c ];

			if ( faceMaterial.morphTargets === true ) {
				var morphTargets = geometry.morphTargets;
				var morphInfluences = this.target.object.morphTargetInfluences;

				vA.set( 0, 0, 0 );
				vB.set( 0, 0, 0 );
				vC.set( 0, 0, 0 );

				for ( var t = 0, tl = morphTargets.length; t < tl; t ++ ) {

					var influence = morphInfluences[ t ];

					if ( influence === 0 ) continue;

					var targets = morphTargets[ t ].vertices;

					vA.addScaledVector( tempA.subVectors( targets[ face.a ], fvA ), influence );
					vB.addScaledVector( tempB.subVectors( targets[ face.b ], fvB ), influence );
					vC.addScaledVector( tempC.subVectors( targets[ face.c ], fvC ), influence );

				}

				vA.add( fvA );
				vB.add( fvB );
				vC.add( fvC );

				// fvA = vA;
				// fvB = vB;
				// fvC = vC;

				// console.log(fvA, fvB, fvC);
				
				return [vA, vB, vC];
			}
		// }
	}

	update() {
		const faceIndex = 80;
		const morphedFace = this.getMorphedFace(faceIndex);

		const centroid = getCentroid(morphedFace[0], morphedFace[1], morphedFace[2]);
		const origin = centroid.multiplyScalar(this.target.scale).add(this.target.object.position);
		const dir = getNormal(morphedFace[0], morphedFace[1], morphedFace[2]);

		this.object.position.copy(origin);
		this.object.setDirection(dir);
	}
}
