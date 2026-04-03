# The Upper Room Chat

A narrative chat experience depicting the events from Good Friday through Pentecost, as experienced by Jesus' followers.

## Features

- **Interactive Narrative**: Experience the biblical account of Jesus' crucifixion, resurrection, and the coming of the Holy Spirit as a dynamic chat conversation
- **Character Bios**: Hover over character names to see detailed information about each participant
- **Scripture Integration**: Key biblical verses appear as banners during important moments
- **Multiple Playback Speeds**: Choose between fast (4 min), normal (10 min), or slow (20 min) playback
- **Responsive Design**: Works beautifully on both desktop and mobile devices

## Architecture

This application is built with a modular structure:

```
upper-room-chat/
├── index.html              # Main HTML shell
├── style.css               # All styling rules
├── script.js               # Application logic (fetches JSON data)
├── messages.json           # Narrative content (messages, day markers, context)
├── bios.json               # Character biographical information
├── typing-beats.json       # Typing indicator definitions
└── config.json             # Application configuration
```

### Benefits of This Structure

- **Easy Content Updates**: Edit narrative in `messages.json` without touching code
- **Collaborative Development**: Different team members can work on content, styling, or logic
- **Maintainable Codebase**: Clear separation of concerns makes debugging easier
- **Scalable Design**: Easy to add new features like dark mode or export functionality

## Getting Started

### For Users

Simply open `index.html` in any modern web browser, or visit the deployed GitHub Pages site.

### For Developers

1. Clone this repository
2. Make changes as needed:
   - Update `messages.json` for narrative content
   - Modify `style.css` for visual changes
   - Edit `script.js` for functionality updates
3. Test locally by opening `index.html`
4. Deploy to GitHub Pages via repository settings

## Configuration

Edit `config.json` to customize:

- **Speed Settings**: Adjust playback timing and labels
- **Scripture Display Times**: Control how long verses appear
- **Scroll Behavior**: Fine-tune auto-scroll thresholds

## Deployment

This application is designed for easy deployment on GitHub Pages:

1. Push all files to your repository
2. Go to Settings → Pages
3. Select "main" branch as source
4. Click Save

Your site will be live at `https://yourusername.github.io/upper-room-chat/`

## Future Enhancements

Potential improvements:
- Dark mode toggle
- Font size controls
- Export narrative as PDF
- Skip to specific days/sections
- Audio narration integration
- Multi-language support

## License

This project is open source and available for personal and ministry use.
