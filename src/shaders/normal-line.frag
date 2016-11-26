// @author brunoimbrizi / http://brunoimbrizi.com

varying vec3 vColor;

void main() {
	// gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );

	// use green channel as alpha
	gl_FragColor = vec4( vColor.r, 0.0, vColor.b, vColor.g );
	// gl_FragColor = vec4( 0.0, 1.0, 0.0, 1.0 );
}