// @author brunoimbrizi / http://brunoimbrizi.com

uniform vec3 directionalLightPos;
uniform vec3 directionalLightColor;
uniform vec3 ambientLightColor;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
	vec2 uv = vUv;

	float directionalLightWeighting = max( dot( normalize(vNormal), directionalLightPos ), 0.0);
	vec3 lightWeighting = ambientLightColor + directionalLightColor * directionalLightWeighting;

	gl_FragColor = vec4( 0.0, 0.0, 0.0, 0.0 ); // base color

	if ( length(lightWeighting) < 0.5 ) {

	// if ( mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0) {

	  gl_FragColor = vec4( 0.80, 0.09, 0.25, 1.0 );

	// }

	}
	
	// gl_FragColor = texture2D( map, uv );
	// gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}