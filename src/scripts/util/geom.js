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