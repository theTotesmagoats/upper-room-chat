// src/ui/scrollFollow.js - Handle auto-scroll behavior and new message indicators

import { updateState, getDomElement } from '../app/state.js';

/**
 * Initialize scroll follow event listeners
 */
export function initScrollListeners() {
  const chat = getDomElement('chat');
  if (!chat) return;

  // Scroll listener for new messages
  chat.addEventListener('scroll', handleChatScroll);
}

/**
 * Handle chat scroll events
 */
function handleChatScroll() {
  const userPausedLive = updateState().userPausedLive || false;
  
  if (userPausedLive) return;
  
  const threshold = getDomElement('config')?.scroll?.thresholdPixelsFromBottom || 90;
  const fromBottom = getDomElement('chat').scrollHeight - 
                     getDomElement('chat').scrollTop - 
                     getDomElement('chat').clientHeight;
  
  if (fromBottom <= threshold) {
    hideNewMessageIndicators();
  } else if (!updateState().userPausedLive && fromBottom > threshold * 2) {
    incrementUnseenCount();
  }
}

/**
 * Increment unseen message count and show scroll button
 */
function incrementUnseenCount() {
  const state = updateState();
  state.unseenCount++;
  
  if (state.unseenCount >= 3) {
    const scrollBtn = getDomElement('scrollBtn');
    if (scrollBtn) scrollBtn.classList.add('visible');
  }
}

/**
 * Hide new message indicators and reset count
 */
export function hideNewMessageIndicators() {
  updateState({ unseenCount: 0 });
  
  const scrollBtn = getDomElement('scrollBtn');
  const newIndicator = getDomElement('newIndicator');
  
  if (scrollBtn) scrollBtn.classList.remove('visible');
  if (newIndicator) newIndicator.classList.remove('visible');
}

/**
 * Scroll to bottom and reset state
 */
export function scrollToBottomAndReset() {
  updateState({ userPausedLive: false, unseenCount: 0 });
  
  const chat = getDomElement('chat');
  if (chat) {
    chat.scrollTop = chat.scrollHeight;
  }
  
  hideNewMessageIndicators();
}

/**
 * Show scroll button when scrolled up
 */
export function checkScrollPosition() {
  const chat = getDomElement('chat');
  if (!chat) return;
  
  const threshold = getDomElement('config')?.scroll?.thresholdPixelsFromBottom || 90;
  const fromBottom = chat.scrollHeight - chat.scrollTop - chat.clientHeight;
  
  const scrollBtn = getDomElement('scrollBtn');
  if (fromBottom > threshold && scrollBtn) {
    scrollBtn.classList.add('visible');
  } else if (scrollBtn) {
    scrollBtn.classList.remove('visible');
  }
}