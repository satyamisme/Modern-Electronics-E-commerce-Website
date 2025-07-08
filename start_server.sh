#!/bin/bash

# Navigate to the project directory if the script is not already there
# cd /path/to/your/project

echo "Starting Vite development server..."

# Start the server in the background, listen on all available IPs,
# redirect stdout/stderr to server.log, and save the PID
nohup npm run dev -- --host 0.0.0.0 > server.log 2>&1 &
echo $! > server.pid

echo "Server started. Output is in server.log. PID is in server.pid"
echo "You can access it via http://<your-vps-ip>:5173 (or the port configured in vite.config.js)"