let selectedTableIndex = 0;
let jsonData = {data: [{options:[{name:'left', frequency: 1}, {name:'up', frequency: 2}, {name:'right', frequency: 0}, {name:'down', frequency: 7}, {name:'left', frequency: 20}, {name:'up', frequency: 2}, {name:'right', frequency: 0}, {name:'down', frequency: 7}]}, {options:[{name:'left', frequency: 1}, {name:'up', frequency: 2}]}]}

const canvas = document.getElementById("apiCanvas");
const ctx = canvas.getContext("2d");


const buildTable = () => {
    let selectedTable = jsonData.data[selectedTableIndex];
    //Offset the bars so that there can be units labeled on the canvas
    let offsetForUnits = 30;
    //Gap between bars in pixels
    let barGap = 10;
    //The width of each bar calculated with the grid gap
    let unitBarWidth = (((canvas.width - offsetForUnits) / selectedTable.options.length) - barGap);
    //The maximum bar height measured in frequency
    let maxBarHeight = 0;
    for(let i = 0; i < selectedTable.options.length; i++) {
        if(selectedTable.options[i].frequency > maxBarHeight)
            maxBarHeight = selectedTable.options[i].frequency;
    }
    let topLine = maxBarHeight + 1
    //The amount of pixels of height per 1 frequency. Calculated with space at the top to show that all data is contained. Space at bottom for units
    let unitBarHeight = ((canvas.height-offsetForUnits) / (topLine));


    ctx.lineWidth = 1;
    ctx.font = "lighter 12px Courier";
    ctx.textAlign = "center";
    
    //Determine step counter
    let step = 1;
    let hasTooManySteps = true;
    while(hasTooManySteps) {
        if( topLine / step <= 10) {
            hasTooManySteps = false;
        }
        else {
            if(step == 1) {
                step = 2;
            }
            else if(step == 2) {
                step = 5;
            }
            else {
                step += 5;
            }
        }
    }
    console.log(step);
    //Draw the unit lines
    for(let i = 0; i < topLine + 1; i += step) {
        ctx.strokeStyle = "#ccc";
        ctx.beginPath();
        ctx.moveTo(offsetForUnits, canvas.height - (unitBarHeight*i) - offsetForUnits);
        ctx.lineTo(canvas.width,  canvas.height - (unitBarHeight*i) - offsetForUnits);
        ctx.stroke();

        //Y axis labels
        ctx.strokeStyle = "#000";
        ctx.strokeText(i, offsetForUnits/2, canvas.height - (unitBarHeight*i)+3 - offsetForUnits);
    }

    
    //Color of bars
    ctx.fillStyle = "#222";
    //Loop and draw each bar
    for(let i = 0; i < selectedTable.options.length; i++) {
        let barHeight =  selectedTable.options[i].frequency == 0 ? 3 : unitBarHeight * selectedTable.options[i].frequency;
        ctx.fillRect((unitBarWidth + barGap) * i + offsetForUnits + (barGap/2), ((canvas.height - offsetForUnits) - barHeight) , unitBarWidth, barHeight);

        //X axis labels
        ctx.strokeStyle = "#000";
        ctx.strokeText(selectedTable.options[i].name, ((unitBarWidth +barGap)*(i)) + (unitBarWidth/2) +barGap/2 + offsetForUnits, canvas.height-(offsetForUnits/2));
    }

}

const clearCanvas = () => {
    ctx.canvas.width = ctx.canvas.width;
}



const cycleTable = dir => {
    selectedTableIndex += dir;
    if(selectedTableIndex < 0)
        selectedTableIndex = jsonData.data.length-1;
    else if(selectedTableIndex >= jsonData.data.length)
        selectedTableIndex = 0;
    canvas.style.opacity = 0;
    setTimeout(() => {
        clearCanvas();
        buildTable();
        canvas.style.opacity = 1;
    }, 500);
}



const resizeCanvas = () => {
    canvas.width = Math.floor(document.getElementById("canvasContainer").offsetWidth);
    canvas.height = Math.floor(canvas.width * (9/16));
    //redraw canvas on when the size changes
    clearCanvas();
    buildTable();
}



const init = () => {
    document.getElementById("leftBtn").addEventListener("click", evt => {cycleTable(-1)});
    document.getElementById("rightBtn").addEventListener("click", evt => {cycleTable(1)});
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    fetch("https://localhost:3000/api")
        .then(response => response.json())
        .then(data => {
            jsonData = data;
            buildTable();
        }).catch(err => console.log(err));
}


init();