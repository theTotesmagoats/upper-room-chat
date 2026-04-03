// src/app/state.js - Shared application state management

/**
 * Application state container
 */
const AppState = {
  messagesData: null,
  biosData: null,
  typingBeatsData: null,
  configData: null,
  
  // Playback state
  currentMsgIndex: 0,
  isPlaying: false,
  playbackTimer: null,
  
  // UI state
  selectedSpeed: 'normal',
  baseDelay: 4500,
  userPausedLive: false,
  unseenCount: 0,
  
  // DOM references
  domElements: {
    chat: null,
    participantCountEl: null,
    speedControlsContainer: null,
    scrollBtn: null,
    newIndicator: null,
    scriptureBanner: null,
    bioName: null,
    bioRole: null,
    bioSummary: null,
    bioRelation: null,
    bioWhy: null,
    bioPopover: null
  }
};

/**
 * Get current state
 */
export function getState() {
  return { ...AppState };
}

/**
 * Update state with partial object
 */
export function updateState(partial) {
  Object.assign(AppState, partial);
}

/**
 * Set DOM element references
 */
export function setDomElements(elements) {
  AppState.domElements = { ...AppState.domElements, ...elements };
}

/**
 * Get a specific DOM element reference
 */
export function getDomElement(name) {
  return AppState.domElements[name];
}

/**
 * Reset state for fresh start
 */
export function resetState() {
  AppState.currentMsgIndex = 0;
  AppState.isPlaying = false;
  AppState.playbackTimer = null;
  AppState.userPausedLive = false;
  AppState.unseenCount = 0;
  
  // Clear timeouts if any
  if (AppState.playbackTimer) {
    clearTimeout(AppState.playbackTimer);
    AppState.playbackTimer = null;
  }
}

/**
 * Get content data safely
 */
export function getMessages() { return AppState.messagesData; }
export function getBios() { return AppState.biosData; }
export function getTypingBeats() { return AppState.typingBeatsData; }
export function getConfig() { return AppState.configData; }

/**
 * Set content data
 */
export function setMessages(data) { AppState.messagesData = data; }
export function setBios(data) { AppState.biosData = data; }
export function setTypingBeats(data) { AppState.typingBeatsData = data; }
export function setConfig(data) { AppState.configData = data; }

/**
 * Get/set playback speed
 */
export function getSelectedSpeed() { return AppState.selectedSpeed; }
export function setSelectedSpeed(speed) {
  AppState.selectedSpeed = speed;
}

/**
 * Get base delay for current speed
 */
export function getBaseDelay() { 
  const speeds = AppState.configData?.speeds || {};
  return speeds[AppState.selectedSpeed]?.delay || AppState.baseDelay;
}