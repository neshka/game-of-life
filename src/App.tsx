import React, { useState, useEffect } from "react";
import "./App.css";

type Grid = number[][];

const size = 80;
const cellSize = 10;

const createEmptyGrid = (dimension: number): Grid => {
  return Array(dimension).fill(0).map(() => Array(dimension).fill(0));
};

const emptyGrid: Grid = createEmptyGrid(size);

const App: React.FC = () => {
  const [grid, setGrid] = useState<Grid>(emptyGrid);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const countAliveNeighbors = (grid: Grid, size: number, row: number, col: number): number => {
    let count = 0;

    const rowStart = Math.max(row - 1, 0);
    const rowEnd = Math.min(row + 1, size - 1);
    const colStart = Math.max(col - 1, 0);
    const colEnd = Math.min(col + 1, size - 1);

    for (let r = rowStart; r <= rowEnd; r++) {
      for (let c = colStart; c <= colEnd; c++) {
        if ((r !== row || c !== col) && grid[r] && grid[r][c]) {
          count += grid[r][c];
        }
      }
    }

    return count;
  };

  const nextGrid = (grid: Grid, size: number): Grid => {
    const newGrid = createEmptyGrid(size);

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const aliveNeighbors = countAliveNeighbors(grid, size, row, col);
        if (grid[row][col]) {
          newGrid[row][col] = aliveNeighbors === 2 || aliveNeighbors === 3 ? 1 : 0;
        } else {
          newGrid[row][col] = aliveNeighbors === 3 ? 1 : 0;
        }
      }
    }

    return newGrid;
  };

  const addLifeRandomly = (grid: Grid): Grid => {
    const newGrid = createEmptyGrid(size);

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const random = Math.round(Math.random());
        console.log(random);
        newGrid[row][col] = random;
      }
    }

    return newGrid;
  };

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => { setGrid(nextGrid(grid, size)); }, 100);
    return () => clearInterval(timer);
  }, [isRunning, grid]);


  return (
    <div className="App">
      <h1>Game of Life</h1>
      <p>Click on the cells to toggle them between alive and dead.</p>
      <p>Click on the Start/Stop button to start/stop the simulation.</p>
      <div
        className="grid"
        style={{
          gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
          gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
        }}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`cell_${i}-${j}`}
              className={`cell ${cell ? "alive" : ""}`}
              onClick={() => {
                const newGrid = [...grid];
                newGrid[i][j] = cell === 0 ? 1 : 0;
                setGrid(newGrid);
              }}
            ></div>
          ))
        )}
      </div>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? "Stop" : "Start"}
      </button>
      <button onClick={() => setGrid(addLifeRandomly(grid))}>
        Add life randomly
      </button>
    </div>
  );
};

export default App;
