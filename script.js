let body, canvas;
window.addEventListener('load', main);

function main() {
	body = document.body;
	canvas = document.getElementById('canvas');
	resizeCanvas();
	// every time the window resizes, we want the size of the
	// canvas to resize, so we set that up as an event listener
	window.addEventListener('resize', resizeCanvas);
	createRain();
}

function resizeCanvas() {
	// subtract a buffer height of 5 so that the content of the
	// canvas fits nicely inside the body
	canvas.height = window.innerHeight - 6;
	canvas.width = window.innerWidth;
}

let stage, droplets;
let activateRain, deactivateRain;
function createRain() {
	// see documentations for EaselJS in the links below: 
	// https://createjs.com/docs/easeljs/
	// https://www.createjs.com/docs/easeljs/modules/EaselJS.html
	
	// Create a stage by getting a reference to the canvas
    stage = new createjs.Stage("canvas");
    droplets = [];
    let rain_interval = null;
    function activateRainSecret(stage, droplets){
		rain_interval = createRainInterval(stage, droplets);
	};
	function deactivateRainSecret() {
		clearInterval(rain_interval);
	}
	function createRainInterval(stage, droplets) {
		// this update time interval is in milliseconds
		const update_time_interval = 10; 
		const interval = setInterval(function() {
			for (let index = 0; index < droplets.length; index += 1) {
				droplets[index].droplet.y += droplets[index].speed;
				// remove any of the droplet that can't be seen on the canvas
				if (droplets[index].droplet.y > stage.canvas.height) {
					stage.removeChild(droplets[index].droplet);
					droplets.splice(index, 1);
					index--;
				}
			}
			
	
			stage.update();
			// randomly add a new droplet
			if (Math.random() > 0.3) {
				droplets.push(createDropletOnStage(stage));
			}
		}, update_time_interval);
		return interval;
	}
	
	function createDropletOnStage(stage) {
		const droplet = {};
		const canvas_width = stage.canvas.width, canvas_height = stage.canvas.height;
		const width = 5, height = 4 + Math.round(Math.random()*13);
		droplet.droplet = new createjs.Shape();
		const random_color = createRandomHex();
		droplet.droplet.graphics.beginFill(random_color).drawRect(0, 0, width, height);
		droplet.droplet.x = Math.round(Math.random() * canvas_width);
		droplet.droplet.y = -20;
		// set the speed randomly
		droplet.speed = 2 + Math.random() * 12;
		// add the droplet to the stage
		stage.addChild(droplet.droplet);
		return droplet;
	}
	let POSSIBLE_COLOR_VALUES = '0123456789abcdef'.split('');
	function createRandomHex() {
		let red = randomHex(), green = randomHex(), blue = randomHex();
		return `#${red}${green}${blue}`;
	}
	function randomHex() {
		let c = '';
		c += POSSIBLE_COLOR_VALUES[Math.floor(Math.random() * POSSIBLE_COLOR_VALUES.length)];
		c += POSSIBLE_COLOR_VALUES[Math.floor(Math.random() * POSSIBLE_COLOR_VALUES.length)];
		return c;
	}
	activateRain = () => activateRainSecret(stage, droplets);
	deactivateRain = () => deactivateRainSecret();
	activateRain();
}



