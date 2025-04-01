import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export default class Balls {
  constructor(canvas, width, height, color, player) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.color = color;
    this.numOfBalls = 20;
    this.radius = 50;
    this.player = player;
  }

  generateBalls() {
    for (let i = 0; i < this.numOfBalls; i++) {
      this.canvas
        .append('circle')
        .attr('id', `circle-${i}${this.player}`)
        .attr(
          'cx',
          Math.random() * (this.width - this.radius - this.radius) + this.radius
        )
        .attr(
          'cy',
          Math.random() * (this.height - this.radius - this.radius) +
            this.radius
        )
        .attr('r', this.radius)
        .attr('fill', `${this.color}`)
        .attr('stroke', 'black')
        .call(
          d3
            .drag()
            .on('drag', (e) => {
              this.canvas
                .select(`#circle-${i}${this.player}`)
                .attr('opacity', '0.5')
                .attr('cx', e.x)
                .attr('cy', e.y);
            })
            .on('end', () => {
              this.canvas
                .select(`#circle-${i}${this.player}`)
                .attr('opacity', '1');
            })
        );
    }
  }

  checkBalls() {
    let playerScore = 0;

    for (let i = 0; i < this.numOfBalls; i++) {
      let ball = this.canvas.select(`#circle-${i}${this.player}`).node();
      let ballPosX = ball.cx.animVal.value;
      if (this.player === '1') {
        //check left handside
        if (ballPosX < this.width / 2) {
          playerScore++;
        }
      } else {
        //check right handside
        if (ballPosX > this.width / 2) {
          playerScore++;
        }
      }
    }
    return playerScore;
  }
}
