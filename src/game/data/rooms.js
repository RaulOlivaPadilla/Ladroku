/**
 * Plantillas de habitaciones y rasgos que el generador de casos puede
 * reutilizar para construir una mansión.
 *
 * @typedef {Object} RoomTemplate
 * @property {string} name
 * @property {string[]} traits
 */

/** @type {RoomTemplate[]} */
export const roomTemplates = [
  { name: 'Cocina', traits: ['ventana', 'fogón'] },
  { name: 'Salón', traits: ['chimenea', 'alfombra'] },
  { name: 'Biblioteca', traits: ['estanterías', 'escritorio'] },
  { name: 'Invernadero', traits: ['ventana', 'plantas'] },
  { name: 'Galería', traits: ['cuadros', 'alfombra'] },
  { name: 'Despacho', traits: ['caja fuerte', 'escritorio'] },
  { name: 'Bodega', traits: ['barriles', 'luz tenue'] },
  { name: 'Comedor', traits: ['ventana', 'mesa larga'] },
  { name: 'Vestíbulo', traits: ['escalera', 'espejo'] },
  { name: 'Sala de música', traits: ['piano', 'alfombra'] },
]
