#!/bin/bash
# ==============================================================================
# Script: stop-all.sh
# Description: Gracefully stops all Smart E-Banking microservices & Angular front
# ==============================================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$ROOT_DIR/logs/.pids"

echo "=========================================================="
echo "🛑 Stopping Smart E-Banking Microservices & Frontend..."
echo "=========================================================="

if [ -f "$PID_FILE" ]; then
  while read -r pid; do
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
      echo "Stopping PID $pid..."
      kill -15 "$pid" 2>/dev/null || true
    fi
  done < "$PID_FILE"
  rm -f "$PID_FILE"
fi

sleep 1

PORTS=(4200 8761 9999 8056 8057 8058)

for PORT in "${PORTS[@]}"; do
  PIDS=$(lsof -ti tcp:"$PORT" 2>/dev/null || true)
  if [ -n "$PIDS" ]; then
    echo "Stopping remaining process on port $PORT (PIDs: $PIDS)..."
    kill -15 $PIDS 2>/dev/null || true
    sleep 1
    PIDS_REMAINING=$(lsof -ti tcp:"$PORT" 2>/dev/null || true)
    if [ -n "$PIDS_REMAINING" ]; then
      kill -9 $PIDS_REMAINING 2>/dev/null || true
    fi
  fi
done

pkill -f "discovery-service-0.0.1-SNAPSHOT.jar" 2>/dev/null || true
pkill -f "customer-service-0.0.1-SNAPSHOT.jar" 2>/dev/null || true
pkill -f "ebank-service-0.0.1-SNAPSHOT.jar" 2>/dev/null || true
pkill -f "gateway-service-0.0.1-SNAPSHOT.jar" 2>/dev/null || true
pkill -f "ebank-bot-0.0.1-SNAPSHOT.jar" 2>/dev/null || true
pkill -f "ng serve" 2>/dev/null || true

echo "=========================================================="
echo "✅ All microservices and frontend have been stopped."
echo "=========================================================="
