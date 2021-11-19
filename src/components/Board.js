import React from "react";
import Square from "./Square";
import { BOARD_SIZE, LENGTH_TO_WIN } from "../config";

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(BOARD_SIZE * BOARD_SIZE).fill(null),
      xIsNext: true,
      lastPost: -1,
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    const isWinned = this.calculateWinner(squares, this.state.lastPost);
    if (squares[i] || isWinned) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      squares,
      xIsNext: !this.state.xIsNext,
      lastPost: i,
    });
  }

  renderSquare(i) {
    return (
      <Square
        key={"square" + i}
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  renderBoard(size) {
    let board = Array(size)
      .fill(0)
      .map(() => Array(size).fill(0));

    return board.map((item1, index1) => (
      <div className="board-row" key={"row" + index1}>
        {item1.map((item2, index2) =>
          // <Square
          //   key={"col" + index2}
          //   value={this.state.squares[index1 * size + index2]}
          //   onClick={() => this.handleClick(index1 * size + index2)}
          // />
          this.renderSquare(index1 * size + index2)
        )}
      </div>
    ));
  }

  calculateWinner(squares, lastPos) {
    if (lastPos < 0) return null;

    const lastPosY = parseInt(lastPos / BOARD_SIZE);
    const lastPosX = lastPos - BOARD_SIZE * lastPosY;
    const currentValue = squares[lastPos];

    let squares2d = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE));

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        squares2d[i][j] = squares[BOARD_SIZE * i + j];
      }
    }

    const offsetsByDirections = [
      [-1, -1], // chéo 1
      [0, -1], // trên
      [1, -1], // chéo 2
      [1, 0], // phải
      [1, 1], // chéo 3
      [0, 1], // dưới
      [-1, 1], // chéo 4
      [-1, 0], // trái
    ];

    // 8 direction
    const maxLineLengthByDirections = offsetsByDirections.map((offset) => {
      let length = 0;
      let considerPosX = lastPosX;
      let considerPosY = lastPosY;

      while (
        considerPosX + offset[0] >= 0 &&
        considerPosX + offset[0] <= BOARD_SIZE - 1 &&
        considerPosY + offset[1] >= 0 &&
        considerPosY + offset[1] <= BOARD_SIZE - 1
      ) {
        considerPosX += offset[0];
        considerPosY += offset[1];

        if (squares2d[considerPosY][considerPosX] === currentValue) {
          length++;
        } else {
          break;
        }
      }

      return length;
    });

    // 4 direction
    let maxLineLengths = Array(4).fill(0);
    for (let i = 0; i < 4; i++) {
      maxLineLengths[i] =
        maxLineLengthByDirections[i] + maxLineLengthByDirections[i + 4] + 1;
    }

    const maxLineLength = Math.max(...maxLineLengths);
    if (maxLineLength >= LENGTH_TO_WIN) {
      return currentValue;
    }

    return null;
  }

  render() {
    const winner = this.calculateWinner(
      this.state.squares,
      this.state.lastPost
    );
    const winStatus = "Winner: " + winner;
    const nextPlayerStatus = "Next player: " + (this.state.xIsNext ? "X" : "O");
    const status = winner ? winStatus : nextPlayerStatus;

    return (
      <div>
        <div className="status">{status}</div>
        {this.renderBoard(BOARD_SIZE)}
      </div>
    );
  }
}
