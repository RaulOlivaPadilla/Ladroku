import './App.css'

function App() {
  return (
    <main className="app-shell">
      <section className="intro-card" aria-labelledby="game-title">
        <p className="eyebrow">Misterio · lógica · deducción</p>
        <h1 id="game-title">Ladroku</h1>
        <p className="intro-copy">
          Resuelve el robo siguiendo las pistas y descubre quién se llevó el
          objeto, qué robó y dónde ocurrió todo.
        </p>
        <button className="primary-button" type="button" disabled>
          Próximamente: comenzar caso
        </button>
      </section>
    </main>
  )
}

export default App
