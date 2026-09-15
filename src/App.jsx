import { useEffect, useMemo, useState } from 'react'
import Grid from './components/Grid/Grid.jsx'
import AccusationModal from './components/Accusation/AccusationModal.jsx'
import ClueList from './components/Clues/ClueList.jsx'
import SuspectList from './components/SuspectPanel/SuspectList.jsx'
import Toolbar from './components/UI/Toolbar.jsx'
import case001 from './game/data/cases/case-001.json'
import case002 from './game/data/cases/case-002.json'
import { useGameStore } from './game/store/useGameStore.js'
import './App.css'

const cases = [case001, case002]

function App() {
  const [isAccusationOpen, setIsAccusationOpen] = useState(false)
  const [checkedClueIds, setCheckedClueIds] = useState([])
  const [invalidRoomId, setInvalidRoomId] = useState(null)
  const {
    currentCase,
    playerPositions,
    selectedCharacterId,
    status,
    mistakesCount,
    timerSeconds,
    accusation,
    loadCase,
    selectCharacter,
    placeCharacter,
    resetCase,
    submitAccusation,
    incrementTimer,
    isBoardComplete,
  } = useGameStore()

  useEffect(() => {
    loadCase(case001)
  }, [loadCase])

  useEffect(() => {
    if (status !== 'playing') return undefined
    const timer = window.setInterval(incrementTimer, 1000)
    return () => window.clearInterval(timer)
  }, [incrementTimer, status])

  const accusationResult = useMemo(() => {
    if (!accusation.suspectId) return null
    if (status === 'won') {
      return { correct: true, message: `¡Caso resuelto! ${currentCase.solution.thiefId} robó el objeto.` }
    }
    return { correct: false, message: 'La acusación no es correcta. Revisa las pistas e inténtalo de nuevo.' }
  }, [accusation, currentCase, status])

  if (!currentCase) return null

  const handleCellClick = (room) => {
    if (selectedCharacterId) {
      const placed = placeCharacter(selectedCharacterId, room.row, room.col)
      if (!placed) {
        setInvalidRoomId(room.id)
        window.setTimeout(() => setInvalidRoomId(null), 700)
      }
    }
  }

  const handleCaseChange = (caseId) => {
    const nextCase = cases.find((gameCase) => gameCase.id === caseId)
    if (nextCase) {
      loadCase(nextCase)
      setCheckedClueIds([])
      setIsAccusationOpen(false)
    }
  }

  const handleReset = () => {
    resetCase()
    setCheckedClueIds([])
    setIsAccusationOpen(false)
  }

  const toggleClue = (clueId) => {
    setCheckedClueIds((checked) => (
      checked.includes(clueId)
        ? checked.filter((id) => id !== clueId)
        : [...checked, clueId]
    ))
  }

  return (
    <main className="game-shell">
      <header className="game-header">
        <div>
          <p className="eyebrow">Misterio · lógica · deducción</p>
          <h1>Ladroku</h1>
          <p className="case-title">{currentCase.title}</p>
        </div>
        {status === 'won' && <div className="win-banner" role="status">Caso resuelto</div>}
      </header>

      <Toolbar
        seconds={timerSeconds}
        mistakesCount={mistakesCount}
        cases={cases}
        currentCaseId={currentCase.id}
        onCaseChange={handleCaseChange}
        onReset={handleReset}
        onAccuse={() => setIsAccusationOpen(true)}
        canAccuse={isBoardComplete() && status === 'playing'}
      />

      <div className="game-layout">
        <section className="board-panel panel" aria-labelledby="board-title">
          <div className="section-heading">
            <div>
              <h2 id="board-title">Escena del robo</h2>
              <p>
                {selectedCharacterId
                  ? 'Ahora selecciona una habitación libre.'
                  : 'Selecciona un personaje y después una habitación.'}
              </p>
            </div>
            <span>{Object.values(playerPositions).filter(Boolean).length}/{currentCase.characters.length}</span>
          </div>
          <Grid
            gridSize={currentCase.gridSize}
            rooms={currentCase.rooms}
            characters={currentCase.characters}
            positions={playerPositions}
            selectedCharacterId={selectedCharacterId}
            invalidRoomId={invalidRoomId}
            onCellClick={handleCellClick}
          />
        </section>

        <aside className="side-panels">
          <SuspectList
            characters={currentCase.characters}
            positions={playerPositions}
            selectedCharacterId={selectedCharacterId}
            onSelect={selectCharacter}
          />
          <ClueList
            clues={currentCase.clues}
            checkedClueIds={checkedClueIds}
            onToggle={toggleClue}
          />
        </aside>
      </div>

      {status === 'won' && (
        <section className="solution-panel panel" aria-labelledby="solution-title">
          <h2 id="solution-title">La solución</h2>
          <p>
            El ladrón fue <strong>{currentCase.characters.find(({ id }) => id === currentCase.solution.thiefId)?.name}</strong>.
            Robó el <strong>{currentCase.stolenItem.name}</strong> en la habitación indicada por las pistas.
          </p>
        </section>
      )}

      <AccusationModal
        open={isAccusationOpen}
        characters={currentCase.characters}
        objects={[currentCase.stolenItem]}
        rooms={currentCase.rooms}
        result={accusationResult}
        onClose={() => setIsAccusationOpen(false)}
        onSubmit={(nextAccusation) => submitAccusation(nextAccusation)}
      />
    </main>
  )
}

export default App
