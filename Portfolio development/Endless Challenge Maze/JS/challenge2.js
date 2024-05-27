let cam;
let poseDetector;
let detections = [];
let items = [];
let points = 0;
let timeLeft = 30;
let endGame = false;
let beeImage; 
let flowerImage; 
let startButton;

function preload() {
  beeImage = loadImage('images/bee.png');
  flowerImage = loadImage('images/flower.png');
}

function setup() {
  let canvas = createCanvas(800, 600); 
  
  let canvasX = (windowWidth - width) / 2;
  let canvasY = (windowHeight - height) / 2;
  canvas.position(canvasX, canvasY);
  
  startButton = createButton('Start Game');
  startButton.position(canvasX + width / 2 - 75, canvasY + height / 2 - 25);
  startButton.mousePressed(startGame);
  
  cam = createCapture(VIDEO);
  cam.size(width, height); 
  cam.hide();
}

function startGame() {
  startButton.hide();
  
  poseDetector = ml5.poseNet(cam, onModelReady);
  poseDetector.on('pose', function(results) {
    detections = results;
  });
  
  for (let i = 0; i < 5; i++) {
    items.push(new GameItem(random(50, width - 50), random(50, height - 50), 50));
  }
  
  setInterval(decreaseTimer, 1000);
}

function onModelReady() {
  console.log('PoseNet Model Loaded');
}

function draw() {
  background(255);
  
  if (!endGame) {
    push();
    translate(width, 0); 
    scale(-1, 1); 
    image(cam, 0, 0, width, height); 
    pop();
    
    for (let item of items) {
      item.render();
    }
    
    renderPoses();
    detectInteractions();
    
    textSize(24);
    fill(0);
    text('Punten: ' + points, 20, 40);
    text('Tijd: ' + timeLeft, width - 120, 40);
  } else {
    textSize(32);
    fill(15, 62, 31);
    textAlign(CENTER, CENTER);
    text('Game Over', width / 2, height / 2 - 50);
    textSize(24);
    text('Punten: ' + points, width / 2, height / 2);
    
    fill(15, 62, 31);
    rectMode(CENTER);
    rect(width / 2, height / 2 + 50, 150, 50);
    fill(255);
    text('Restart', width / 2, height / 2 + 50);
  }
}

function renderPoses() {
  for (let i = 0; i < detections.length; i++) {
      let pose = detections[i].pose;
      let nose = pose.keypoints.find(kp => kp.part === 'nose');
      if (nose) {
          image(flowerImage, width - nose.position.x - 40, nose.position.y - 40, 80, 80);
      }
  }
}

function detectInteractions() {
  if (timeLeft > 0) {
    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < detections.length; j++) {
        let pose = detections[j].pose;
        let nose = pose.keypoints.find(kp => kp.part === 'nose');
        if (nose) {
          let distance = dist(items[i].x, items[i].y, width - nose.position.x, nose.position.y);
          if (distance < 20) {
            items[i].relocate();
            points++;
          }
        }
      }
    }
  } else {
    endGame = true;
  }
}

function decreaseTimer() {
  if (!endGame && timeLeft > 0) {
    timeLeft--;
  }
}

function mouseClicked() {
  if (endGame && mouseX > width / 2 - 75 && mouseX < width / 2 + 75 && mouseY > height / 2 + 25 && mouseY < height / 2 + 75) {
    timeLeft = 10;
    points = 0;
    endGame = false;
  }
}

class GameItem {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.image = beeImage;
  }

  render() {
    image(this.image, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }

  relocate() {
    this.x = random(50, width - 50);
    this.y = random(50, height - 50);
  }
}