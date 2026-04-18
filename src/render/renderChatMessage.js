// src/render/renderChatMessage.js - Render chat messages

import { escapeHtml } from '../utils/escapeHtml.js';

/**
 * Render a chat message element with contact trigger and bio support
 * @param {Object} msg - Chat message object
 * @param {HTMLElement} container - Parent container to append to  
 * @returns {HTMLElement} The created chat message element
 */
export function renderChatMessage(msg, container) {
  const el = document.createElement('div');
  
  el.className = `message ${msg.side === 'right' ? 'right' : 'left'}${msg.emotional ? ' emotional' : ''}${msg.pentecostFire ? ' pentecost-fire' : ''}`;
  
  el.innerHTML = `
    <button class="contact-trigger" data-contact="${escapeHtml(msg.from)}" aria-label="View ${escapeHtml(msg.from)}'s bio">
      <span class="contact-name">${escapeHtml(msg.from)}</span>
    </button>
    <div class="bubble${msg.side === 'right' ? ' right' : ''}${msg.emotional ? ' emotional' : ''}${msg.pentecostFire ? ' pentecost-fire' : ''}">${escapeHtml(msg.text)}</div>
  `;
  
  container.appendChild(el);
  return el;
}