import SuspectCard from './SuspectCard.jsx'

function SuspectList({ characters, positions, selectedCharacterId, onSelect }) {
  return (
    <section className="panel" aria-labelledby="suspects-title">
      <h2 id="suspects-title">Personajes</h2>
      <div className="suspect-list">
        {characters.map((character) => (
          <SuspectCard
            key={character.id}
            character={character}
            placed={Boolean(positions?.[character.id])}
            selected={selectedCharacterId === character.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}

export default SuspectList
