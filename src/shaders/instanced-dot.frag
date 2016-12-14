// @author brunoimbrizi / http://brunoimbrizi.com

precision highp float;

uniform sampler2D map;

varying vec2 vUv;

void main() {
	// gl_FragColor = texture2D(map, vUv);
	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}