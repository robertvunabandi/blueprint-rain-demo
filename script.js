/**
 * This web application makes use of EaselJS in order to add
 * and display things on an HTML canvas tag. Check out EaselJS
 * documentations in the links below.
 * - https://createjs.com/docs/easeljs/
 * - https://www.createjs.com/docs/easeljs/modules/EaselJS.html
 **/

// initialize with some global variables to use
const POSSIBLE_HEX_COLOR_VALUES = "0123456789abcdef".split("");
const UPDATE_TIME_INTERVAL_MS = 10;

// when the page loads, we run the "main" function. We could
// call it anything we wanted, but we chose "main". 
window.addEventListener("load", main);

function main() {
	const canvas = document.getElementById("canvas");
	resizeCanvas(canvas);
	// every time the window (i.e. web browser's window) 
	// resizes, we want the size of the canvas to resize,
	// so we set that up as an event listener
	window.addEventListener("resize", resizeCanvas);
	createRain();
}

function resizeCanvas(canvas) {
	// subtract a buffer height of 5 so that the content of the
	// canvas fits nicely inside the body
	canvas.height = window.innerHeight - 6;
	canvas.width = window.innerWidth;
}

function createRain() {
	// create an EaselJS stage by getting a reference to the canvas 
	// also, create variables to be used throughout the rainfall
    const stage = new createjs.Stage("canvas");
    const droplets = [];
    let rain_interval = null;

    function activateRainSecret(stage, droplets){
    	deactivateRainSecret();
		rain_interval = setInterval(updateDroplets, UPDATE_TIME_INTERVAL_MS);
	}

	function deactivateRainSecret() {
		clearInterval(rain_interval);
	}

	function updateDroplets() {
		for (let index = 0; index < droplets.length; index += 1) {
			// move droplet down
			droplets[index].droplet.y += droplets[index].speed;
			// remove it if it can't be seen on the canvas (i.e. 
			// its height is higher than the canvas height)
			if (droplets[index].droplet.y > stage.canvas.height) {
				stage.removeChild(droplets[index].droplet);
				droplets.splice(index, 1);
				index--;
			}
		}

		// after moving every droplets down, stage 
		// needs to be updated
		stage.update();

		// randomly add a new droplet
		if (Math.random() > 0.3) {
			droplets.push(createDropletOnStage(stage));
		}
	}
	
	function createDropletOnStage(stage) {
		const droplet = {};
		const width = 5, height = 4 + Math.round(Math.random()*13);
		droplet.droplet = new createjs.Shape();
		const random_color = createRandomHex();
		droplet.droplet.graphics.beginFill(random_color).drawRect(0, 0, width, height);
		droplet.droplet.x = Math.round(Math.random() * stage.canvas.width);
		droplet.droplet.y = -20;
		// set the speed randomly
		droplet.speed = 2 + Math.random() * 12;
		// add the droplet to the stage
		stage.addChild(droplet.droplet);
		return droplet;
	}
	
	document.querySelector("#start").onclick = () => activateRainSecret(stage, droplets);
	document.querySelector("#stop").onclick = () => deactivateRainSecret();
	activateRainSecret(stage, droplets);
}

function createRandomHex() {
	let red = twoHex(), green = twoHex(), blue = twoHex();
	return `#${red}${green}${blue}`;
}
function twoHex() {
	return randomHex() + randomHex();
}
function randomHex() {
	const index = Math.floor(Math.random() * POSSIBLE_HEX_COLOR_VALUES.length);
	return POSSIBLE_HEX_COLOR_VALUES[index];
}

