import { useState } from 'react'

function AccusationModal({ open, characters, objects, rooms, result, onClose, onSubmit }) {
  const [suspectId, setSuspectId] = useState('')
  const [objectId, setObjectId] = useState('')
  const [roomId, setRoomId] = useState('')

  if (!open) return null

  const submit = (event) => {
    event.preventDefault()
    onSubmit({ suspectId, objectId, roomId })
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="accusation-title">
        <h2 id="accusation-title">Presentar acusación</h2>
        <form onSubmit={submit}>
          <label>
            Ladrón
            <select value={suspectId} onChange={(event) => setSuspectId(event.target.value)} required>
              <option value="">Selecciona un sospechoso</option>
              {characters.filter(({ id }) => id !== 'victim').map((character) => (
                <option key={character.id} value={character.id}>{character.name}</option>
              ))}
            </select>
          </label>
          <label>
            Objeto robado
            <select value={objectId} onChange={(event) => setObjectId(event.target.value)} required>
              <option value="">Selecciona un objeto</option>
              {objects.map((object) => <option key={object.id} value={object.id}>{object.name}</option>)}
            </select>
          </label>
          <label>
            Habitación
            <select value={roomId} onChange={(event) => setRoomId(event.target.value)} required>
              <option value="">Selecciona una habitación</option>
              {rooms.map((room) => <option key={room.id} value={room.id}>{room.name} ({room.row + 1}, {room.col + 1})</option>)}
            </select>
          </label>
          <div className="modal__actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button className="primary-button" type="submit">Acusar</button>
          </div>
        </form>
        {result && <p role="status" className={result.correct ? 'result--correct' : 'result--wrong'}>{result.message}</p>}
      </section>
    </div>
  )
}

export default AccusationModal
