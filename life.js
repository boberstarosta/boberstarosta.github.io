
$(document).ready(function() {

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	
	var cellSize = 10;
	var mapWidth = canvas.width / cellSize;
	var mapHeight = canvas.height / cellSize;

	function generateRandomMap() {
		var map = [mapWidth * mapHeight];
		for(var i = 0; i < mapWidth * mapHeight; i++)
			map[i] = Math.random() < 0.2 ? true : false;
		return map;
	}
		
	var map = generateRandomMap();

	function countLiveNeighbors(x, y) {
		var count = 0;
		for(var ny = y - 1; ny <= y + 1; ny++)
			for(var nx = x - 1; nx <= x + 1; nx++)
				if((!(nx == x && ny == y)) && 
				nx >= 0 && nx < mapWidth && ny >= 0 && ny <= mapHeight)
					if(map[nx + ny * mapWidth])
						count++;
		return count;
	}
	
	function update() {
		var newMap = [mapWidth * mapHeight];
		for(var y = 0; y < mapHeight; y++)
			for(var x = 0; x < mapWidth; x++) {
				var lnc = countLiveNeighbors(x, y);
				if (map[x + y * mapWidth]) {
					if(lnc == 2 || lnc == 3) newMap[x + y * mapWidth] = true;
					else newMap[x + y * mapWidth] = false;
				} else {
					if(lnc == 3) newMap[x + y * mapWidth] = true;
					else newMap[x + y * mapWidth] = false;
				}
			}
		map = newMap;
	}
	
	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "blue";
		for(var y = 0; y < mapHeight; y++)
			for(var x = 0; x < mapWidth; x++)
				if (map[x + y * mapWidth])
					ctx.fillRect(x * cellSize, y * cellSize,
						cellSize - 1, cellSize - 1);
	}

	var FPS = 30;
	setInterval(function() {
		update();
		draw();
	}, 1000 / FPS);
	
});
