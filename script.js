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

// Fallback inline data for local testing
const fallbackMessages = [
  {"day": "Day 1 – Good Friday", "time": 720},
  {"context": true, "content": "Just after noon. The hill is filling, the city is loud, and those who love Jesus are trying to stay near one another while everything comes apart."},
  {"from": "Mary Magdalene", "text": "They've taken Him to Golgotha.", "side": "left", "charClass": "char-marym"},
  {"from": "John", "text": "I'm here with His mother.", "side": "left", "charClass": "char-john"},
  {"from": "Joanna", "text": "The city is full of shouting.", "side": "left", "charClass": "char-joanna"},
  {"from": "Mary (mother)", "text": "Stay near one another.", "side": "left", "charClass": "char-mary", "emotional": true},
  {"from": "John", "text": "He spoke to me from the cross. He told me to care for His mother.", "side": "left", "charClass": "char-john"},
  {"from": "Salome", "text": "Is there anything we can do?", "side": "left", "charClass": "char-salome"},
  {"from": "John", "text": "We stay. We do not look away.", "side": "left", "charClass": "char-john"},
  {"note": "*Friday — later*", "time": 900},
  {"from": "Matthew", "text": "The sky has gone dark.", "side": "left", "charClass": "char-matthew"},
  {"from": "Andrew", "text": "At this hour?", "side": "left", "charClass": "char-andrew"},
  {"from": "John", "text": "He cried out.", "side": "left", "charClass": "char-john"},
  {"from": "Mary Magdalene", "text": "He said, \"It is finished.\"
