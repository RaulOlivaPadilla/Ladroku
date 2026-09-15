import ClueCard from './ClueCard.jsx'

function ClueList({ clues, checkedClueIds = [], onToggle }) {
  return (
    <section className="panel" aria-labelledby="clues-title">
      <h2 id="clues-title">Pistas</h2>
      <div className="clue-list">
        {clues.map((clue) => (
          <ClueCard
            key={clue.id}
            clue={clue}
            checked={checkedClueIds.includes(clue.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  )
}

export default ClueList
