// src/ui/fatalError.js - Handle fatal error display

/**
 * Display a fatal error message in the UI
 * @param {string} message - Error message to show
 */
export function showError(message) {
  const body = document.body;
  
  // Remove any existing error container
  const existingError = document.querySelector('.fatal-error');
  if (existingError) existingError.remove();

  const errorDiv = document.createElement('div');
  errorDiv.className = 'fatal-error';
  
  const card = document.createElement('div');
  card.innerHTML = `
    <h2 style="color: #d63031; font-size: 24px; margin-bottom: 16px;">Something went wrong</h2>
    <p style="color: #555; line-height: 1.5;">${escapeHtml(message)}</p>
    <button onclick="location.reload()" style="
      mt-4 px-8 py-3 bg-blue-600 text-white rounded-lg font-medium
      border-none cursor-pointer hover:bg-blue-700 transition-colors;
    ">Try Again</button>
  `;
  
  errorDiv.appendChild(card);
  body.appendChild(errorDiv);
}

/**
 * Escape HTML to prevent XSS in error messages
 */
function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}