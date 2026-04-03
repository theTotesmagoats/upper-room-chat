// src/render/renderMessage.js - Main message rendering dispatcher

import { renderDay } from './renderDay.js';
import { renderContext } from './renderContext.js';
import { renderNote } from './renderNote.js';
import { renderVerse } from './renderVerse.js';
import { renderChatMessage } from './renderChatMessage.js';

/**
 * Render a message based on its type
 * @param {Object} msg - Message object to render
 * @returns {HTMLElement|null} The created element or null if no render function matched
 */
export function renderMessage(msg) {
  const chatDiv = document.getElementById('chat');
  if (!chatDiv) return null;

  // Handle day markers
  if (msg.day) {
    return renderDay(msg, chatDiv);
  }

  // Handle context blocks (explicit type or legacy boolean)
  if (msg.type === 'context' || (typeof msg.context === 'boolean' && msg.context)) {
    return renderContext(msg, chatDiv);
  }

  // Handle notes
  if (msg.note) {
    return renderNote(msg, chatDiv);
  }

  // Handle verses
  if (msg.type === 'verse') {
    return renderVerse(msg, chatDiv);
  }

  // Handle normal chat messages
  if (msg.from && msg.text) {
    return renderChatMessage(msg, chatDiv);
  }

  console.warn('No renderer found for message:', msg);
  return null;
}

/**
 * Check if a message should trigger a typing beat
 */
export function hasTypingBeat(msg) {
  // Messages with pentecostFire or emotional flags might have special beats
  return !!(msg.from && msg.text && (msg.pentecostFire || msg.emotional));
}