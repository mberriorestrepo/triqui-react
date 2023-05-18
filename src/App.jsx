import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

import { TURNS } from './constants'
import { WinnerModal } from './components/WinnerModal'
import { checkEndGame, checkWinnerFrom } from './logic/board'
import { Table } from './components/Table'
import { resetGameStorage } from './logic/storage'
import { useLocalStorage } from './logic/storage/useLocalStorage'

function App () {
  // DE ESTA FORMA NO FUNCIONA EL LOCAL STORAGE EN REACT
  // CREAMOS UN HOOK "useLocalStorage" PARA USAR EL LOCAL STORAGE

  // const [board, setBoard] = useState(() => {
  //   const boardFromStorage = window.localStorage.getItem('board')
  //   return boardFromStorage
  //   ? JSON.parse(boardFromStorage)
  //   : Array(9).fill(null)
  // })

  // const [turn, setTurn] = useState(() => {
  //   const turnFromStorage = window.localStorage.getItem('turn')
  //   return turnFromStorage ?? TURNS.X
  // })

  const [board, setBoard] = useLocalStorage('board', Array(9).fill(null))
  // el turno inicial lo tien "X"
  const [turn, setTurn] = useLocalStorage('turn', TURNS.X)

  // null si no hay ganador, false es que hay un empate
  const [winner, setWinner] = useState(null)

  // esto solo se ejecutará una vez en el ciclo de vida del componente
  // o cada que cambien alguna dependencia en "[]"
  // ejem: [winner] -> cada que cambia el winner se ejecutara este
  // siempre hay que pasarle unas dependecias para
  // que no haga un loop, o ciclo infinito o en
  // su defecto un array vacio []
  useEffect(() => {
    if (checkWinnerFrom(board)) {
      confetti()
      setWinner(checkWinnerFrom(board))
    } else if (checkEndGame(board)) {
      setWinner(false)
    }
  }, [])

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
    // saveGameToStorage({
    //   board: newBoard,
    //   turn: newTurn
    // })

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
      />

      <WinnerModal
        resetGame={resetGame}
        winner={winner}
      />
    </main>
  )
}

export default App
