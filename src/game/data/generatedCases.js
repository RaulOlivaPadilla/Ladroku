const roomTemplates = [
  ['Bodega', ['ventana', 'luz tenue', 'barriles']],
  ['Cocina', ['ventana', 'fogón', 'mesa larga']],
  ['Biblioteca', ['estanterías', 'escritorio', 'cuadros']],
  ['Salón', ['chimenea', 'alfombra', 'sofá']],
  ['Galería', ['cuadros', 'alfombra', 'plantas']],
  ['Invernadero', ['ventana', 'plantas', 'árbol']],
]

const characterSets = [
  ['Doña Beatriz', 'El administrador', 'La botánica', 'El chef', 'La cronista', 'El músico', 'La restauradora', 'El contable', 'La heredera', 'El jardinero', 'La coleccionista', 'El historiador'],
  ['Don Alonso', 'La ama de llaves', 'El relojero', 'La cocinera', 'El médico', 'La escultora', 'El notario', 'La fotógrafa', 'El capitán', 'La institutriz', 'El archivista', 'La cantante'],
  ['Doña Clara', 'El conserje', 'La florista', 'El pastelero', 'La violinista', 'El tapicero', 'La bibliotecaria', 'El mayordomo', 'La pintora', 'El joyero', 'La encuadernadora', 'El profesor'],
]

const difficulties = [
  { name: 'Fácil', sizes: [4, 4, 5], prefix: 'easy' },
  { name: 'Medio', sizes: [5, 6, 6], prefix: 'medium' },
  { name: 'Difícil', sizes: [7, 8, 9], prefix: 'hard' },
  { name: 'Imposible', sizes: [10, 11, 12], prefix: 'impossible' },
]

const seedPatterns = [
  [[0, 0], [0, 1], [0.48, 0.42], [1, 0], [1, 1]],
  [[0, 0.3], [0.12, 1], [0.45, 0.5], [1, 0.12], [0.82, 0.86]],
  [[0.08, 0.08], [0, 0.82], [0.48, 0.38], [0.86, 0.06], [1, 0.9]],
  [[0, 0.52], [0.2, 0], [0.46, 0.62], [0.78, 0.1], [1, 0.8]],
  [[0.18, 0.08], [0, 0.72], [0.5, 0.48], [0.82, 0], [1, 0.9]],
]

function hash(row, col, seed) {
  const value = Math.sin((row + 1) * 12.9898 + (col + 1) * 78.233 + seed * 37.719) * 43758.5453
  return value - Math.floor(value)
}

function createRegionLayout(gridSize, seed) {
  const labels = ['a', 'b', 'c', 'd', 'e']
  const pattern = seedPatterns[seed % seedPatterns.length]
  const occupied = new Set()
  const regions = labels.map((label, regionIndex) => {
    const targetRow = Math.round(pattern[regionIndex][0] * (gridSize - 1))
    const targetCol = Math.round(pattern[regionIndex][1] * (gridSize - 1))
    let row = targetRow
    let col = targetCol
    while (occupied.has(`${row}-${col}`)) {
      col += 1
      if (col >= gridSize) {
        col = 0
        row = (row + 1) % gridSize
      }
    }
    occupied.add(`${row}-${col}`)
    return { label, cells: [{ row, col }] }
  })
  const regionByPosition = new Map(
    regions.flatMap((region) => region.cells.map((cell) => [`${cell.row}-${cell.col}`, region])),
  )
  const unassigned = new Set()
  for (let row = 0; row < gridSize; row += 1) {
    for (let col = 0; col < gridSize; col += 1) {
      if (!regionByPosition.has(`${row}-${col}`)) unassigned.add(`${row}-${col}`)
    }
  }

  while (unassigned.size) {
    const candidates = regions.flatMap((region) => {
      const frontier = new Map()
      region.cells.forEach(({ row, col }) => {
        [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]]
          .filter(([nextRow, nextCol]) => (
            nextRow >= 0
            && nextRow < gridSize
            && nextCol >= 0
            && nextCol < gridSize
            && unassigned.has(`${nextRow}-${nextCol}`)
          ))
          .forEach(([nextRow, nextCol]) => {
            const key = `${nextRow}-${nextCol}`
            const adjacentCount = [[nextRow - 1, nextCol], [nextRow + 1, nextCol], [nextRow, nextCol - 1], [nextRow, nextCol + 1]]
              .filter(([adjacentRow, adjacentCol]) => regionByPosition.get(`${adjacentRow}-${adjacentCol}`) === region)
              .length
            const score = adjacentCount * 10 + hash(nextRow, nextCol, seed + region.label.charCodeAt(0))
            if (!frontier.has(key) || frontier.get(key).score < score) {
              frontier.set(key, { row: nextRow, col: nextCol, score })
            }
          })
      })
      return [...frontier.values()].map((cell) => ({ region, ...cell }))
    })
    const smallestRegionSize = Math.min(...regions.map((region) => region.cells.length))
    const selected = candidates
      .filter(({ region }) => region.cells.length <= smallestRegionSize + 1)
      .sort((first, second) => second.score - first.score)[0] ?? candidates[0]
    const key = `${selected.row}-${selected.col}`
    selected.region.cells.push({ row: selected.row, col: selected.col })
    regionByPosition.set(key, selected.region)
    unassigned.delete(key)
  }

  return regions.map((region, regionIndex) => ({
    id: `region-${seed}-${region.label}`,
    cells: region.cells,
    regionIndex,
  }))
}

function createRooms(gridSize, caseIndex) {
  return createRegionLayout(gridSize, caseIndex + 1).flatMap((region, regionIndex) => {
    const [name, traits] = roomTemplates[(regionIndex + caseIndex) % roomTemplates.length]
    const roomName = name
    return region.cells.map(({ row, col }) => ({
      id: `${region.id}-${row}-${col}`,
      roomId: region.id,
      colorIndex: regionIndex % 6,
      row,
      col,
      name: roomName,
      traits,
    }))
  })
}

function createCase(difficulty, size, index) {
  const caseIndex = `${difficulty.prefix}-${index + 1}`
  const names = characterSets[index]
  const rooms = createRooms(size, index + difficulty.sizes.indexOf(size))
  const characters = Array.from({ length: size }, (_, characterIndex) => ({
    id: `character-${caseIndex}-${characterIndex + 1}`,
    name: names[characterIndex],
    avatar: `${caseIndex}-${characterIndex + 1}.png`,
    isThief: characterIndex === (index + size) % size,
  }))
  const positions = Object.fromEntries(
    characters.map((character, characterIndex) => [
      character.id,
      { row: characterIndex, col: size - characterIndex - 1 },
    ]),
  )
  const thief = characters.find((character) => character.isThief)
  const thiefPosition = positions[thief.id]
  const stolenRoom = rooms.find(
    (room) => room.row === thiefPosition.row && room.col === thiefPosition.col,
  )
  const itemNames = ['La llave de ónice', 'El medallón familiar', 'El mapa de la mansión']

  return {
    id: `case-${caseIndex}`,
    title: `${difficulty.name}: ${size}x${size} · ${itemNames[index]}`,
    difficulty: difficulty.name,
    gridSize: size,
    victim: characters[0],
    stolenItem: {
      id: `item-${caseIndex}`,
      name: itemNames[index],
      icon: '🔎',
    },
    rooms,
    characters,
    solution: {
      positions,
      thiefId: thief.id,
      stolenFromRoom: stolenRoom.id,
    },
    clues: createClues(difficulty, caseIndex, size, characters, positions, rooms),
  }
}

function createClues(difficulty, caseIndex, gridSize, characters, positions, rooms) {
  const rangeByDifficulty = {
    Fácil: 1,
    Medio: 1,
    Difícil: 2,
    Imposible: 3,
  }
  const range = rangeByDifficulty[difficulty.name]
  const clues = characters.flatMap((character, characterIndex) => {
    const position = positions[character.id]
    const room = rooms.find((candidate) => (
      candidate.row === position.row && candidate.col === position.col
    ))
    const rowMin = Math.max(0, position.row - range)
    const rowMax = Math.min(gridSize - 1, position.row + range)
    const colMin = Math.max(0, position.col - range)
    const colMax = Math.min(gridSize - 1, position.col + range)
    const cluesForCharacter = [
      {
        id: `clue-room-${caseIndex}-${character.id}`,
        type: 'roomHasTrait',
        subject: character.id,
        trait: room.traits[characterIndex % room.traits.length],
        text: `${character.name} estaba en una habitación con ${room.traits[characterIndex % room.traits.length]}.`,
      },
      {
        id: `clue-row-${caseIndex}-${character.id}`,
        type: 'rowRange',
        subject: character.id,
        min: rowMin,
        max: rowMax,
        text: `${character.name} estaba entre las filas ${rowMin + 1} y ${rowMax + 1}.`,
      },
    ]
    if (difficulty.name === 'Difícil' || difficulty.name === 'Imposible') {
      cluesForCharacter.push({
        id: `clue-col-${caseIndex}-${character.id}`,
        type: 'colRange',
        subject: character.id,
        min: colMin,
        max: colMax,
        text: `${character.name} estaba entre las columnas ${colMin + 1} y ${colMax + 1}.`,
      })
    }
    return cluesForCharacter
  })
  return clues
}

export const generatedCases = difficulties.flatMap((difficulty) => (
  difficulty.sizes.map((size, index) => createCase(difficulty, size, index))
))
