export default class CanvasBars {

	constructor(view, audio) {
		this.view = view;
		this.audio = audio;

		this.initCanvas();
	}

	initCanvas() {
		this.canvas = document.createElement('canvas');
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		this.ctx = this.canvas.getContext('2d');

		// debug
		this.canvas.style.position = 'absolute';
		this.canvas.style.top = 0;
		this.canvas.style.left = 0;
		this.canvas.style.pointerEvents = 'none';
		document.body.appendChild(this.canvas);
	}

	update() {

	}

	draw() {
		// if (!this.visible) return;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		const values = this.audio.values;
		const oldValues = this.audio.oldValues;
		// const selectedIndices = this.audio.selectedIndices;

		const offset = 1;
		const height = this.canvas.height * 0.2;
		const w = (this.canvas.width - values.length * offset) / values.length;

		for (let i = 0; i < values.length; i++) {
			const h = values[i] * height + 4;
			const x = i * (w + offset);
			const y = this.canvas.height - h;

			let color = '#444';
			/*
			for (let j = 0; j < selectedIndices.length; j++) {
				if (i !== selectedIndices[j]) continue;
				color = '#666';
			}
			*/

			if (values[i] > oldValues[i] + this.audio.kickThreshold) color = '#00ffff';

			// if (values[i] > this.audio.threshold) color = '#00FF00';

			this.ctx.fillStyle = color;
			this.ctx.fillRect(x, y, w, h);
		}

	}
}