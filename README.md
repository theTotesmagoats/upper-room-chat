# The Upper Room Chat

A narrative chat experience depicting the Upper Room events from Good Friday through Pentecost.

## Architecture Overview

This project uses a modular JavaScript architecture with ES modules:

```
upper-room-chat/
├── index.html              # Main HTML entry point
├── style.css               # Global styles
├── content/                # JSON data files
│   ├── messages.json
│   ├── bios.json
│   ├── typing-beats.json
│   └── config.json
└── src/
    ├── main.js             # App initialization and orchestration
    ├── data/
    │   ├── loadContent.js  # Load and cache JSON content
    │   └── validateContent.js  # Validate message schemas
    ├── app/
    │   ├── initApp.js      # Application setup logic
    │   └── state.js        # Shared application state
    ├── playback/
    │   ├── startPlayback.js    # Playback control
    │   ├── playNextMessage.js  # Message advancement
    │   └── timing.js         # Delay/timing utilities
    ├── render/
    │   ├── renderMessage.js      # Main message rendering dispatcher
    │   ├── renderDay.js          # Day marker rendering
    │   ├── renderContext.js      # Context block rendering
    │   ├── renderNote.js         # Note rendering
    │   ├── renderVerse.js        # Scripture verse rendering
    │   └── renderChatMessage.js  # Chat message rendering
    ├── ui/
    │   ├── speedControls.js      # Playback speed controls
    │   ├── bioPopover.js         # Character bio popovers
    │   ├── scrollFollow.js       # Auto-scroll behavior
    │   └── fatalError.js         # Error display UI
    ├── effects/
    │   ├── typingBeats.js        # Typing indicator logic
    │   └── scriptureBanner.js    # Scripture banner display
    └── utils/
        ├── dom.js                # DOM utilities
        └── escapeHtml.js         # HTML escaping for safety
```

## Module Responsibilities

- **main.js** - Tiny entry point that orchestrates loading and initialization
- **data/** - Content loading and validation only
- **app/** - Application setup and shared state management
- **playback/** - Message playback timing and advancement logic
- **render/** - Pure rendering functions (turn data → DOM)
- **ui/** - Controls, event listeners, user interaction
- **effects/** - Special visual effects (typing beats, banners)
- **utils/** - Helper utilities (HTML escaping, DOM helpers)

## Local Development

This project requires a local server to run properly:

```bash
# Using Python's built-in HTTP server
python3 -m http.server 4173

# Or using Node.js with serve
npm install -g serve
serve -p 4173
```

Then open `http://localhost:4173` in your browser.

## Content Structure

### messages.json

Messages use explicit types for clarity:

- `{ "type": "day", "text": "Day 1 – Good Friday" }`
- `{ "type": "context", "text": "Just after noon..." }`
- `{ "type": "message", "from": "John", "text": "...", "side": "left" }`
- `{ "type": "note", "text": "*Friday — later*" }`
- `{ "type": "verse", "verseText": "...", "citation": "..." }`

### bios.json

Character bios with role, summary, relation, and why:

```json
{
  "Peter": {
    "role": "Simon Peter — fisherman, disciple, and Pentecost preacher",
    "summary": "One of the Twelve...",
    "relation": "To Jesus: close disciple...",
    "why": "Why he is here: Peter stands near..."
  }
}
```

### typing-beats.json

Typing beats use a unified trigger format:

```json
[
  {
    "trigger": {
      "type": "message",
      "from": "Peter",
      "text": "..."
    },
    "duration": 1250,
    "unsent": false
  }
]
```

## Validation

The app validates all content before playback:

- Required fields per message type
- Unknown types detection
- Bios structure validation
- Typing beats format checking

Validation errors show specific messages indicating the problematic index/type.

## Future Development

To add new features:

1. Create modules following the responsibility rules above
2. Add new message types to content/messages.json schema
3. Implement render functions in src/render/
4. Update typing beat matching if needed
5. Test with sample data first

## License

MIT