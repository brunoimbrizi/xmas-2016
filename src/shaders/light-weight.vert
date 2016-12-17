// @author brunoimbrizi / http://brunoimbrizi.com

#define saturate(a) clamp( a, 0.0, 1.0 )
#define PI 3.14159265359

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;
varying vec3 vLightFront;

struct PointLight {
	vec3 position;
	vec3 color;
	float distance;
	float decay;

	int shadow;
	float shadowBias;
	float shadowRadius;
	vec2 shadowMapSize;
};

struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};

struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
};

// directLight is an out parameter as having it as a return value caused compiler errors on some devices
void getPointDirectLightIrradiance( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight directLight ) {

	vec3 lVector = pointLight.position - geometry.position;
	directLight.direction = normalize( lVector );

	float lightDistance = length( lVector );

	directLight.color = pointLight.color;

	// directLight.color *= punctualLightIntensityToIrradianceFactor( lightDistance, pointLight.distance, pointLight.decay );
	// Replaced by return pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );
	// From https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderChunk/bsdfs.glsl
	if (pointLight.decay > 0.0) {
		directLight.color *= pow( saturate( -lightDistance / pointLight.distance + 1.0 ), pointLight.decay );
	}

	directLight.visible = ( directLight.color != vec3( 0.0 ) );
}

uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
uniform vec3 cameraPos;


#ifdef USE_MORPHTARGETS

	#ifndef USE_MORPHNORMALS

	uniform float morphTargetInfluences[ 8 ];

	#else

	uniform float morphTargetInfluences[ 4 ];

	#endif

#endif

void main() {
	vUv = uv;

	vec3 transformed = vec3( position );
	vec3 objectNormal = vec3( normal );

	#ifdef USE_MORPHNORMALS

		objectNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];
		objectNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];
		objectNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];
		objectNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];

	#endif

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

	vec3 transformedNormal = normalMatrix * objectNormal;
	vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );

	GeometricContext geometry;
	geometry.position = mvPosition.xyz;
	geometry.normal = normalize(transformedNormal);
	geometry.viewDir = normalize( -mvPosition.xyz );

	IncidentLight directLight;
	float dotNL;
	vec3 directLightColor_Diffuse;

	vLightFront = vec3( 0.0 );

	#if NUM_POINT_LIGHTS > 0

		for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

			getPointDirectLightIrradiance( pointLights[i], geometry, directLight );

			dotNL = dot( geometry.normal, directLight.direction );
			directLightColor_Diffuse = PI * directLight.color;

			vLightFront += saturate( dotNL ) * directLightColor_Diffuse;

		}

	#endif

	vPos = vec3( transformed );
	// vNormal = normalize( transformedNormal );
	vNormal = normalize( normalMatrix * normal );

	// gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );
}
