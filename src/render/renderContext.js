// src/render/renderContext.js - Render context blocks

/**
 * Render a context block element
 * @param {Object} msg - Context message object  
 * @param {HTMLElement} container - Parent container to append to
 * @returns {HTMLElement} The created context element
 */
export function renderContext(msg, container) {
  const el = document.createElement('div');
  
  // Extract text from appropriate field (new schema uses text, legacy used content)
  const contextText = msg.text || msg.content || '';
  
  // Check for Pentecost in the text (case-insensitive)
  const isPentecost = contextText.toLowerCase().includes('pentecost');
  
  el.className = `context-box ${isPentecost ? 'pentecost-box' : ''}`;
  el.textContent = contextText;
  
  container.appendChild(el);
  return el;
}