import 'babel-polyfill';

// global.ControlKit = require('controlkit');
global.Sketch = require('sketch-js');
global.TweenMax = require('gsap');
global.THREE = require('three');
require('./../vendors/TrackballControls.js');

global.createjs = global.createjs || {};
require('createjs-preloadjs');
require('createjs-soundjs');

import App from './App';

function ready(fn) {
	if (document.readyState !== 'loading') {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

ready(() => {
	const app = new App();
	window.app = app;
});
