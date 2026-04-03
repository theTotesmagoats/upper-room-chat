// src/ui/bioPopover.js - Handle bio popover display and interaction

/**
 * Show bio information for a contact in the popover
 * @param {Object} domRefs - DOM element references (bioName, bioRole, etc.)
 * @param {Object} biosData - Loaded bios JSON data
 * @param {string} contactName - Name of the contact to show
 */
export function showBio(domRefs, biosData, contactName) {
  const { bioName, bioRole, bioSummary, bioRelation, bioWhy, bioPopover } = domRefs;
  
  if (!bioName || !bioRole || !bioSummary || !bioRelation || !bioWhy || !bioPopover) {
    console.error('Missing DOM references for bio popover');
    return;
  }

  const bio = biosData?.[contactName];
  if (!bio) {
    console.warn(`No bio found for contact: ${contactName}`);
    return;
  }

  // Display bio information
  bioName.textContent = contactName;
  bioRole.textContent = bio.role;
  bioSummary.textContent = bio.summary;
  
  // Don't duplicate labels already stored in bios.json
  bioRelation.textContent = bio.relation;
  bioWhy.textContent = bio.why;

  // Show the popover
  bioPopover.classList.add('visible');
}

/**
 * Hide the bio popover
 */
export function hideBio(bioPopover) {
  if (bioPopover) {
    bioPopover.classList.remove('visible');
  }
}

/**
 * Initialize event listeners for bio interaction
 * @param {Object} domRefs - DOM element references
 */
export function initBioListeners(domRefs) {
  const { bioPopover } = domRefs;
  
  // Hide bio when clicking outside
  document.addEventListener('click', (e) => {
    if (!bioPopover?.contains(e.target) && !e.target.closest('.contact-trigger')) {
      hideBio(bioPopover);
    }
  });
}