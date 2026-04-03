// src/ui/speedControls.js - Handle playback speed controls UI

import { updateState, getSelectedSpeed, setSelectedSpeed, getBaseDelay } from '../app/state.js';

/**
 * Create and render speed control buttons
 * @param {Object} speedsConfig - Speed configuration object from config.json
 */
export function createSpeedControls(speedsConfig) {
  const container = document.getElementById('speed-controls');
  if (!container) return;

  // Clear existing controls
  container.innerHTML = '';

  for (const [key, speedConfig] of Object.entries(speedsConfig)) {
    const btn = createSpeedButton(key, speedConfig);
    container.appendChild(btn);
  }
}

/**
 * Create a single speed control button
 */
function createSpeedButton(key, speedConfig) {
  const btn = document.createElement('button');
  btn.className = `speed-btn ${key === getSelectedSpeed() ? 'active' : ''}`;
  btn.dataset.speed = key;
  btn.textContent = speedConfig.label;

  btn.addEventListener('click', () => handleSpeedChange(key));
  
  return btn;
}

/**
 * Handle speed button click
 */
function handleSpeedChange(newSpeed) {
  // Update active state
  document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
  
  const activeBtn = document.querySelector(`.speed-btn[data-speed="${newSpeed}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }

  // Update state
  setSelectedSpeed(newSpeed);
  
  // Restart playback with new delay
  restartPlayback();
}

/**
 * Restart playback with current speed settings
 */
function restartPlayback() {
  const timer = window.playbackTimer || null;
  
  if (timer) {
    clearTimeout(timer);
    window.playbackTimer = null;
    
    // Call the global function that will use updated state
    playNextMessage();
  }
}

// Helper for playNextMessage to access current delay
export function getCurrentDelay() {
  return getBaseDelay();
}