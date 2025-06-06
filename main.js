import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import Balls from './balls.js';

const width = window.innerWidth;
const height = window.innerHeight;
const player1Color = 'yellow';
const player2Color = 'red';
const timeLimit = 20;
let player = 'test';

//signup functionality
let playerName = '';
const wrapper = document.getElementById('wrapper');
const signup = document.getElementById('signup-modal');
const name = document.getElementById('name');
const submit = document.getElementById('submitbtn');
name.addEventListener('keyup', (e) => {
  playerName = e.target.value;
});
submit.addEventListener('click', (e) => {
  //do something
  if (playerName !== '') {
    signup.remove();
    wrapper.style.display = 'none';
    setPlayer();
  }
});

const canvas = d3
  .select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('background-color', 'grey');

const player1Balls = new Balls(canvas, width, height, player1Color, '1');
const player2Balls = new Balls(canvas, width, height, player2Color, '2');

const player1Strip = canvas
  .append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', width / 2)
  .attr('height', 45)
  .attr('fill', player1Color);

const player2Strip = canvas
  .append('rect')
  .attr('x', width / 2)
  .attr('y', 0)
  .attr('width', width / 2)
  .attr('height', 45)
  .attr('fill', player2Color);

const line = canvas
  .append('line')
  .attr('x1', width / 2)
  .attr('y1', 0)
  .attr('x2', width / 2)
  .attr('y2', height)
  .attr('stroke', 'black')
  .attr('stroke-width', 3);

function setPlayer() {
  const player1 = canvas
    .append('text')
    .attr('x', 10)
    .attr('y', 30)
    .attr('font-size', 20)
    .text(`player: ${playerName}`)
    .attr('fill', 'black');
}

// const player2 = canvas
//   .append('text')
//   .attr('x', width - 10)
//   .attr('y', 30)
//   .attr('font-size', 20)
//   .style('text-anchor', 'end')
//   .text(`player2: ${player2Name}`)
//   .attr('fill', 'black');

const timerDisplay = canvas
  .append('text')
  .attr('id', 'timerdisplay')
  .attr('x', width / 2)
  .attr('y', 70)
  .attr('font-size', 70)
  .attr('stroke', 'white')
  .attr('stroke-width', 2)
  .style('text-anchor', 'middle')
  .text(timeLimit);

function startGame(player1Balls, player2Balls) {
  player1Balls.generateBalls();
  player2Balls.generateBalls();
}

//start button
canvas
  .append('text')
  .attr('id', 'startbtn')
  .attr('x', width / 2)
  .attr('y', height / 2)
  .attr('font-size', 150)
  .style('text-anchor', 'middle')
  .style('cursor', 'pointer')
  .attr('stroke', 'white')
  .attr('stroke-width', 3)
  .attr('fill', 'darkgreen')
  .text('start')
  .on('mouseover', (e) => {
    canvas.select('#startbtn').attr('fill', 'green');
  })
  .on('mouseout', () => {
    canvas.select('#startbtn').attr('fill', 'darkgreen');
  })
  .on('click', () => {
    canvas.select('#startbtn').remove();
    startGame(player1Balls, player2Balls);
    timer();
  });

//timer
function timer() {
  let limit = timeLimit;
  let counter = limit;
  let tickDown = setInterval(() => {
    if (counter > 0) {
      counter--;
      canvas.select('#timerdisplay').text(counter);
    } else {
      clearInterval(tickDown);
      player1Balls.active = false;
      player2Balls.active = false;
      checkScores();
    }
  }, 1000);
}

//gameRunning

function checkScores() {
  const yellowRemainder = player1Balls.checkBalls();
  const redRemainder = player2Balls.checkBalls();
  let leftOverBalls = yellowRemainder + redRemainder;
  displayScores(leftOverBalls);
}

function displayScores(playerScore) {
  let boxWidth = width / 3;
  let boxHeight = height / 4;

  wrapper.style.display = 'flex';

  let endModal = document.createElement('div');
  endModal.setAttribute('class', 'endgamemodal');
  endModal.innerText = `${playerName}! ${
    playerScore === 0
      ? `you got them all!`
      : `you missed: ${playerScore} balls!`
  }`;
  wrapper.appendChild(endModal);

  // let group = canvas
  //   .append('g')
  //   .attr(
  //     'transform',
  //     `translate(${width / 2 - boxWidth / 2} ${height / 2 - boxHeight / 2})`
  //   );

  // group
  //   .append('rect')
  //   .attr('x', 0)
  //   .attr('y', 0)
  //   .attr('width', boxWidth)
  //   .attr('height', boxHeight)
  //   .attr('fill', 'white');

  // group
  //   .append('text')
  //   .attr('x', 10)
  //   .attr('y', 20)
  //   .attr('fill', 'black')
  //   .text(
  //     `${playerName}, ${
  //       playerScore === 0 ? `You got them all!` : `you missed: ${playerScore}`
  //     }`
  //   );
}
