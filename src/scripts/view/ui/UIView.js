export default class UIView {

	constructor(view) {
		this.view = view;
		this.el = document.querySelector('.ui');

		this.elBeat = this.el.querySelector('.beat');

		this.elBeat.addEventListener('click', this.onBeatClick.bind(this));
	}

	onBeatClick(e) {
		const name = 'beat-01';

		if (app.audio.getPlayer(name)) app.audio.stop(name);
		else app.audio.play(name, { loopTo: 16974 });
	}
}
