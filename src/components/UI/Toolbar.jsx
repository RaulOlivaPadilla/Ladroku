import Timer from './Timer.jsx'

function Toolbar({ seconds, mistakesCount, cases, currentCaseId, onCaseChange, onReset, onAccuse, canAccuse }) {
  return (
    <div className="toolbar">
      <label>
        Caso
        <select value={currentCaseId} onChange={(event) => onCaseChange(event.target.value)}>
          {cases.map((gameCase) => <option key={gameCase.id} value={gameCase.id}>{gameCase.title}</option>)}
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
