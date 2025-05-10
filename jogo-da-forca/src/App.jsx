// CSS 
import './App.css'

// React
import { useCallback, useEffect, useState } from 'react'

// data
import { wordsList } from './data/words'

// components
import Game from './components/Game'
import StartScreen from './components/StartScreen'
import GameOver from './components/GameOver'

// game stages
const stages = [
  {
    id: 1,
    name: "start"
  },
  {
    id: 2,
    name: "game"
  },
  {
    id: 3,
    name: "end"
  },
]
const guessesQty = 5

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setwrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)

  // pick word and category
  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * categories.length)]

    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return { word, category }
  },[words]);

  // start the game
  const startGame = useCallback(() => {
    //clear all letters
    clearLetterStates();
    // pick word and pick category
    const { word, category } = pickWordAndCategory()

    // create an array of lowercase letters
    const wordLetters = word.toLowerCase().split("")

   

    // fill states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)

  },[pickWordAndCategory])

  // process the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()
    //check if letter has already been utilized
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }
    //push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setwrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ])
      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setwrongLetters([])
  }
  //check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      //reset all states
      clearLetterStates();
      setGameStage(stages[2].name)
    }
  }, [guesses])
  //check win condition
  useEffect(() => {

    const uniqueletters = [...new Set(letters)]

    //win condition
    if (guessedLetters.length === uniqueletters.length) {
      //add score
      setScore((actualScore) => actualScore += 100)
      //restart game with new word
      startGame();
    }
  }, [guessedLetters,letters,startGame],)

  // restart game
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)

    setGameStage(stages[0].name)
  }

  return (
    <>
      <div className='app'>
        {gameStage === 'start' && <StartScreen startGame={startGame} />}
        {gameStage === 'game' && (
          <Game
            verifyLetter={verifyLetter}
            pickedWord={pickedWord}
            pickedCategory={pickedCategory}
            letters={letters}
            guessedLetters={guessedLetters}
            wrongLetters={wrongLetters}
            guesses={guesses}
            score={score}
          />
        )}
        {gameStage === 'end' && (
          <GameOver
            retry={retry}
            score={score}
          />
        )}
      </div>
    </>
  )
}

export default App
