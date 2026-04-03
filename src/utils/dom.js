// src/utils/dom.js - DOM utility functions

/**
 * Create a new element with optional attributes and content
 */
export function createElement(tagName, className = '', attributes = {}, textContent = '') {
  const el = document.createElement(tagName);
  
  if (className) el.className = className;
  if (textContent) el.textContent = textContent;
  
  for (const [key, value] of Object.entries(attributes)) {
    el.setAttribute(key, value);
  }
  
  return el;
}

/**
 * Add multiple CSS classes to an element
 */
export function addClasses(el, ...classes) {
  if (!el || !classes?.length) return;
  el.classList.add(...classes.filter(c => c));
}

/**
 * Remove multiple CSS classes from an element
 */
export function removeClasses(el, ...classes) {
  if (!el || !classes?.length) return;
  el.classList.remove(...classes.filter(c => c));
}

/**
 * Toggle a class on an element based on condition
 */
export function toggleClass(el, className, force) {
  if (!el) return;
  el.classList.toggle(className, Boolean(force));
}

/**
 * Check if element has any of the given classes
 */
export function hasAnyClass(el, ...classes) {
  if (!el || !classes?.length) return false;
  return classes.some(c => el.classList.contains(c));
}

/**
 * Find first matching element within container
 */
export function findInContainer(container, selector) {
  if (typeof container === 'string') container = document.querySelector(container);
  return container ? container.querySelector(selector) : null;
}

/**
 * Get all elements matching selector
 */
export function queryAll(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

/**
 * Debounce a function call
 */
export function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle a function call
 */
export function throttle(fn, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}