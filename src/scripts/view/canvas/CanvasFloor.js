export default class CanvasFloor {

	constructor(view, audio) {
		this.view = view;
		this.audio = audio;

		this.circles = [];

		this.lastBeat = 0;
		this.minBeatInterval = 500; // ms

		this.initCanvas();
	}

	initCanvas() {
		this.canvas = document.createElement('canvas');
		this.canvas.width = this.canvas.height = 1024;

		this.ctx = this.canvas.getContext('2d');

		// debug
		// this.canvas.style.position = 'absolute';
		// this.canvas.style.top = 0;
		// this.canvas.style.left = 0;
		// document.body.appendChild(this.canvas);
	}

	update() {
		// clean
		for (let i = 0; i < this.circles.length; i++) {
			const c = this.circles[i];
			if (c.radius >= this.canvas.width * 0.5) this.circles.splice(i, 1);
		}

		// minimun interval between beats
		const time = Date.now();
		if (time - this.lastBeat < this.minBeatInterval) return;

		const bin = 16;
		if (this.audio.values[bin] > this.audio.oldValues[bin] + this.audio.kickThreshold) {
			this.addCircle();
			this.lastBeat = time;
		}
	}

	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		this.ctx.fillStyle = '#CCCCCC';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.fillStyle = 'white';

		this.ctx.save();
		this.ctx.translate(this.canvas.width * 0.5, this.canvas.height * 0.5);

		// draw
		for (let i = 0; i < this.circles.length; i++) {
			const c = this.circles[i];

			this.ctx.beginPath();
			this.ctx.arc(0, 0, c.radius, 0, TWO_PI);
			if (c.radius > c.thickness) this.ctx.arc(0, 0, c.radius - c.thickness, 0, TWO_PI, true);
			this.ctx.closePath();
			this.ctx.fill();
		}

		this.ctx.restore();
	}

	addCircle() {
		const c = { radius: 0, thickness: 2 };
		this.circles.push(c);

		TweenMax.to(c, 5, { radius: this.canvas.width * 0.5 + c.thickness * 1.2, ease: Quart.easeOut } );
	}
}
