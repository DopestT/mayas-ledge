const tmi = require('tmi.js');
const fs = require('fs');
const path = require('path');

// Paths to communicate with the Overlay
const STATE_FILE = path.join(__dirname, '../overlay/maya_state.json');
const THOUGHTS_FILE = path.join(__dirname, '../lore/thoughts.json');

// Load Lore
const lore = JSON.parse(fs.readFileSync(THOUGHTS_FILE, 'utf8'));

const client = new tmi.Client({
    channels: ['MayasLedge']
});

client.connect();

console.log("Maya's Brain is online. Watching stream...");

// FUNCTION: Update the on-screen display
function updateOverlay(text, mood) {
    const state = {
        message: text,
        mood: mood, // e.g., "pensive", "alert", "coding"
        timestamp: Date.now()
    };
    fs.writeFileSync(STATE_FILE, JSON.stringify(state));
    console.log(`[Display Updated] Maya: ${text}`);
}

// 1. AUTOMOUS BEHAVIOR (Maya thinks to herself every 15-30 mins)
setInterval(() => {
    const randomThought = lore.quotes[Math.floor(Math.random() * lore.quotes.length)];
    updateOverlay(randomThought, "pensive");
}, 900000); // 15 minutes

// 2. REACTIVE BEHAVIOR (Chat triggers on-stream events)
client.on('message', (channel, tags, message, self) => {
    if (self) return;

    // specific keywords trigger specific reactions on screen
    if (message.toLowerCase().includes('coffee')) {
        updateOverlay("Maya takes a sip of coffee...", "drinking");
        // Here you would also trigger an OBS source visibility toggle via WebSocket if you had animations
    }
    
    if (message.toLowerCase().includes('!vibe')) {
        updateOverlay(`Current Vibe Check: ${tags.username} is watching from the void.`, "alert");
    }
});
