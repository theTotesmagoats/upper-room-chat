// src/main.js - Main application entry point

import { loadContent } from './data/loadContent.js';
import { validateMessages, validateBios, validateTypingBeats } from './data/validateContent.js';

// Import UI modules
import { showBio, hideBio, initBioListeners } from './ui/bioPopover.js';
import { startPlayback, playNextMessage } from './playback/startPlayback.js';

// State container (to be refactored into state.js in next pass)
const appState = {
  messagesData: null,
  biosData: null,
  typingBeatsData: null,
  configData: null,
  currentMsgIndex: 0,
  isPlaying: true,
  playbackTimer: null,
  selectedSpeed: 'normal',
  baseDelay: 4500,
  userPausedLive: false,
  unseenCount: 0
};

// DOM references (to be moved to state.js)
const domRefs = {
  chat: document.getElementById('chat'),
  participantCountEl: document.getElementById('participant-count'),
  speedControlsContainer: document.getElementById('speed-controls'),
  scrollBtn: document.getElementById('scroll-btn'),
  newIndicator: document.getElementById('new-indicator'),
  scriptureBanner: document.getElementById('scripture-banner')
};

// Bio DOM references
const bioDomRefs = {
  bioName: document.getElementById('bio-name'),
  bioRole: document.getElementById('bio-role'),
  bioSummary: document.getElementById('bio-summary'),
  bioRelation: document.getElementById('bio-relation'),
  bioWhy: document.getElementById('bio-why'),
  bioPopover: document.getElementById('bio-popover')
};

/**
 * Initialize the application
 */
export async function initApp() {
  try {
    // Load content
    const { messages, bios, typingBeats, config } = await loadContent();
    
    appState.messagesData = messages;
    appState.biosData = bios;
    appState.typingBeatsData = typingBeats;
    appState.configData = config;

    // Initialize state values from config
    appState.selectedSpeed = config.defaultSpeed || 'normal';
    appState.baseDelay = config.speeds[appState.selectedSpeed]?.delay || 4500;

    // Validate content
    validateMessages(messages);
    validateBios(bios);
    validateTypingBeats(typingBeats);

    // Update participant count
    const participants = new Set(
      messages.filter(m => m.from).map(m => m.from)
    ).size;
    domRefs.participantCountEl.textContent = `${participants} participants`;

    // Build speed controls (will be implemented in UI module later)
    renderSpeedControls(config.speeds);

    // Remove loading state
    const loadingState = document.querySelector('.loading-state');
    if (loadingState) {
      loadingState.remove();
    }

    // Initialize bio listeners
    initBioListeners(bioDomRefs);

    // Start message playback
    startPlayback();

  } catch (error) {
    console.error('App initialization failed:', error);
    showFatalErrorUI(`Failed to initialize: ${error.message}`);
  }
}

// Helper functions for speed controls and error handling (to be moved)
function renderSpeedControls(speeds) {
  domRefs.speedControlsContainer.innerHTML = '';
  
  for (const [key, speedConfig] of Object.entries(speeds)) {
    const btn = document.createElement('button');
    btn.className = `speed-btn ${key === appState.selectedSpeed ? 'active' : ''}`;
    btn.dataset.speed = key;
    btn.textContent = speedConfig.label;
    
    btn.addEventListener('click', () => {
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      appState.selectedSpeed = key;
      appState.baseDelay = speedConfig.delay;
      
      if (appState.playbackTimer) {
        clearTimeout(appState.playbackTimer);
        appState.playbackTimer = null;
        playNextMessage();
      }
    });
    
    domRefs.speedControlsContainer.appendChild(btn);
  }
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

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initApp);

// Expose global functions for backwards compatibility
window.resumeLiveFollow = () => {
  if (appState.chat) {
    appState.chat.scrollTop = appState.chat.scrollHeight;
  }
};