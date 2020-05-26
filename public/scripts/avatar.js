const Avatar = {
	fields: {
		eyes: null,
		nose: null,
		mouth: null,
		color: null,
		preview: null
	},

	updatePicture: function() {
		let newColor = Util.rainbow(360, this.fields.color.value);
		this.fields.preview.src = `http://api.adorable.io/avatars/face/eyes${this.fields.eyes.value}/nose${this.fields.nose.value}/mouth${this.fields.mouth.value}/${newColor}`;
	},

	init: function() {
		Object.keys(this.fields).forEach((field) => {
			let cap = field[0].toLocaleUpperCase() + field.substr(1);
			this.fields[field] = document.getElementById(`avatar${cap}`);
			this.fields[field].addEventListener('input', () => this.updatePicture());
		});
			this.updatePicture();
	}
};

document.addEventListener('DOMContentLoaded', () => Avatar.init());
