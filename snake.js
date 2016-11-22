
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var size = 10;
var dir;
var next_dir;
var snakeArr;
var food;
var score;
var paused = true;
var game_over = false;

function createSnake(length) {
	var arr = [];
	for(var i=length+1; i>0; i--) {
		arr.push({x:i, y:0});
	}
	return arr;
}

function doesSnakeContain(start, x, y) {
	for(var i=start; i<snakeArr.length; i++) {
		if(snakeArr[i].x == x && snakeArr[i].y == y) {
			return true;
		}
	}
	return false;
}

function createFood() {
	var f;
	do {
		f = { x: Math.floor(Math.random() * canvas.width / size),
			y: Math.floor(Math.random() * canvas.height / size) };
	} while (doesSnakeContain(0, f.x, f.y));
	return f;
}

function init() {
	dir = next_dir = "right";
	snakeArr = createSnake(5);
	food = createFood();
	score = 0;
	updateScore();
}

function updateScore() {
	$("#score").text("Score: " + score.toString());
}

function checkFood() {
	if(snakeArr[0].x == food.x && snakeArr[0].y == food.y) {
		score++;
		updateScore();
		food = createFood();
	} else {
		snakeArr.pop();
	}
}

function checkCollision() {
	if(snakeArr[0].x < 0 || snakeArr[0].y < 0 ||
		snakeArr[0].x >= Math.floor(canvas.width / size) ||
		snakeArr[0].y >= Math.floor(canvas.height / size) ||
		doesSnakeContain(2, snakeArr[0].x,snakeArr[0].y)) {
			game_over = true;
	}
}

function update() {
	if(paused || game_over) return;
	dir = next_dir;
	var nx = snakeArr[0].x;
	var ny = snakeArr[0].y;
	switch(dir) {
		case "right": nx++; break;
		case "left": nx--; break;
		case "up": ny--; break;
		case "down": ny++; break;
	}
	dirChangeStep = true;
	snakeArr.unshift({x:nx, y:ny});
	checkFood();
	checkCollision();
}

function draw() {
	if(paused) 
		$("#paused_text").show();
	else
		$("#paused_text").hide();
	if(game_over)
		$("#game_over_text").show();
	else
		$("#game_over_text").hide();
		
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "blue";
	snakeArr.forEach(function(item) {
		ctx.fillRect(item.x * size + 1, item.y * size + 1, size - 2, size - 2);
	});
	ctx.fillStyle = "green";
	ctx.fillRect(food.x * size + 1, food.y * size + 1, size - 2, size - 2);
}

var FPS = 15;
setInterval(function() {
	update();
	draw();
}, 1000 / FPS);

$(document).keydown(function(e){
	paused = false;
	if(game_over) {
		game_over = false;
		init();
	}
	var key = e.which;
	if(key == "37" && dir != "right") {
		next_dir = "left";
	} else if(key == "38" && dir != "down") {
		next_dir = "up";
	} else if(key == "39" && dir != "left") {
		next_dir = "right";
	} else if(key == "40" && dir != "up") {
		next_dir = "down";
	} else if(key == "19") {
		paused = true;
	}
});

onload = init;

