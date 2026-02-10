#!/bin/bash
echo "Initializing Maya's Ledge System..."

# Start Python scripts in background
python3 scripts/weather_api.py &
python3 scripts/time_sync.py &

# Start Twitch Bot
node scripts/bot_logic.js
