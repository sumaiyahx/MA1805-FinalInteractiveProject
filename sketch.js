
const STATE_INITIAL = 0;
const STATE_REVEALING = 1;
const STATE_COMPLETE = 2;
const STATE_PAGE2 = 3;
const STATE_PAGE3 = 4;


let font;
let clickSound;
let introScale = 0;
let images = [];
let page2Images = [];
let revealImages = [];
let currentImage = 0;
let state = STATE_INITIAL;
let revealedImages = [false, false, false]; //the images that will appear after clicking on the jhumkas on page 2


let positions = [
  [-550, -200], [400, -195], 
  [-550, 100], [390, 100], 
  [85, -200], [80, 80],
  [-220, -200], [-220, 100]
];

//falling animation variables for page 2
let yPositions = [];
let landed = [false, false, false]; //to track if each image has landed
let delays = [0, 30, 60]; //delay in frames before each image starts falling

//page 3 images
let bottomImg;
let topImg;
let pg; //graphic layer for the reveal effect


function preload() {
  font = loadFont('images/Magic Seventies.ttf');
  clickSound = loadSound('popsound.mp3');


  // page 1 images
  images[0] = loadImage('images/image1-pkshoes.jpg');
  images[1] = loadImage('images/image2-pkjewellery.jpg');
  images[2] = loadImage('images/image3-pktable.jpg');
  images[3] = loadImage('images/image4-pkhandhcain.jpg');
  images[4] = loadImage('images/image5-pkchai.jpg');
  images[5] = loadImage('images/image6-pk.jpg');
  images[6] = loadImage('images/image7-pkdress.jpg');
  images[7] = loadImage('images/image8-pkflag.jpg');
  //page 2 images
  page2Images[0] = loadImage('images/jhumka2.jpg');
  page2Images[1] = loadImage('images/jhumka1.jpg');
  page2Images[2] = loadImage('images/jhumka3.jpg');
  revealImages[0] = loadImage('images/jhumkatweet1.png');
  revealImages[1] = loadImage('images/jhumkaRL.png');
  revealImages[2] = loadImage('images/jhumkatweet2.png');
  // page 3 images
  bottomImg = loadImage('images/toppkflagwithcolour.png');
  topImg = loadImage('images/bottompkflagnocolour.png');
}


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL); //fills the entire screen
  textFont(font);   
  fill('white');
  textSize(55);
textAlign(CENTER, CENTER);
stroke(0); 
strokeWeight(0); 


//initialise falling positions above the screen
for (let i = 0; i < 3; i++) {
  yPositions[i] = -height * 2; //start far above the screen
}

//page 3 graphic layer setup
pg = createGraphics(windowWidth, windowHeight);
pg.image(topImg,0,0, windowWidth, windowHeight);

//trigger a new image appearing every 1 second
setInterval(() => {
  if (state === STATE_REVEALING && currentImage < images.length) {
    currentImage++;
    clickSound.play();
    if (currentImage === images.length) state = STATE_COMPLETE;
  }
}, 600);
}

function draw() {
  if (state === STATE_INITIAL) {
    drawIntro();
  } else if (state === STATE_PAGE2) {
    drawPage2();
  } else if (state === STATE_PAGE3) {
    drawPage3();
  } else {
    drawPage1();
  }
}

function drawIntro() {
  background('black');

  if (introScale < 1) {
    introScale += 0.01; //zoom in effect
  }

  push();
  scale(introScale); //apply zoom effect
  fill('white');
  stroke(0);
  strokeWeight(4);
  textSize(70);
  text('South Asia Culture', 0, 0);
  pop();


//show click to begin after the title has fully appeared
if (introScale >= 1) {
  fill('white');
  noStroke(0);
  textSize(20);
  text ('Click to begin', 0, 100);
 }
}

 function drawPage1() {
  background('black');
  for (let i = 0; i < currentImage; i++) {
    let x = positions[i][0];
    let y = positions[i][1];
    image(images[i], x-80, y-80, 310,310);
  }

  //vertical text
  let sideText = 'A GLIMPSE OF SOUTH ASIA';
  let startY = -270;
  let letterSpacing = 24;

  fill('white');
  noStroke();
  textSize(30);
  for (let i = 0; i < sideText.length; i++) {
    text(sideText[i], -width/2 + 330, startY + i * letterSpacing);
  }

  
  if (state === STATE_COMPLETE) {
    fill('white');
    noStroke();
    rect(-70, 220, 140, 45, 10);
    fill('black');
    textSize(18);
    text('Next Page', 0, 247);
  }
}

function drawPage2() {
  background('white');

  let imgWidth = width / 3; //the size of the images
  let targetY = -220; 


  //draw original images with the falling animation
  for (let i = 0; i < 3; i++) {
    if (!landed[i]) {
    if (frameCount > delays [i]) {
      yPositions[i] = lerp(yPositions[i], targetY, 0.01); //fall slowly
      if (abs(yPositions[i] - targetY) < 1) {
        yPositions[i] = targetY;
        landed[i] = true; //mark as landed
      }
    }
    } else {
    yPositions[i] = targetY; //ensure it stays at the target position
  }

    let x = -width/2 + imgWidth * i;
   

      //draw revealed images on top if clicked
        if (revealedImages[i]) {
          image(revealImages[i], x, yPositions[i], imgWidth, imgWidth * 1.5);
        } else {
          image (page2Images[i], x, yPositions[i], imgWidth, imgWidth * 1.5);
          //only show 'tap to reveal' once the images has landed
          if (landed[i]) {
            fill('black');
            noStroke();
            textSize(30);
            text('Tap to Reveal', x + imgWidth/2, 20);
          }
      }
    }
  

  fill('black');
  stroke(0);
  strokeWeight(4);
  textSize(43)

  if (landed[0] && landed[1] && landed[2]) {
    textSize(22);
    //show text after all images have landed
    text('Brands such as Ralph Lauren have been accused of cultural appropriation for selling jhumka-inspired earrings without acknowledging their cultural significance.', 0, -256);
    text('Giving credit is important as it protects the cultural meaning!', 0, -230);

    fill('black');
    noStroke();
    rect(-70, 260, 140, 45, 10);
    fill('white');
    textSize(18);
    text('Next Page', 0, 287);

  } else {
    //show this text while the images are falling
    text('Jhumka:traditional bell-shaped earrings that originated from the Indian subcontinent.', 0, -250);
  }
}

function drawPage3() {
  background('black');
  image(pg, -width/2, -height/2, width, height);
  
  //instructions
  fill('black');
  noStroke();
  textSize(20);
  text('You have reached the end! Drag your mouse to reveal the colour!', 20, height / 2 - 50);
}

function mouseDragged() {
  if (state === STATE_PAGE3) {
    let scaleX = bottomImg.width / windowWidth;
    let scaleY = bottomImg.height / windowHeight;

    let srcX = mouseX * scaleX;
    let srcY = mouseY * scaleY;
    let brushSize = 50;

    pg.copy(bottomImg, srcX, srcY, brushSize * scaleX, brushSize * scaleY, mouseX, mouseY, brushSize, brushSize);
  }
}

function mousePressed() {
  if (state === STATE_INITIAL) {
    state = STATE_REVEALING;

  } else if (state === STATE_COMPLETE) {
    currentImage = 0;
    //reset falling animation
    landed = [false, false, false];
    revealedImages = [false, false, false]; //reset revealed images
    for (let i = 0; i < 3; i++) {
      yPositions[i] = -height * 2; //reset to start above the screen
    }
    state = STATE_PAGE2;

  } else if (state === STATE_PAGE2) {
      let imgWidth = width / 3;
      let imgH = imgWidth * 1.5;

      for (let i = 0; i < 3; i++) {
        let x = -width/2 + imgWidth * i;
        let mx = mouseX - width/2;
        let my = mouseY - height/2;

        //click is inside the image bounds
        if (mx > x && mx < x + imgWidth &&
          my > yPositions[i] && my < yPositions[i] + imgH) {
            revealedImages[i] = !revealedImages[i]; //toggle reveal on click
        }
      }
      //next page button on page 2
      if (landed[0] && landed[1] && landed[2]) {
        let mx = mouseX - width/2;
        let my = mouseY - height/2;
        if (mx > -70 && mx <70 && my > 260 && my < 305) {
          //reset variables for page 3
          pg.clear();
          pg.image(topImg,0,0, windowWidth, windowHeight);
          state = STATE_PAGE3;
        }
      }
    }
}