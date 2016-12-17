// @author brunoimbrizi / http://brunoimbrizi.com

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;

#ifdef USE_MORPHTARGETS

	#ifndef USE_MORPHNORMALS

	uniform float morphTargetInfluences[ 8 ];

	#else

	uniform float morphTargetInfluences[ 4 ];

	#endif

#endif

void main() {
	vUv = uv;
	vNormal = normalize( normalMatrix * normal );

	vec3 transformed = vec3( position );

	#ifdef USE_MORPHTARGETS

		transformed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];
		transformed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];
		transformed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];
		transformed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];

		#ifndef USE_MORPHNORMALS

		transformed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];
		transformed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];
		transformed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];
		transformed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];

		#endif

	#endif

	vPos = vec3( transformed );

	// gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );
}
