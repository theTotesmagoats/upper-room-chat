// src/render/renderDay.js - Render day markers

/**
 * Render a day marker element
 * @param {Object} msg - Day message object
 * @param {HTMLElement} container - Parent container to append to
 * @returns {HTMLElement} The created day marker element
 */
export function renderDay(msg, container) {
  const el = document.createElement('div');
  
  // Check for Pentecost in the text (case-insensitive)
  const isPentecost = (msg.text || msg.day || '').toLowerCase().includes('pentecost');
  
  el.className = `day-marker ${isPentecost ? 'pentecost-day' : ''}`;
  el.textContent = msg.text || msg.day;
  
  container.appendChild(el);
  return el;
}