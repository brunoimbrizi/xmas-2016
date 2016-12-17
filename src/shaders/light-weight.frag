// @author brunoimbrizi / http://brunoimbrizi.com

uniform vec3 directionalLightPos;
uniform vec3 directionalLightColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;
varying vec3 vLightFront;

void main() {
	vec2 uv = vUv;

	// http://www.ro.me/tech/hatching-glow-shader
	float directionalLightWeighting = max( dot( normalize(vNormal), directionalLightPos ), 0.0);
	vec3 lightWeighting = directionalLightColor * directionalLightWeighting;

	vec4 red = vec4( 0.80, 0.09, 0.25, 1.0 );
	vec4 color = vec4( 0.0, 0.0, 0.0, 0.0 );

	if ( length(lightWeighting) < 1.0 ) {
		if ( mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0) {
			color = red;
		}
	}
	
	if ( length(lightWeighting) < 0.5 ) {
		if ( mod(gl_FragCoord.x - gl_FragCoord.y - 6.0, 6.0) == 0.0) {
			color = red;
		}
	}

	// http://www.gamedev.net/topic/529926-terrain-contour-lines-using-pixel-shader/
	float gsize = 20.0;
	float gwidth = length(lightWeighting) * 5.0;

	float f  = fract (vPos.y * gsize);
	float df = fwidth(vPos.y * gsize);

	float g = smoothstep(df * -gwidth, df * gwidth, f);

	float c = 0.0;
	// http://theorangeduck.com/page/avoiding-shader-conditionals
	c += abs(sign(g - 1.0));

	// gl_FragColor = color * c;
    gl_FragColor = vec4(vLightFront, 1.0) + color;
}