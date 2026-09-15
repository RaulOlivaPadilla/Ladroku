function Timer({ seconds }) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0')
  return <time dateTime={`PT${seconds}S`} aria-label="Tiempo de partida">{minutes}:{remainingSeconds}</time>
}

export default Timer
