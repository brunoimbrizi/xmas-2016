// @author brunoimbrizi / http://brunoimbrizi.com

precision highp float;

attribute float size;
attribute vec3 position;
attribute vec3 offset;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;


void main() {
	vUv = uv;

	vec4 mvPosition = modelViewMatrix * vec4( offset, 1.0 );
	mvPosition.xyz += position * size;
	gl_Position = projectionMatrix * mvPosition;

	// gl_Position = projectionMatrix * modelViewMatrix * vec4( offset, 1.0 );
}