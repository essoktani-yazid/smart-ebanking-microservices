#!/bin/bash
# ==============================================================================
# Script: run-daemon.sh
# Description: Starts all services and keeps supervisor alive in daemon mode
# ==============================================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

cleanup() {
  echo "Supervisor stopping all services..."
  "$ROOT_DIR/stop-all.sh"
  exit 0
}

trap cleanup SIGINT SIGTERM

"$ROOT_DIR/start-all.sh"

echo "🌟 Daemon supervisor active. All services running."
while true; do
  sleep 30
done
