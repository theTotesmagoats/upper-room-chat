// src/render/renderVerse.js - Render scripture verses

import { calculateDelay } from '../playback/timing.js';
import { escapeHtml } from '../utils/escapeHtml.js';

/**
 * Render a verse element (scripture banner)
 * @param {Object} msg - Verse message object
 * @param {HTMLElement} container - Parent container to append to
 * @returns {HTMLElement} The created verse element
 */
export function renderVerse(msg, container) {
  const bannerEl = document.createElement('div');
  
  bannerEl.className = 'scripture-banner';
  bannerEl.dataset.tone = msg.tone || '';
  
  let tagText = msg.tag || 'Scripture';
  if (msg.side === 'right' && !msg.tag) tagText = 'Rumor in the city';
  
  bannerEl.innerHTML = `
    <div class="scripture-banner-tag">${escapeHtml(tagText)}</div>
    <div class="scripture-banner-text">"${escapeHtml(msg.verseText)}"</div>
    <div class="scripture-banner-citation">${escapeHtml(msg.citation)}</div>
  `;
  
  container.appendChild(bannerEl);
  
  // Show banner with timing
  setTimeout(() => bannerEl.classList.add('visible'), 50);
  
  const wordCount = msg.verseText.split(/\s+/).length;
  const baseDelay = calculateDelay(msg, 4500);
  
  const displayTime = Math.max(
    5200,
    Math.min(9200, wordCount * (baseDelay / 10))
  );
  
  setTimeout(() => {
    bannerEl.classList.remove('visible');
    setTimeout(() => bannerEl.remove(), 500);
  }, displayTime);
  
  return bannerEl;
}