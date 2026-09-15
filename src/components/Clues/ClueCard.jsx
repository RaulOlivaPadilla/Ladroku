function ClueCard({ clue, checked, onToggle }) {
  return (
    <label className={`clue-card${checked ? ' clue-card--checked' : ''}`}>
      <input type="checkbox" checked={checked} onChange={() => onToggle(clue.id)} />
      <span>{clue.text}</span>
    </label>
  )
}

export default ClueCard
