import Timer from './Timer.jsx'

function Toolbar({ seconds, mistakesCount, cases, currentCaseId, onCaseChange, onReset, onAccuse, canAccuse }) {
  const difficultyOrder = ['Fácil', 'Medio', 'Difícil', 'Imposible']
  const casesByDifficulty = difficultyOrder.map((difficulty) => ({
    difficulty,
    cases: cases.filter((gameCase) => (gameCase.difficulty ?? 'Fácil') === difficulty),
  })).filter(({ cases: difficultyCases }) => difficultyCases.length > 0)

  return (
    <div className="toolbar">
      <label>
        Caso
        <select value={currentCaseId} onChange={(event) => onCaseChange(event.target.value)}>
          {casesByDifficulty.map(({ difficulty, cases: difficultyCases }) => (
            <optgroup key={difficulty} label={difficulty}>
              {difficultyCases.map((gameCase) => (
                <option key={gameCase.id} value={gameCase.id}>{gameCase.title}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <span>Tiempo <Timer seconds={seconds} /></span>
      <span>Errores <strong>{mistakesCount}</strong></span>
      <button type="button" onClick={onReset}>Reiniciar</button>
      <button className="primary-button" type="button" disabled={!canAccuse} onClick={onAccuse}>Acusar</button>
    </div>
  )
}

export default Toolbar
