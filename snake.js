'use strict'

//commit completely full functioning snake 6974292

let scoreCounter = document.getElementById("scoreCounter");

let playAgain = document.getElementById("playAgain");


//CANVAS
// Get the canvas context for drawing
// const ctx = gameGrid.getContext("2d");

gameGrid.width = 400;
gameGrid.height = 400; 


let score = 0;
let gameOver = false;
let mainGameTimer;


// use the class to create objects
// new node - part of the snake body
class SnakeNode {
  constructor (snakeX, snakeY) {
    this.snakeX = snakeX;
    this.snakeY = snakeY;
    this.previous = null;
    this.next = null;
  }
}

// doubly linked list 
class SnakeDLL {
  constructor(snakeX, snakeY) {
  this.head = {
    snakeX: snakeX,
    snakeY: snakeY,
    next: null,
    previous: null
  }
    this.length = 0,
    this.tail = this.head;
    this.gameGrid = document.getElementById("gameGrid");
    this.ctx = this.gameGrid.getContext("2d");
    this.gameGridHeight = 400;
    this.gameGridWidth = 400; 
    this.gameGridArr = [];
    this.direction = 'right';
    this.squareSize = 20;
    this.gameGridEmpty = 0;
    this.gameGridBoundaries = 1;
    this.snakeBodyPart = 2;
    this.appleFruit = 3;
    this.randomAppleX;
    this.randomAppleY;
  }

  // INIT FUNCTION
drawInitialGameGrid () {
scoreCounter.innerHTML = "Your score: " +  score;
for (let i = 0; i < this.gameGridHeight; i++)
  {
    // adding a second dimension for the whole game grid
    this.gameGridArr[i] = [];

    for (let j = 0; j < this.gameGridWidth; j++)
      {
        if (i == 0 || i == this.gameGridHeight - 1 || j == 0 || j == this.gameGridWidth - 1)
        {
          this.gameGridArr[i][j] = this.gameGridBoundaries;
        }
        else
        {
          this.gameGridArr[i][j] = this.gameGridEmpty;
        }
      }
  }
} 

setUpBoardGame () {
  this.drawInitialGameGrid();
  this.addToHead(100, 280, this.squareSize, this.squareSize);
  this.addToHead(100, 300, this.squareSize, this.squareSize);
  this.addToHead(100,320, this.squareSize,this.squareSize);
  this.drawApple();
}

drawApple () {
  do
  {
    this.randomAppleX = ((Math.floor(Math.random()* this.gameGridWidth)) % 20) * 20;
    this.randomAppleY = ((Math.floor(Math.random()* this.gameGridWidth)) % 20) * 20;
  }
  while (this.gameGridArr[this.randomAppleX][this.randomAppleY] == this.snakeBodyPart || this.gameGridArr[this.randomAppleX][this.randomAppleY] == this.gameGridBoundaries);
  
  this.gameGridArr[this.randomAppleX][this.randomAppleY] = this.appleFruit;
  this.ctx.fillStyle = "red";
  this.ctx.fillRect(this.randomAppleX, this.randomAppleY, this.squareSize, this.squareSize);
}


addToHead(snakeX, snakeY) {
  let newSnakeNode = new SnakeNode(snakeX, snakeY);
  this.head.snakeX = snakeX;
  this.head.snakeY = snakeY;

  this.gameGridArr[this.head.snakeX][this.head.snakeY] = 2;

  if (this.head == null)
  {
    this.head = newSnakeNode;
    this.tail = newSnakeNode;
  }
  else 
  {
    newSnakeNode.next = this.head;
    this.head.previous = newSnakeNode;
    this.head = newSnakeNode;
  }
  this.length++;
}

// iterate through the snake body - from head to the tail
iterateThroughSnakeDLL() {
  let currentNode = this.head;

  while (currentNode)
  {
    if (this.gameGridArr[currentNode.snakeX][currentNode.snakeY] == 2)
    {
      this.ctx.fillStyle = "#24440f";
      this.ctx.strokeStyle = "#eaea8c";
      this.ctx.fillRect(this.head.snakeX, this.head.snakeY, this.squareSize, this.squareSize);
    } 
    currentNode = currentNode.next;
  }
}

removeTail() {
  this.gameGridArr[this.tail.snakeX][this.tail.snakeY] = 0;
  let removedTail = this.tail;
  this.ctx.strokeStyle = 'transparent';
  this.ctx.clearRect(this.tail.snakeX, this.tail.snakeY, this.squareSize,this.squareSize);
  this.ctx.strokeRect(this.tail.snakeX, this.tail.snakeY, this.squareSize, this.squareSize);

  // if the list is empty
  if (!this.tail)
  {
    return null;
  }
  else 
  {
    this.tail = this.tail.previous;

    if (this.tail !== null)
    {
      this.tail.next = null;
    }
    this.length--;
  }
  return removedTail;  
}

  //switch case / modify
updateGameGrid() {
  // DIRECTIONS MOVEMENTS
  // UP
  if (this.direction == 'up')
  {
    this.head.snakeX = this.head.snakeX;
    this.head.snakeY = this.head.snakeY - 20;
  }
  
  // DOWN
  else if (this.direction == 'down')
  {
    this.head.snakeX = this.head.snakeX;
    this.head.snakeY = this.head.snakeY + 20;
  }

  //RIGHT
  else if (this.direction == 'right')
  {
    this.head.snakeX = this.head.snakeX + 20
    this.head.snakeY = this.head.snakeY;
  }

  // LEFT
  else if (this.direction == 'left')
  {
    this.head.snakeX = this.head.snakeX - 20;
    this.head.snakeY = this.head.snakeY;
  }


  //if the snake eats itself
  if (this.gameGridArr[this.head.snakeX][this.head.snakeY] == this.snakeBodyPart)
  {
    this.iterateThroughSnakeDLL();
    gameOver = true;
  }

  // if the snake hits the boundary
  else if ( this.head.snakeX < 20 || this.head.snakeX >= 380 || this.head.snakeY < 20 || this.head.snakeY >= 380)
  {
    this.iterateThroughSnakeDLL();
    this.removeTail();
    gameOver = true;
  }

  // if the snake EATS an APPLE - the snake will get longer
  else if (this.head.snakeX == this.randomAppleX && this.head.snakeY == this.randomAppleY)
  {
    this.addToHead(this.head.snakeX, this.head.snakeY);
    this.ateApple();
    this.iterateThroughSnakeDLL();
  }

  // new head will be added
  else
  {
    this.addToHead(this.head.snakeX, this.head.snakeY);
    this.removeTail();
    this.iterateThroughSnakeDLL();
  }
}

  
replaceSnakeDLL (newDLL) {

  // to clear the current DLL list, starting from the head
  let currNode = this.head;

  while (currNode) {

    this.ctx.clearRect(currNode.snakeX, currNode.snakeY, this.squareSize, this.squareSize);

    let nextNode = currNode.previous;
    currNode.next = null;
    currNode.previous = null;
    currNode = nextNode;

    this.length--;
  }
  
  this.head = newDLL.head;
  this.tail = newDLL.tail;
}

controlDirection(newDirection) {
  if (newDirection == 'right' && this.direction != 'left')
  {
    this.direction = newDirection;
  }
  else if (newDirection == 'left' && this.direction != 'right')
  {
    this.direction = newDirection;
  }
  else if (newDirection == 'up' && this.direction != 'down')
  {
    this.direction = newDirection;
  }
  else if (newDirection == 'down' && this.direction != 'up')
  {
    this.direction = newDirection;
  }
}
  
move () {
  document.body.addEventListener("keydown", (event) => {
    if (event.key == 'ArrowLeft')
    {
      this.controlDirection('left');
    }
    else if (event.key == 'ArrowUp')
    {
      this.controlDirection('up');
    }
    else if (event.key == 'ArrowRight')
    {
      this.controlDirection('right');
    }
    else if (event.key == 'ArrowDown')
    {
      this.controlDirection('down');
    }
  });
}

ateApple () {
  score += 10;
  scoreCounter.innerHTML = "Your score: " + score;
  this.ctx.clearRect(this.randomAppleX, this.randomAppleY, this.squareSize, this.squareSize);
  this.drawApple(); 
}

startGame () {
  this.drawInitialGameGrid();
  this.setUpBoardGame();
  this.iterateThroughSnakeDLL();
}

gameLoop () {
    mainGameTimer = setInterval(() => {
    this.move();
    this.updateGameGrid();  
  
    //**GAME OVER**/
    if (gameOver)
    {
      scoreCounter.innerHTML = "GAME OVER";
      clearInterval(mainGameTimer);
    }
  }, 250);
}

}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
// to create a new SNAKE object
let snakeDLL = new SnakeDLL();
snakeDLL.startGame();
snakeDLL.gameLoop();

// event listener
playAgain.addEventListener("click", () =>
  {
    score = 0;
    gameOver = false;
    scoreCounter.innerHTML = "Your score: " + score;

    clearInterval(mainGameTimer);

    let newNewSnakeDLL = new SnakeDLL();

    snakeDLL.replaceSnakeDLL(newNewSnakeDLL);

    newNewSnakeDLL.startGame();
    newNewSnakeDLL.gameLoop();
  }
);

const audio1 = new Audio();

audio1.src = 'howler.js\tests\audio\sound1.mp3';

audio1.volume = 1;

audio1.play();

});























































  


