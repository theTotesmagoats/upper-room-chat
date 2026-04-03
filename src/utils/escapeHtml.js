// src/utils/escapeHtml.js - Escape HTML to prevent XSS attacks

/**
 * Escape special characters in text for safe HTML rendering
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for HTML insertion
 */
export function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Escape multiple fields in an object safely
 * @param {Object} obj - Object with text properties to escape
 * @param {Array<string>} fields - Field names to escape
 * @returns {Object} New object with escaped fields
 */
export function escapeHtmlFields(obj, fields) {
  if (typeof obj !== 'object' || !fields?.length) return obj;
  
  const result = { ...obj };
  for (const field of fields) {
    if (typeof obj[field] === 'string') {
      result[field] = escapeHtml(obj[field]);
    }
  }
  return result;
}