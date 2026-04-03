// src/data/validateContent.js - Validate content structure and required fields

/**
 * Valid message types and their required fields
 */
const VALID_MESSAGE_TYPES = {
  day: ['day'],
  context: ['text', 'content'], // Support both text (new) and content (legacy)
  message: ['from', 'text', 'side'],
  note: ['note'],
  verse: ['verseText', 'citation']
};

/**
 * Validate all messages have correct structure
 * @param {Array} messages - Array of message objects
 * @throws {Error} If validation fails with descriptive error message
 */
export function validateMessages(messages) {
  if (!Array.isArray(messages)) {
    throw new Error('Messages must be an array');
  }

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    
    // Check that at least one type identifier exists
    const hasDay = 'day' in msg;
    const hasContext = 'context' in msg || msg.type === 'context';
    const hasNote = 'note' in msg;
    const hasVerseType = msg.type === 'verse';
    const hasMessageType = msg.from && msg.text;

    if (!hasDay && !hasContext && !hasNote && !hasVerseType && !hasMessageType) {
      throw new Error(`Message at index ${i} has no recognized type. Each message must have one of: day, context (or type="context"), note, or from+text.`);
    }

    // Validate based on detected type
    if (msg.type === 'message' || hasMessageType) {
      validateMessageType(msg, i);
    }
    
    if (hasVerseType) {
      validateVerseType(msg, i);
    }
    
    // Check for unknown types
    if (msg.type && !Object.keys(VALID_MESSAGE_TYPES).includes(msg.type)) {
      throw new Error(`Unknown message type "${msg.type}" at index ${i}. Valid types: day, context, message, note, verse`);
    }
  }
}

/**
 * Validate a message object has required fields for its type
 */
function validateMessageType(msg, index) {
  if (!msg.from) {
    throw new Error(`Message at index ${index} of type 'message' missing required field 'from'.`);
  }
  
  if (!msg.text) {
    throw new Error(`Message at index ${index} (${msg.from}) missing required field 'text'.`);
  }
}

/**
 * Validate a verse object has required fields
 */
function validateVerseType(msg, index) {
  if (!msg.verseText) {
    throw new Error(`Message at index ${index} of type 'verse' missing required field 'verseText'.`);
  }
  
  if (!msg.citation) {
    throw new Error(`Message at index ${index} of type 'verse' missing required field 'citation'.`);
  }
}

/**
 * Validate bios data structure
 */
export function validateBios(bios) {
  if (typeof bios !== 'object' || bios === null) {
    throw new Error('Bios must be an object');
  }

  for (const [name, bio] of Object.entries(bios)) {
    if (!bio.role) {
      console.warn(`Bio for "${name}" missing 'role' field.`);
    }
    if (!bio.summary) {
      console.warn(`Bio for "${name}" missing 'summary' field.`);
    }
    // We allow relation and why to be optional, but warn
  }
}

/**
 * Validate typing beats structure (optional)
 */
export function validateTypingBeats(typingBeats) {
  if (!typingBeats) return; // Optional file
  
  if (!Array.isArray(typingBeats)) {
    throw new Error('Typing beats must be an array');
  }

  for (let i = 0; i < typingBeats.length; i++) {
    const beat = typingBeats[i];
    
    // Support both legacy and unified formats
    if (beat.trigger) {
      if (!beat.duration) {
        throw new Error(`Typing beat at index ${i} missing required 'duration' field.`);
      }
      // Validate trigger structure is valid
      if (!['message', 'note', 'context'].includes(beat.trigger.type)) {
        console.warn(`Unknown trigger type "${beat.trigger.type}" at index ${i}.`);
      }
    } else {
      // Legacy format check
      const hasLegacyTrigger = beat.afterText || beat.afterNote || beat.afterContextText;
      if (!hasLegacyTrigger) {
        throw new Error(`Typing beat at index ${i} missing trigger definition.`);
      }
    }
  }
}