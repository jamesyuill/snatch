import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import Balls from './balls.js';
import { io } from 'https://cdn.socket.io/4.8.1/socket.io.esm.min.js';

const socket = io.connect('http://localhost:8080');
socket.on('connect', () => {
  console.log('connected');
});

const width = window.innerWidth;
const height = window.innerHeight;
const player1Color = 'yellow';
const player2Color = 'red';
const timeLimit = 20;
let players = {
  player1: { id: '', name: '' },
  player2: { id: '', name: '' },
};

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
    wrapper.remove();
    socket.emit('name-entered', playerName);
    socket.on('setPlayers', (data) => {
      players = data;
      setPlayers(players);
    });
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

function setPlayers(playerObj) {
  canvas
    .append('text')
    .attr('x', 10)
    .attr('y', 30)
    .attr('font-size', 20)
    .text(`player1: ${playerObj.player1.name}`)
    .attr('fill', 'black');

  canvas
    .append('text')
    .attr('x', width - 10)
    .attr('y', 30)
    .attr('font-size', 20)
    .style('text-anchor', 'end')
    .text(`player2: ${playerObj.player2.name}`)
    .attr('fill', 'black');
}

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
      checkScores();
    }
  }, 1000);
}

//gameRunning

function checkScores() {
  const player1Score = player1Balls.checkBalls();
  const player2Score = player2Balls.checkBalls();
  console.log(player1Score, player2Score);
  displayScores(player1Score, player2Score);
}

function displayScores(player1Score, player2Score) {
  let boxWidth = width / 3;
  let boxHeight = height / 4;

  let group = canvas
    .append('g')
    .attr(
      'transform',
      `translate(${width / 2 - boxWidth / 2} ${height / 2 - boxHeight / 2})`
    );

  group
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', boxWidth)
    .attr('height', boxHeight)
    .attr('fill', 'white');

  group
    .append('text')
    .attr('x', 10)
    .attr('y', 20)
    .attr('fill', 'black')
    .text(`player 1 scored: ${player1Score}, player 2 scored: ${player2Score}`);
}
