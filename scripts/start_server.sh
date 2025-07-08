#!/bin/bash

# Navigate to the project directory if the script is not already there
# cd /path/to/your/project

echo "Starting Vite development server..."

# Start the server in the background, listen on all available IPs,
# redirect stdout/stderr to server.log, and save the PID
nohup npm run dev -- --host 0.0.0.0 > server.log 2>&1 &
echo $! > server.pid

echo "Server started. Output is in server.log. PID is in server.pid"
echo "You can access it via http://$(curl -s ifconfig.me):5173"
echo "Or via your domain if DNS is configured: http://lakkiphones.work.gd"