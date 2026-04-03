// src/render/renderNote.js - Render notes (time markers)

/**
 * Render a note element (time marker)
 * @param {Object} msg - Note message object
 * @param {HTMLElement} container - Parent container to append to
 * @returns {HTMLElement} The created note element
 */
export function renderNote(msg, container) {
  const el = document.createElement('div');
  
  el.className = 'note';
  el.style.cssText = `
    text-align: center; font-size: 12px; color: #666;
    margin: 10px auto; max-width: 300px; font-style: italic;
  `;
  el.textContent = msg.note;
  
  container.appendChild(el);
  return el;
}