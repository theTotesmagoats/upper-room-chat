// src/data/loadContent.js - Load and cache JSON content files

let cachedContent = null;

/**
 * Load all content files concurrently
 * @returns {Promise<Object>} Promise resolving to object with messages, bios, typingBeats, config
 */
export async function loadContent() {
  if (cachedContent) {
    return cachedContent;
  }

  try {
    const [messages, bios, typingBeats, config] = await Promise.all([
      fetch('content/messages.json').then(r => r.json()),
      fetch('content/bios.json').then(r => r.json()),
      fetch('content/typing-beats.json').then(r => r.json()),
      fetch('content/config.json').then(r => r.json())
    ]);

    cachedContent = { messages, bios, typingBeats, config };
    return cachedContent;
  } catch (error) {
    console.error('Failed to load content:', error);
    throw new Error(`Failed to load content files: ${error.message}`);
  }
}

/**
 * Clear cached content (useful for testing)
 */
export function clearCache() {
  cachedContent = null;
}