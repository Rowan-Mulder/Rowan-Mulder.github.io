"use strict"

console.clear();
var roadPositions = [-220, -110, 0, 110, 220];
var currentPosition = 3; //A number between 0-4.
var placePoint = 2;
var brakes = false;
var count;
var flashCount = 0;
var policeLightsFlashing;
var policeArrival;
var braking;
var speed = 0; //A number between 0-11.
var obstacleSpawnChance = 2; //A number between 0-10. The higher the number, the more occasionally obstacles will be placed.
var obstacleSpawnLimit = 10;
var freeArrayPosition = -1;
var obstacles = [];
var score = 0;
var highscore = 0;



document.addEventListener('keydown', (event) => {
	const keyName = event.key;
	
	switch (keyName) {
		case "ArrowUp":
		case "w":
			if (controlsUp.disabled == false) {
				SpeedUp();
			}
			break;
		case "ArrowLeft":
		case "a":
			if (controlsLeft.disabled == false) {
				MoveLeft();
			}
			break;
		case "ArrowDown":
		case "s":
			if (controlsDown.disabled == false) {
				SlowDown();
			}
			break;
		case "ArrowRight":
		case "d":
			if (controlsRight.disabled == false) {
				MoveRight();
			}
			break;
		case " ": //Spacebar
			if (brake.disabled == false) {
				Brake();
			}
			break;
		case "Enter": //Return
			if (info.style.display == "block") {
				HideInfo();
			}
			
			if (boete.style.display == "block") {
				BoeteBetalen();
			}
			
			if (gameOver.style.display == "block") {
				Reset();
			}
			break;
	}
}, false);



function ShowInfo() {
	document.getElementById("info").style.display = "block";
	
	difficultyEasy.disabled = true;
	difficultyHard.disabled = true;
	difficultyMedium.disabled = true;
	controlsLeft.disabled = true;
	controlsRight.disabled = true;
	controlsUp.disabled = true;
	controlsDown.disabled = true;
	brake.disabled = true;
}


function HideInfo() {
	document.getElementById("info").style.display = "none";
	RoadScrolling();
	ObstaclePositioner();
	
	difficultyEasy.disabled = false;
	difficultyHard.disabled = false;
	difficultyMedium.disabled = false;
	controlsLeft.disabled = false;
	controlsRight.disabled = false;
	controlsUp.disabled = false;
	controlsDown.disabled = false;
	brake.disabled = false;
}


function DifficultySet() {
	if (speed == 0) {
		SoundPlayer(engineStart);
	}
	
	if (difficultyHard.checked) {
		speed = 10;
	} else if (difficultyMedium.checked) {
		speed = 6;
	} else if (difficultyEasy.checked) {
		speed = 3;
	}
	
	UpdateSpeed();
}


function DifficultyRefresh() {
	if (speed == 10) {
		difficultyHard.checked = true;
	} else if (speed == 6) {
		difficultyMedium.checked = true;
	} else if (speed == 3) {
		difficultyEasy.checked = true;
	}
	
	UpdateSpeed();
}


function UpdateSpeed() {
	document.getElementById("speedometer").innerHTML = "Speed: " + speed * 10 + "km/hr";
	
	if (speed == 11) {
		difficultyEasy.disabled = true;
		difficultyHard.disabled = true;
		difficultyMedium.disabled = true;
		controlsUp.disabled = true;
		controlsDown.disabled = true;
		brake.disabled = true;
		
		speedometer.style.color = "#f00";
		policeLife.value = 3;
		policeLife.style.display = "block";
		PoliceLights();
		SoundPlayer(policeSiren);
		policeCar.style.transition = "3s";
		policeCar.style.bottom = 0;
		policeArrival = setInterval( function() {
			clearInterval(policeArrival);
			controlsLeft.disabled = true;
			controlsRight.disabled = true;
			Brake()
			boete.style.display = "block";
			gameArea.style.filter = "blur(3px)"; //Does not work on Internet Explorer
		}, 4000 );
	} else {
		speedometer.style.color = "#000";
	}
}


function PoliceLights() {
	policeLights.style.display = "block";
	policeLightsFlashing = setInterval( function() {
		if ((flashCount % 2) == 0 || flashCount == 0) {
			policeLights.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
		} else {
			policeLights.style.backgroundColor = "rgba(0, 0, 255, 0.2)";
		}
		
		flashCount++;
	}, 1000 );
}


function BoeteBetalen() {
	SoundPlayer(cashregister);
	clearInterval(policeLightsFlashing);
	flashCount = 0;
	policeLights.style.display = "none";
	policeLights.style.backgroundColor = "rgba(255, 255, 255, 0.0)";
	gameArea.style.filter = "blur(0px)"; //Does not work on Internet Explorer
	boete.style.display = "none";
	policeCar.style.transition = "0s";
	policeCar.style.bottom = "-200px";
	
	ControlsToggle(false);
}


function UpdateDifficulty() {
	if (speed >= 10) {
		difficultyHard.checked = true;
	} else if (speed > 3 && speed < 10) {
		difficultyMedium.checked = true;
	} else if (speed <= 3) {
		difficultyEasy.checked = true;
	}
}


function MoveLeft() {
	if (currentPosition != 0 && speed != 0) {
		currentPosition--;
		player.style.left = roadPositions[currentPosition] + "px";
		CarSkidding("left");
	}
}


function MoveRight() {
	if (currentPosition != 4 && speed != 0) {
		currentPosition++;
		player.style.left = roadPositions[currentPosition] + "px";
		CarSkidding("right");
	}
}


function SpeedUp() {
	if (speed < 0 || speed > 11) {
		speed = 0;
		UpdateSpeed();
		UpdateDifficulty();
	}
	
	if (speed == 0) {
		SoundPlayer(engineStart);
	}
	
	if (speed < 11) {
		speed++;
		UpdateSpeed();
		UpdateDifficulty();
	}
}


function SlowDown() {
	if (speed < 0 || speed > 11) {
		speed = 0;
	}
	
	if (speed > 0) {
		speed--;
		UpdateSpeed();
		UpdateDifficulty();
	}
	
	if (speed == 0) {
		engineStart.load();
	}
}


function RoadScrolling() {
	count = 0;
	
	setInterval( function() {
		road.style.bottom = count + "px";
		
		for (var i = 0; i < obstacleSpawnLimit; i++) {
			var obstacle = document.getElementById("obstacle" + i);
			if (obstacle.style.bottom.replace("px", "") >= -500) {
				obstacle.style.bottom = (parseInt(obstacle.style.bottom.replace("px", "")) - speed) + "px";
				
				if (obstacle.style.bottom.replace("px", "") < 95 && obstacle.style.bottom.replace("px", "") > 0 && boete.style.display != "block") {
					if (player.style.left == obstacle.style.left) {
						console.log("Player got hit");
						SoundPlayer(hit);
						obstacle.style.bottom = "-500px";
						playerLife.value--;
						score -= 1000;
						if (playerLife.value == 0) {
							GameOver();
						}
					}
					
					var policeCarPosition = (parseInt(player.style.left.replace("px", "")) + 110) + "px";
					
					if (policeCarPosition == obstacle.style.left && policeSiren.paused == false && boete.style.display != "block") {
						console.log("Police got hit");
						SoundPlayer(hit);
						obstacle.style.bottom = "-500px";
						policeLife.value--;
						if (policeLife.value == 0) {
							PoliceDestroy();
							score += 1000;
						}
					}
				}
			} else {
				//Make obstacle available for re-use by removing it from the obstacles array list
				obstacles[i] = undefined;
			}
		}
		
		if ((count - speed) >= -68) {
			count -= speed;
		} else {
			var tempCount = (count + 69);
			count = (tempCount - speed);
			if (!brakes) {
				ObstaclePlacer();
			}
		}
		
		score += speed;
		if (score > highscore) {
			totalScore.style.color = "#090";
		} else {
			totalScore.style.color = "#000";
		}
		totalScore.innerHTML = "Score: " + score;
	}, 10);
}


function ObstacleSpawnChance() {
	var randomNumber = Math.round(Math.random() * 10);
	
	if (obstacleSpawnChance != 0) {
		if ((Math.sign(obstacleSpawnChance - randomNumber)) != "-1") {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}


function ObstaclePlacer() {
	if (ObstacleSpawnChance()) {
		PlaceObject();
	} else {
		//No obstacle will be placed
	}
}


function PlaceObject() {
	if (CheckObjectsArray() >= 0 && (brakes) == false) {
		ShiftObjects(freeArrayPosition);
		obstacles[freeArrayPosition] = freeArrayPosition;
		ConsoleInfo();
	} else {
		if (brakes) {
			//Object won't be placed if braking
		} else if (freeArrayPosition == -1) {
			//Object array is full
			console.log("Object array is full"); //For dev's
		}
	}
}


function CheckObjectsArray() {
	freeArrayPosition = -1;
	for (var i = 0; i < obstacleSpawnLimit; i++) {
		if (obstacles[i] >= 0) {
			//Current object position in array is already taken
		} else {
			freeArrayPosition = i;
		}
	}
	
	return freeArrayPosition;
}


function ShiftObjects(selectedObject) {
	var obstacle = document.getElementById("obstacle" + selectedObject);
	obstacle.style.bottom = "1000px";
	obstacle.style.left = roadPositions[placePoint] + "px";
}


function ObstaclePositioner() {
	var sweep = "right";
	setInterval( () => {
		if (sweep == "right" && placePoint < 4) {
			placePoint++;
		} else if (sweep == "left" && placePoint > 0) {
			placePoint--;
		}
		
		if (placePoint == 0) {
			sweep = "right";
			placePoint = 0;
		} else if (placePoint == 4) {
			sweep = "left";
			placePoint = 4;
		}
		
		obstaclePositioner.style.left = roadPositions[placePoint] + "px";
	}, 100 );
}


function CarSkidding(direction) {
	if (speed > 6) {
		if (direction == "right") {
			SoundPlayer(skidRight);
		} else if (direction == "left") {
			SoundPlayer(skidLeft);
		}
	}
}


function Brake() {
	if (brakes != true) {
		brakes = true;
		brake.disabled = true;
		controlsUp.disabled = true;
		controlsDown.disabled = true;
		engineStart.load();
		if (speed > 5) {
			SoundPlayer(longSkid);
		} else if (speed > 0 ) {
			SoundPlayer(skidRight);
		}
		
		braking = setInterval( function() {
			if (speed != 0) {
				speed--;
				DifficultyRefresh();
			}
			UpdateSpeed();
			if (speed == 0) {
				clearInterval(braking);
				brakes = false;
				if (flashCount == 0) {
					brake.disabled = false;
					controlsUp.disabled = false;
					controlsDown.disabled = false;
				}
			}
		}, 100);
	}
}


function SoundPlayer(sound) {
	if (sound.paused) {
		sound.play();
	} else {
		sound.load();
		sound.play();
	}
}


function ConsoleInfo() {
	console.clear();
	console.log("Obstacles occupied: " + obstacles);
	if (policeLights.style.display == "block") {
		console.log("Police has arrived for speeding");
	}
	if (!longSkid.paused) {
		console.log("No obstacles will be moved while braking");
	}
}


function ControlsToggle(mode) {
	difficultyEasy.disabled = mode;
	difficultyHard.disabled = mode;
	difficultyMedium.disabled = mode;
	controlsLeft.disabled = mode;
	controlsRight.disabled = mode;
	controlsUp.disabled = mode;
	controlsDown.disabled = mode;
	brake.disabled = mode;
}


function PoliceDestroy() {
	policeSiren.load();
	SoundPlayer(tada);
	SoundPlayer(explode);
	clearInterval(policeLightsFlashing);
	clearInterval(policeArrival);
	flashCount = 0;
	policeLights.style.display = "none";
	policeLights.style.backgroundColor = "rgba(255, 255, 255, 0.0)";
	gameArea.style.filter = "blur(0px)"; //Does not work on Internet Explorer
	boete.style.display = "none";
	policeCar.style.transition = "0s";
	policeCar.style.bottom = "-200px";
	policeLife.style.display = "none";
	
	speed--;
	UpdateSpeed();
	
	ControlsToggle(false);
}


function GameOver() {
	ControlsToggle(true);
	clearInterval(policeArrival);
	if (score > highscore) {
		gameOverScore.innerHTML = "<b>New highscore</b>: <u>" + score + "</u>!";
		highscore = score;
		SoundPlayer(tada);
	} else {
		gameOverScore.innerHTML = "Your score: " + score;
	}
	SoundPlayer(explode);
	player.style.display = "none";
	speed = 0;
	gameOver.style.display = "block";
}


function Reset() {
	gameOver.style.display = "none";
	policeLights.style.display = "none";
	policeSiren.load();
	UpdateDifficulty();
	longSkid.load();
	skidLeft.load();
	skidRight.load();
	beep.load();
	engineStart.load();
	cashregister.load();
	tada.load();
	explode.load();
	for (var i = 0; i < obstacleSpawnLimit; i++) {
		var obstacle = document.getElementById("obstacle" + i);
		obstacle.style.bottom = "-500px";
		obstacles[i] = undefined;
	}
	policeCar.style.transition = "0s";
	policeCar.style.bottom = "-200px";
	UpdateSpeed();
	var placePoint = 2;
	player.style.display = "block";
	road.style.bottom = "0px";
	count = 0;
	score = 0;
	playerLife.value = 10;
	policeLife.value = 3;
	policeLife.style.display = "none";
	totalScore.style.color = "#000";
	ControlsToggle(false);
}



UpdateSpeed();
ShowInfo();