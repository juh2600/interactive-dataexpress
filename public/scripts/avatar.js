const Avatar = {
	fields: {
		eyes: null,
		nose: null,
		mouth: null,
		color: null,
		preview: null
	},

	rainbow: function(numOfSteps, step) {
		var r, g, b;
		var h = step / numOfSteps;
		var i = ~~(h * 6);
		var f = h * 6 - i;
		var q = 1 - f;
		switch(i % 6){
			case 0: r = 1; g = f; b = 0; break;
			case 1: r = q; g = 1; b = 0; break;
			case 2: r = 0; g = 1; b = f; break;
			case 3: r = 0; g = q; b = 1; break;
			case 4: r = f; g = 0; b = 1; break;
			case 5: r = 1; g = 0; b = q; break;
		}
		var c = ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
		return (c);
	},

	updatePicture: function() {
		let newColor = this.rainbow(360, this.fields.color.value);
		this.fields.preview.src = `http://api.adorable.io/avatars/face/eyes${this.fields.eyes.value}/nose${this.fields.nose.value}/mouth${this.fields.mouth.value}/${newColor}`;
	},

	init: function() {
		Object.keys(this.fields).forEach((field) => {
			let cap = field[0].toLocaleUpperCase() + field.substr(1);
			console.log(cap);
            this.fields[field] = document.getElementById(`avatar${cap}`);
            if(field == "color") 
                this.fields[field].addEventListener('change', () => this.updatePicture());
            else
			    this.fields[field].addEventListener('input', () => this.updatePicture());
		});
			this.updatePicture();
	}
};

document.addEventListener('DOMContentLoaded', () => Avatar.init());
