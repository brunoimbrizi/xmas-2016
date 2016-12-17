// @author brunoimbrizi / http://brunoimbrizi.com

uniform vec3 directionalLightPos;
uniform vec3 directionalLightColor;
uniform vec3 ambientLightColor;

struct PointLight {
	vec3 position;
	vec3 color;
	float distance;
};

uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;

void main() {
	vec2 uv = vUv;

	float directionalLightWeighting = max( dot( normalize(vNormal), directionalLightPos ), 0.0);
	vec3 lightWeighting = directionalLightColor * directionalLightWeighting;
	// vec3 lightWeighting = ambientLightColor + directionalLightColor * directionalLightWeighting;

	vec4 red = vec4( 0.80, 0.09, 0.25, 1.0 );
	vec4 color = vec4( 0.0, 0.0, 0.0, 0.0 );

	float gsize = 20.0;
	float gwidth = length(lightWeighting) * 5.0;

	if ( length(lightWeighting) < 1.0 ) {

		if ( mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0) {
			color = red;
		}
	}

	
	if ( length(lightWeighting) < 0.5 ) {

		if ( mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0) {
			color = red;
		}
	}
	

	
	float f  = fract (vPos.y * gsize);
	float df = fwidth(vPos.y * gsize);

	float g = smoothstep(df * -gwidth, df * gwidth, f);

	float c = 0.0;
	c += abs(sign(g - 1.0));
	// c += max(sign(1.0 - g), 0.0);

	// gl_FragColor = color * c;
	// gl_FragColor = red * c;

	// Pretty basic lambertian lighting...
	vec4 addedLights = vec4(0.0, 0.0, 0.0, 1.0);
	for(int l = 0; l < NUM_POINT_LIGHTS; l++) {
		vec3 lightDirection = normalize(vPos - pointLights[l].position);
		addedLights.rgb += clamp(dot(-lightDirection, vNormal), 0.0, 1.0) * pointLights[l].color;
	}

    gl_FragColor = addedLights + color;
	

	/*
	vec3 f  = abs(fract (vPos * 50.0)-0.5);
	vec3 df = fwidth(vPos * 50.0);
	vec3 g = smoothstep(-2.0*df,2.0*df , f);
	float c = g.x * g.y * g.z; 

	gl_FragColor = vec4(c, c, c, 1.0);
	*/

	/*
	float gsize = 20.0;
	float gwidth = 2.0;

	vec3 f  = abs(fract (vPos * gsize)-0.5);
	vec3 df = fwidth(vPos * gsize);
	float mi=max(0.0,gwidth-1.0), ma=max(1.0,gwidth);//should be uniforms
	vec3 g=clamp((f-df*mi)/(df*(ma-mi)),max(0.0,1.0-gwidth),1.0);//max(0.0,1.0-gwidth) should also be sent as uniform
	float c = g.x * g.y * g.z;
	gl_FragColor = vec4(c, c, c, 1.0);
	*/

	// }
	
	// gl_FragColor = texture2D( map, uv );
	// gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}