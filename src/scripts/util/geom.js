export function getCentroid(va, vb, vc) {
	const v = new THREE.Vector3();

	v.x = (va.x + vb.x + vc.x) / 3;
	v.y = (va.y + vb.y + vc.y) / 3;
	v.z = (va.z + vb.z + vc.z) / 3;

	return v;
}

export function getNormal(va, vb, vc) {
	const n = new THREE.Vector3();
	const u = new THREE.Vector3();
	const v = new THREE.Vector3();

	u.subVectors(vc, vb);
	v.subVectors(va, vb);

	u.cross(v);
	u.normalize();

	return u;
}

export function getMorphedFace(mesh, index) {
	const vA = new THREE.Vector3();
	const vB = new THREE.Vector3();
	const vC = new THREE.Vector3();

	const tempA = new THREE.Vector3();
	const tempB = new THREE.Vector3();
	const tempC = new THREE.Vector3();

	let fvA, fvB, fvC;
	const geometry = mesh.geometry;
	const material = mesh.material;
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
			var morphInfluences = mesh.morphTargetInfluences;

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

export function getMorphedVertex(mesh, index) {
	const vA = new THREE.Vector3();
	const tempA = new THREE.Vector3();

	const geometry = mesh.geometry;
	const material = mesh.material;
	const vertices = geometry.vertices;
	const fvA = vertices[ index ];

	const morphTargets = geometry.morphTargets;
	const morphInfluences = mesh.morphTargetInfluences;

	for ( var t = 0, tl = morphTargets.length; t < tl; t ++ ) {

		var influence = morphInfluences[ t ];

		if ( influence === 0 ) continue;

		var targets = morphTargets[ t ].vertices;

		vA.addScaledVector( tempA.subVectors( targets[ index ], fvA ), influence );
	}

	vA.add( fvA );

	return vA;
}
