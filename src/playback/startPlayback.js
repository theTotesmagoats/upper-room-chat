// src/playback/startPlayback.js - Handle message playback control

import { showTypingIndicator } from '../effects/typingBeats.js';
import { escapeHtmlFields } from '../utils/escapeHtml.js';

/**
 * Start message playback from beginning
 */
export function startPlayback() {
  window.currentMsgIndex = 0;
  window.isPlaying = true;
  playNextMessage();
}

/**
 * Play the next message in sequence
 */
export function playNextMessage() {
  if (!window.isPlaying || !window.messagesData || window.currentMsgIndex >= window.messagesData.length) {
    return;
  }

  const msg = window.messagesData[window.currentMsgIndex];
  
  try {
    // Use global renderMessage function for now (to be refactored later)
    renderMessage(msg);
    
    // Check for typing beats
    checkTypingBeat(msg);
  } catch (err) {
    console.error(`Error rendering message at index ${window.currentMsgIndex}:`, err, msg);
    showFatalErrorUI(`Failed to render message #${window.currentMsgIndex + 1} (${msg.day || msg.type || 'unknown type'}). Please check the data.`);
    return;
  }

  // Determine delay based on message type
  let delay = window.baseDelay;
  
  if (msg.day) {
    delay = window.baseDelay * 3; // Longer pause for day markers
  } else if (msg.context || msg.note || msg.type === 'verse') {
    delay = window.baseDelay * 2;
  }

  window.currentMsgIndex++;
  window.playbackTimer = setTimeout(playNextMessage, delay);
}

/**
 * Check for typing beats after a message
 */
function checkTypingBeat(msg) {
  const beat = findTypingBeatForMessage(msg, window.typingBeatsData);
  
  if (beat && !beat.unsent) {
    showTypingIndicator(beat.duration);
  }
}

// Helper functions that will be moved to appropriate modules later
function findTypingBeatForMessage(msg, typingBeatsData) {
  return null; // Stub - will be implemented in next commit
}

function showFatalErrorUI(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'fatal-error';
  
  const card = document.createElement('div');
  card.innerHTML = `
    <h2 style="color: #d63031; font-size: 24px; margin-bottom: 16px;">Something went wrong</h2>
    <p style="color: #555; line-height: 1.5;">${message}</p>
    <button onclick="location.reload()" style="
      mt-4 px-8 py-3 bg-blue-600 text-white rounded-lg font-medium
      border-none cursor-pointer hover:bg-blue-700 transition-colors;
    ">Try Again</button>
  `;
  
  errorDiv.appendChild(card);
  document.body.appendChild(errorDiv);
}