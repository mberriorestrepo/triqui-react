import { useState } from 'react'
import confetti from 'canvas-confetti'

import './App.css'
import { Square } from './components/Square'
import { TURNS } from './constants'
import { WinnerModal } from './components/WinnerModal'
import { checkEndGame, checkWinnerFrom } from './logic/board'
import { Table } from './components/Table'
import { resetGameStorage, saveGameToStorage } from './logic/storage'

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage
    ? JSON.parse(boardFromStorage)
    : Array(9).fill(null)
  })

  // el turno inicial lo tien "X"
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  })

  // null si no hay ganador, false es que hay un empate
  const [winner, setWinner] = useState(null)

  const updateBoard = (index) => {
    // no actualizamos esta posición
    // si ya tiene algo
    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    // save game in storage
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })

    const newWinner = checkWinnerFrom(newBoard)

    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameStorage()
  }

  return (
    <main className='board'>
      <h1>Triqui</h1>
      <button onClick={resetGame}>
        Empezar de nuevo
      </button>

      <Table
        board={board}
        updateBoard={updateBoard}
        turn={turn}
      ></Table>

      <WinnerModal resetGame={resetGame}  winner={winner}></WinnerModal>
    </main>
  )
}

export default App
