// src/playback/timing.js - Timing utilities for message playback

/**
 * Calculate delay based on message type and base delay
 * @param {Object} msg - Message object
 * @param {number} baseDelay - Base delay from config
 * @returns {number} Calculated delay in milliseconds
 */
export function calculateDelay(msg, baseDelay) {
  if (!msg || !baseDelay) return baseDelay;
  
  // Longer pause for day markers
  if (msg.day) {
    return baseDelay * 3;
  }
  
  // Medium pause for context blocks and notes
  const isContext = msg.type === 'context' || 
                   (typeof msg.context === 'boolean' && msg.context);
  
  if (isContext || msg.note || msg.type === 'verse') {
    return baseDelay * 2;
  }
  
  // Default delay for regular messages
  return baseDelay;
}

/**
 * Get display time for scripture banner based on word count
 */
export function getScriptureDisplayTime(verseText, config) {
  if (!verseText || !config?.scripture) return 5000;
  
  const words = verseText.split(/\s+/).length;
  const minTime = config.scripture.minWordsDisplayTime || 5200;
  const maxTime = config.scripture.maxWordsDisplayTime || 9200;
  const wps = config.scripture.wordsPerSecond || 260;
  
  return Math.max(minTime, 
                  Math.min(maxTime, words * wps / 10));
}