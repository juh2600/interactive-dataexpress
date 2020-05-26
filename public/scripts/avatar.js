const eyes = document.getElementById('eyes');
const nose = document.getElementById('nose');
const mouth = document.getElementById('mouth');
const color = document.getElementById('colorPicker');
const picture = document.getElementById('pic');

function rainbow(numOfSteps, step) {
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
};

const updatePicture = () => {
    let newColor = rainbow(360, color.value);
    console.log(newColor);
    picture.src=`http://api.adorable.io/avatars/face/eyes${eyes.value}/nose${nose.value}/mouth${mouth.value}/${newColor}`;
    console.log(picture.src);
};

eyes.addEventListener('input', updatePicture);
nose.addEventListener('input', updatePicture);
mouth.addEventListener('input', updatePicture);
color.addEventListener('input', updatePicture);