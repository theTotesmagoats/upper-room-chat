// src/effects/typingBeats.js - Handle typing beat display and matching

/**
 * Find a typing beat for a given message
 * @param {Object} msg - Message object to match against
 * @param {Array} typingBeatsData - Array of typing beat definitions
 * @returns {Object|null} Matching typing beat or null
 */
export function findTypingBeatForMessage(msg, typingBeatsData) {
  if (!typingBeatsData || !msg) return null;

  // Check for unified trigger format first
  for (const beat of typingBeatsData) {
    if (!beat.trigger) continue;
    
    const { trigger } = beat;
    
    switch (trigger.type) {
      case 'message':
        if (msg.from && trigger.text === msg.text && trigger.from === msg.from) {
          return beat;
        }
        break;
      case 'note':
        // Match notes based on exact text match
        if (msg.note && trigger.text === msg.note) {
          return beat;
        }
        break;
      case 'context':
        // Match context blocks using partial text matching
        const contextText = msg.text || msg.content || '';
        if (trigger.text && contextText.includes(trigger.text.substring(0, Math.min(20, trigger.text.length)))) {
          return beat;
        }
        break;
    }
  }
  
  // Fall back to legacy patterns for backwards compatibility
  for (const beat of typingBeatsData) {
    if (!beat.trigger && (beat.afterText || beat.afterNote || beat.afterContextText)) {
      if (beat.afterText && msg.text === beat.afterText && (!beat.from || msg.from === beat.from)) {
        return beat;
      }
      if (beat.afterNote && msg.note === beat.afterNote) {
        return beat;
      }
    }
  }
  
  return null;
}

/**
 * Show typing indicator for specified duration
 * @param {number} duration - Duration in milliseconds
 */
export function showTypingIndicator(duration) {
  const chatDiv = document.getElementById('chat');
  if (!chatDiv) return;

  const el = document.createElement('div');
  el.className = 'message typing-indicator';
  
  el.innerHTML = `
    <span class="typing-dots">
      <span></span><span></span><span></span>
    </span>
    <span class="typing-caption">...</span>
  `;
  
  chatDiv.appendChild(el);
  
  // Auto fade after duration
  setTimeout(() => {
    el.classList.add('fade-away');
    setTimeout(() => el.remove(), 250);
  }, duration + 100);
}