// Main application logic for The Upper Room Chat

let messagesData = null;
let biosData = null;
let typingBeatsData = null;
let configData = null;

let currentMsg = 0;
let isPlaying = true;
let currentDayLabel = '';
let currentTimeMinutes = null;
let nextTimer = null;
let bioHideTimer = null;
let currentBioTrigger = null;

let selectedSpeed = 'normal';
let baseDelay = 4500; // Default from config
let autoFollow = true;
let userPausedLive = false;
let suppressScrollListener = false;
let unseenCount = 0;
let lastScrollTop = 0;
let followScrollToken = 0;
let scriptureTimer = null;

// DOM Elements
const chat = document.getElementById('chat');
const bottomSentinel = document.getElementById('bottom-sentinel');
const scrollBtn = document.getElementById('scroll-btn');
const newIndicator = document.getElementById('new-indicator');
const participantCount = document.getElementById('participant-count');
const speedControlsContainer = document.getElementById('speed-controls');
const scriptureBanner = document.getElementById('scripture-banner');
const scriptureBannerTag = document.getElementById('scripture-banner-tag');
const scriptureBannerText = document.getElementById('scripture-banner-text');
const scriptureBannerCitation = document.getElementById('scripture-banner-citation');
const bioPopover = document.getElementById('bio-popover');
const bioName = document.getElementById('bio-name');
const bioRole = document.getElementById('bio-role');
const bioSummary = document.getElementById('bio-summary');
const bioRelation = document.getElementById('bio-relation');
const bioWhy = document.getElementById('bio-why');

// Initialize the application
async function initApp() {
    try {
        // Load all JSON files concurrently
        const [messagesRes, biosRes, typingBeatsRes, configRes] = await Promise.all([
            fetch('./messages.json'),
            fetch('./bios.json'),
            fetch('./typing-beats.json'),
            fetch('./config.json')
        ]);

        messagesData = await messagesRes.json();
        biosData = await biosRes.json();
        typingBeatsData = await typingBeatsRes.json();
        configData = await configRes.json();

        // Set base delay from config
        baseDelay = configData.speeds[configData.defaultSpeed].delay;
        selectedSpeed = configData.defaultSpeed;

        // Build message sequence and initialize UI
        const messages = buildSequence(messagesData);
        
        // Populate speed controls
        populateSpeedControls();
        
        // Update participant count
        updateParticipantCount();

        // Initialize scroll state
        autoFollow = true;
        unseenCount = 0;
        updateNewIndicator();
        hideScriptureBanner(true);
        scrollToBottom(true, true);
        lastScrollTop = chat.scrollTop;

        // Start playback after a short delay
        setTimeout(() => {
            play();
            showScrollButton();
        }, 800);

    } catch (error) {
        console.error('Failed to load application data:', error);
        const loadingState = document.querySelector('.loading-state');
        if (loadingState) {
            loadingState.innerHTML = '<p style="color: red;">Failed to load the Upper Room experience. Please refresh the page.</p>';
        }
    }
}

// Speed controls
function populateSpeedControls() {
    speedControlsContainer.innerHTML = '';
    
    for (const [key, speed] of Object.entries(configData.speeds)) {
        const button = document.createElement('button');
        button.textContent = speed.label;
        button.id = `speed-${speed.id}`;
        
        if (key === configData.defaultSpeed) {
            button.classList.add('active');
        }
        
        button.onclick = () => setSpeed(speed.id);
        speedControlsContainer.appendChild(button);
    }
}

function setSpeed(level) {
    const speedKey = Object.keys(configData.speeds).find(key => 
        configData.speeds[key].id === level
    );
    
    if (speedKey && configData.speeds[speedKey]) {
        selectedSpeed = speedKey;
        baseDelay = configData.speeds[speedKey].delay;

        document.querySelectorAll('.controls button').forEach((btn, i) => {
            btn.classList.toggle('active', i + 1 === level);
        });
    }
}

// Helper functions
function assignConversationSides(items) {
    const resolved = [];
    let lastSpeaker = null;
    let lastSide = 'right';

    for (const item of items) {
        if (!item?.from) {
            resolved.push({ ...item });
            continue;
        }

        const next = { ...item };
        if (lastSpeaker && item.from === lastSpeaker) {
            next.side = lastSide;
        } else {
            next.side = lastSide === 'left' ? 'right' : 'left';
        }

        lastSpeaker = item.from;
        lastSide = next.side;
        resolved.push(next);
    }

    return resolved;
}

function buildSequence(items) {
    const sequence = [];
    const normalizedItems = assignConversationSides(items);

    for (const item of normalizedItems) {
        sequence.push(item);

        for (const beat of typingBeatsData) {
            const matchesAfterText = beat.afterText && item.text === beat.afterText;
            const matchesAfterNote = beat.afterNote && item.note === beat.afterNote;
            const matchesAfterContext = beat.afterContextText && item.content === beat.afterContextText;

            if (matchesAfterText || matchesAfterNote || matchesAfterContext) {
                sequence.push({ type: 'typing', ...beat });
            }
        }
    }

    return assignConversationSides(sequence);
}

// Bio functions
function clearBioHideTimer() {
    if (bioHideTimer) {
        clearTimeout(bioHideTimer);
        bioHideTimer = null;
    }
}

function positionBio(trigger) {
    if (!trigger) return;
    const triggerRect = trigger.getBoundingClientRect();
    const popRect = bioPopover.getBoundingClientRect();
    const margin = 12;

    let top = triggerRect.bottom + 10;
    if (top + popRect.height > window.innerHeight - margin) {
        top = triggerRect.top - popRect.height - 10;
    }
    if (top < margin) top = margin;

    let left = triggerRect.left;
    if (left + popRect.width > window.innerWidth - margin) {
        left = window.innerWidth - popRect.width - margin;
    }
    if (left < margin) left = margin;

    bioPopover.style.top = `${top}px`;
    bioPopover.style.left = `${left}px`;
}

function hideBio() {
    clearBioHideTimer();
    currentBioTrigger = null;
    bioPopover.classList.remove('visible');
    bioPopover.setAttribute('aria-hidden', 'true');
}

function scheduleHideBio() {
    clearBioHideTimer();
    bioHideTimer = setTimeout(() => {
        if (!bioPopover.matches(':hover')) {
            hideBio();
        }
    }, 120);
}

function showBio(trigger, name) {
    const bio = biosData[name];
    if (!bio) return;

    clearBioHideTimer();
    currentBioTrigger = trigger;
    bioName.textContent = name;
    bioRole.textContent = bio.role;
    bioSummary.innerHTML = `<strong>Who:</strong> ${bio.summary}`;
    bioRelation.innerHTML = `<strong>To Jesus:</strong> ${bio.relation.replace(/^To Jesus:\s*/i, '')}`;
    bioWhy.innerHTML = `<strong>Why here:</strong> ${bio.why.replace(/^Why he is here:\s*/i, '').replace(/^Why she is here:\s*/i, '')}`;
    
    bioPopover.classList.add('visible');
    bioPopover.setAttribute('aria-hidden', 'false');
    positionBio(trigger);
}

function buildNameTrigger(msg) {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = `contact-trigger ${msg.charClass || 'char-peter'}`;
    trigger.textContent = msg.from || '';
    trigger.setAttribute('aria-label', `${msg.from} — view bio`);

    trigger.addEventListener('mouseenter', () => showBio(trigger, msg.from));
    trigger.addEventListener('mouseleave', scheduleHideBio);
    trigger.addEventListener('focus', () => showBio(trigger, msg.from));
    trigger.addEventListener('blur', scheduleHideBio);
    trigger.addEventListener('click', (event) => {
        event.stopPropagation();
        if (bioPopover.classList.contains('visible') && currentBioTrigger === trigger) {
            hideBio();
        } else {
            showBio(trigger, msg.from);
        }
    });

    return trigger;
}

// UI component creation
function updateParticipantCount() {
    const names = new Set(
        messagesData
            .filter(item => item.from && item.from.trim())
            .map(item => item.from.trim())
    );
    participantCount.textContent = `${names.size} ${configData.participantCount.prefix}`;
}

function formatTime(minutes) {
    if (typeof minutes !== 'number' || Number.isNaN(minutes)) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    return `${h}:${mins.toString().padStart(2, '0')} ${ampm}`;
}

function updateTimelineState(msg) {
    if (msg.day) {
        currentDayLabel = msg.day;
    }
    if (typeof msg.time === 'number' && !Number.isNaN(msg.time)) {
        currentTimeMinutes = msg.time;
    }
}

function createDayMarker(text) {
    const dayDiv = document.createElement('div');
    dayDiv.className = /Pentecost/i.test(text) ? 'day-marker pentecost-day' : 'day-marker';
    dayDiv.textContent = text;
    return dayDiv;
}

function createContextBox(msg) {
    const contextDiv = document.createElement('div');
    const isPentecost = /Pentecost/i.test(currentDayLabel);
    contextDiv.className = isPentecost ? 'pentecost-box' : 'context-box';

    const em = document.createElement('em');
    em.textContent = msg.content || '';
    contextDiv.appendChild(em);
    return contextDiv;
}

function createNote(msg) {
    const noteDiv = document.createElement('div');
    const isPentecost = /Pentecost/i.test(currentDayLabel);
    noteDiv.className = isPentecost ? 'day-marker pentecost-note' : 'day-marker';
    const em = document.createElement('em');
    em.textContent = (msg.note || '').replace(/^\*|\*$/g, '');
    noteDiv.appendChild(em);
    return noteDiv;
}

function createMessage(msg) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${msg.side || 'left'} pop flash`;

    const nameDiv = document.createElement('div');
    nameDiv.className = 'contact-name';
    nameDiv.appendChild(buildNameTrigger(msg));

    const bubbleDiv = document.createElement('div');
    const bubbleClasses = ['bubble'];
    if (msg.emotional && !msg.pentecostFire) bubbleClasses.push('emotional');
    if (msg.holySpirit) bubbleClasses.push('holy-spirit');
    if (msg.pentecostFire) bubbleClasses.push('pentecost-fire');
    bubbleDiv.className = bubbleClasses.join(' ');
    bubbleDiv.textContent = msg.text || '';

    msgDiv.appendChild(nameDiv);
    msgDiv.appendChild(bubbleDiv);

    if (msg.read) {
        const readDiv = document.createElement('div');
        readDiv.className = 'read-receipt';
        readDiv.textContent = 'Read';
        msgDiv.appendChild(readDiv);
    }

    const timeLabel = formatTime(
        typeof msg.time === 'number' && !Number.isNaN(msg.time)
            ? msg.time
            : currentTimeMinutes
    );

    if (timeLabel) {
        const timestampDiv = document.createElement('div');
        timestampDiv.className = 'timestamp';
        timestampDiv.textContent = timeLabel;
        msgDiv.appendChild(timestampDiv);
    }

    return msgDiv;
}

function createTypingIndicator(item) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message typing-indicator ${item.side || 'left'}`;

    const nameDiv = document.createElement('div');
    nameDiv.className = 'contact-name';
    nameDiv.appendChild(buildNameTrigger(item));

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'bubble';
    bubbleDiv.setAttribute('aria-label', `${item.from} is typing`);

    const srText = document.createElement('span');
    srText.className = 'sr-only';
    srText.textContent = `${item.from} is typing`;
    bubbleDiv.appendChild(srText);

    const dots = document.createElement('span');
    dots.className = 'typing-dots';
    dots.innerHTML = '<span></span><span></span><span></span>';
    bubbleDiv.appendChild(dots);

    const captionDiv = document.createElement('div');
    captionDiv.className = 'typing-caption';
    captionDiv.textContent = item.unsent ? '...' : 'typing…';

    msgDiv.appendChild(nameDiv);
    msgDiv.appendChild(bubbleDiv);
    msgDiv.appendChild(captionDiv);
    return msgDiv;
}

function appendNode(node) {
    chat.insertBefore(node, bottomSentinel);
}

// Scripture banner functions
function hideScriptureBanner(immediate = false) {
    clearTimeout(scriptureTimer);
    scriptureTimer = null;
    scriptureBanner.classList.remove('visible');
    scriptureBanner.classList.add('hidden');
    
    if (immediate) {
        scriptureBannerTag.textContent = '';
        scriptureBannerText.textContent = '';
        scriptureBannerCitation.textContent = '';
        delete scriptureBanner.dataset.tone;
    } else {
        setTimeout(() => {
            if (!scriptureBanner.classList.contains('visible')) {
                scriptureBannerTag.textContent = '';
                scriptureBannerText.textContent = '';
                scriptureBannerCitation.textContent = '';
                delete scriptureBanner.dataset.tone;
            }
        }, 500);
    }
}

function countWords(text = '') {
    return (text.trim().match(/\S+/g) || []).length;
}

function getScriptureDisplayDuration(msg) {
    const words = countWords(`${msg.verseText || ''} ${msg.citation || ''}`);
    return Math.max(
        configData.scripture.minWordsDisplayTime, 
        Math.min(
            configData.scripture.maxWordsDisplayTime,
            configData.scripture.baseDelay + (words * configData.scripture.wordsPerSecond)
        )
    );
}

function showScriptureBanner(msg) {
    hideScriptureBanner(true);
    scriptureBannerTag.textContent = msg.tag || 'Scripture';
    scriptureBannerText.textContent = msg.verseText || '';
    scriptureBannerCitation.textContent = msg.citation || '';
    
    if (msg.tone) {
        scriptureBanner.dataset.tone = msg.tone;
    } else {
        delete scriptureBanner.dataset.tone;
    }

    requestAnimationFrame(() => {
        scriptureBanner.classList.remove('hidden');
        scriptureBanner.classList.add('visible');
    });

    const visibleFor = getScriptureDisplayDuration(msg);
    scriptureTimer = setTimeout(() => {
        hideScriptureBanner();
    }, visibleFor - 450);

    return visibleFor;
}

// Scroll functions
function isNearBottom() {
    return chat.scrollHeight - chat.scrollTop - chat.clientHeight < configData.scroll.thresholdPixelsFromBottom;
}

function updateNewIndicator() {
    if (autoFollow || unseenCount === 0) {
        newIndicator.classList.remove('visible');
        newIndicator.textContent = 'New messages below';
        return;
    }

    newIndicator.textContent = unseenCount === 1
        ? '1 new message below'
        : `${unseenCount} new messages below`;
    newIndicator.classList.add('visible');
}

function showScrollButton() {
    if (autoFollow || isNearBottom()) {
        scrollBtn.classList.remove('visible');
    } else {
        scrollBtn.classList.add('visible');
    }
}

function performScrollToBottom(immediate = false) {
    const token = ++followScrollToken;
    suppressScrollListener = true;
    const behavior = immediate ? 'auto' : 'smooth';

    requestAnimationFrame(() => {
        if (token !== followScrollToken || userPausedLive) return;
        bottomSentinel.scrollIntoView({ block: 'end', behavior });

        setTimeout(() => {
            if (token !== followScrollToken || userPausedLive) {
                suppressScrollListener = false;
                return;
            }
            bottomSentinel.scrollIntoView({ block: 'end', behavior: 'auto' });
            lastScrollTop = chat.scrollTop;
            suppressScrollListener = false;
            showScrollButton();
        }, immediate ? 0 : configData.scroll.typingIndicatorFadeDelay);
    });
}

function scrollToBottom(force = true, immediate = false) {
    if (userPausedLive && !force) {
        showScrollButton();
        return;
    }
    
    if (force || autoFollow || isNearBottom()) {
        performScrollToBottom(immediate);
        return;
    }
    
    showScrollButton();
}

function resumeLiveFollow() {
    userPausedLive = false;
    autoFollow = true;
    unseenCount = 0;
    updateNewIndicator();
    scrollToBottom(true, true);
}

function pauseLiveFollow() {
    if (userPausedLive) return;
    userPausedLive = true;
    autoFollow = false;
    followScrollToken += 1;
    suppressScrollListener = false;
    updateNewIndicator();
    showScrollButton();
}

// Timing and delay calculations
function isImpactLine(text = '') {
    return /(it is finished|my lord and my god|he said my name|the stone is moved|the tomb is empty|a cloud took him|three thousand|receive the holy spirit|he is not here|it is him|my son|we stay\. we do not look away\.|feed my sheep)/i.test(text);
}

function isQuickReply(text = '') {
    return /^(No\.?|Yes\.?|Go\.?|Me too\.?|Brother\.?|Already gone\.?|Praise God\.?|Here\?)$/i.test(text.trim());
}

function getTransitionDelay(currentItem, nextItem) {
    let delay = baseDelay;

    if (!currentItem) {
        return delay;
    }

    if (currentItem.day) delay *= 0.84;
    if (currentItem.note) delay *= 0.90;
    if (currentItem.context) delay *= 1.12;
    if (currentItem.type === 'verse') delay *= 1.08;

    if (currentItem.from && currentItem.text) {
        const words = countWords(currentItem.text);
        delay += Math.min(words * 34, 950);

        if (words <= 2) delay *= 0.52;
        else if (words <= 5) delay *= 0.68;
        else if (words <= 10) delay *= 0.82;
        else if (words >= 18) delay *= 1.12;

        if (currentItem.emotional) delay *= 1.18;
        if (isImpactLine(currentItem.text)) delay *= 1.18;
        if (/…|\.\.\./.test(currentItem.text)) delay *= 1.08;
        if (isQuickReply(currentItem.text)) delay *= 0.70;
        if (/\?$/.test(currentItem.text)) delay *= 0.94;
    }

    if (nextItem?.from && currentItem?.from && nextItem.from === currentItem.from) {
        delay *= 0.72;
    }
    
    if (nextItem?.type === 'verse') {
        delay *= 1.08;
    }

    if (nextItem?.from && nextItem.text) {
        const nextWords = countWords(nextItem.text);
        if (nextWords <= 4) delay *= 0.86;
        if (isQuickReply(nextItem.text)) delay *= 0.82;
    }

    const jitter = 0.86 + Math.random() * 0.34;
    delay *= jitter;

    if (Math.random() < 0.14 && nextItem?.from) {
        delay *= 0.78;
    }

    if ((currentItem?.emotional || currentItem?.context || isImpactLine(currentItem?.text || '')) && Math.random() < 0.40) {
        delay *= 1.18;
    }

    return Math.max(450, Math.min(delay, baseDelay * 1.95));
}

// Message handling
function handleNewContentArrival(wasFollowing) {
    if (wasFollowing && autoFollow && !userPausedLive) {
        unseenCount = 0;
        updateNewIndicator();
        scrollToBottom(true);
    } else {
        unseenCount += 1;
        updateNewIndicator();
        showScrollButton();
    }
}

function addMessage(msg) {
    updateTimelineState(msg);
    const wasFollowing = autoFollow && !userPausedLive;

    if (msg.day && typeof msg.time === 'number' && msg.time > 0) {
        appendNode(createDayMarker(msg.day));
    }

    if (msg.context === true) {
        appendNode(createContextBox(msg));
    }

    if (msg.note && !msg.from) {
        appendNode(createNote(msg));
    }

    if (msg.from && msg.text) {
        appendNode(createMessage(msg));
    }

    handleNewContentArrival(wasFollowing);
    scheduleNext(msg);
}

function playVerse(item) {
    updateTimelineState(item);
    const delay = showScriptureBanner(item);
    advancePlayback(delay);
}

function playTyping(item) {
    const wasFollowing = autoFollow && !userPausedLive;
    const typingNode = createTypingIndicator(item);
    appendNode(typingNode);
    handleNewContentArrival(wasFollowing);

    clearTimeout(nextTimer);
    nextTimer = setTimeout(() => {
        typingNode.classList.add('fade-away');
        setTimeout(() => {
            typingNode.remove();
            if (wasFollowing && autoFollow && !userPausedLive) {
                unseenCount = 0;
                updateNewIndicator();
                scrollToBottom(true, true);
            } else {
                updateNewIndicator();
                showScrollButton();
            }
            advancePlayback(item.unsent ? 260 : 140);
        }, configData.scroll.fadeTypingOutDuration);
    }, item.duration || 1000);
}

function advancePlayback(delay = 0) {
    if (currentMsg + 1 >= messages.length) {
        isPlaying = false;
        const endDiv = document.createElement('div');
        endDiv.className = 'day-marker';
        const em = document.createElement('em');
        em.style.color = '#007aff';
        em.textContent = 'The story continues...';
        endDiv.appendChild(em);
        appendNode(endDiv);
        scrollToBottom(false);
        return;
    }

    clearTimeout(nextTimer);
    nextTimer = setTimeout(() => {
        currentMsg += 1;
        play();
    }, delay);
}

function scheduleNext(currentItem) {
    const nextItem = messages[currentMsg + 1];
    const delay = getTransitionDelay(currentItem, nextItem);
    advancePlayback(delay);
}

// Event handlers
bioPopover.addEventListener('mouseenter', clearBioHideTimer);
bioPopover.addEventListener('mouseleave', hideBio);

document.addEventListener('click', (event) => {
    if (!event.target.closest('.contact-trigger') && !bioPopover.contains(event.target)) {
        hideBio();
    }
});

window.addEventListener('resize', () => {
    if (currentBioTrigger && bioPopover.classList.contains('visible')) {
        positionBio(currentBioTrigger);
    }
});

chat.addEventListener('wheel', (event) => {
    if (event.deltaY < -2) {
        pauseLiveFollow();
    }
}, { passive: true });

let touchStartY = null;
chat.addEventListener('touchstart', (event) => {
    touchStartY = event.touches?.[0]?.clientY ?? null;
}, { passive: true });

chat.addEventListener('touchmove', (event) => {
    const currentY = event.touches?.[0]?.clientY ?? null;
    if (touchStartY !== null && currentY !== null && currentY > touchStartY + 6) {
        pauseLiveFollow();
    }
    if (!isNearBottom()) {
        pauseLiveFollow();
    }
}, { passive: true });

chat.addEventListener('scroll', () => {
    hideBio();
    if (suppressScrollListener) return;

    const currentTop = chat.scrollTop;
    const moved = Math.abs(currentTop - lastScrollTop) > 2;
    const scrollingUp = currentTop < lastScrollTop - 2;
    const nearBottom = isNearBottom();

    if (moved && (scrollingUp || !nearBottom)) {
        pauseLiveFollow();
    }

    if (nearBottom) {
        userPausedLive = false;
        autoFollow = true;
        unseenCount = 0;
    }

    lastScrollTop = currentTop;
    updateNewIndicator();
    showScrollButton();
});

function play() {
    if (!isPlaying) return;
    
    // Ensure messages array exists (initialized after fetch)
    if (!messages || currentMsg >= messages.length) {
        isPlaying = false;
        const endDiv = document.createElement('div');
        endDiv.className = 'day-marker';
        const em = document.createElement('em');
        em.style.color = '#007aff';
        em.textContent = 'The story continues...';
        endDiv.appendChild(em);
        appendNode(endDiv);
        scrollToBottom(false);
        return;
    }
    
    const msg = messages[currentMsg];
    
    if (msg.type === 'typing') {
        playTyping(msg);
        return;
    }
    
    if (msg.type === 'verse') {
        playVerse(msg);
        return;
    }
    
    addMessage(msg);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});
