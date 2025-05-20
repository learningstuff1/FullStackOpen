import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votesArray, setVotesArray] = useState(Array(anecdotes.length).fill(0))
  const [maxVoteIndex, setMaxVoteIndex] = useState(0)
  const selectRandomIndex = () => setSelected(Math.floor(Math.random() * anecdotes.length))
  
  const voteForIndex = () => {
    const newVotes = [...votesArray]
    newVotes[selected] += 1
    setVotesArray(newVotes)
    if (newVotes[selected] > newVotes[maxVoteIndex]) {
      setMaxVoteIndex(selected)
    }
  }

  return (
    <div>
      <div>
        <h1>Anecdote of the day</h1>
        {anecdotes[selected]}
        <p>has {votesArray[selected]} votes</p>
        <div>
          <button onClick={voteForIndex}>vote</button>
          <button onClick={selectRandomIndex}>next anecdote</button>
        </div>
      </div>
      <div>
        <h1>Anecdote with most votes</h1>
        {anecdotes[maxVoteIndex]}
        <p>has {votesArray[maxVoteIndex]} votes</p>
      </div>

    </div>
  )
}

export default App