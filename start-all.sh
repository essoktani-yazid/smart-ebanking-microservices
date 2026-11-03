#!/bin/bash
# ==============================================================================
# Script: start-all.sh
# Description: Starts all Smart E-Banking Microservices & Angular UI in background
# ==============================================================================

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

# Load local environment variables if .env exists
if [ -f "$ROOT_DIR/.env" ]; then
  set -a
  source "$ROOT_DIR/.env"
  set +a
fi

if [ -z "$GEMINI_API_KEY" ]; then
  export GEMINI_API_KEY="AIzaSyDemoPlaceholderKeyForLocalStartup"
fi
if [ -z "$TELEGRAM_TOKEN" ]; then
  export TELEGRAM_TOKEN="123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ_DummyToken"
fi
if [ -z "$DISCORD_TOKEN" ]; then
  export DISCORD_TOKEN="MTEwMDAwMDAwMDAwMDAwMDAwMA.Dummy.TokenForDevStartupOnly"
fi

mkdir -p "$ROOT_DIR/logs"
PID_FILE="$ROOT_DIR/logs/.pids"
> "$PID_FILE"

echo "=========================================================="
echo "🚀 Starting Smart E-Banking Platform"
echo "=========================================================="

# 1. Stop any currently running services
"$ROOT_DIR/stop-all.sh" > /dev/null 2>&1 || true
sleep 1

JAVA_OPTS="-Xms256m -Xmx512m"

# 2. Start Eureka Discovery Service (port 8761)
echo "📡 [1/6] Starting Eureka Discovery Server (Port 8761)..."
DISCOVERY_JAR=$(ls -1 discovery-service/target/discovery-service-*.jar 2>/dev/null | grep -v original | head -n 1)
if [ -z "$DISCOVERY_JAR" ]; then
  echo "❌ Error: discovery-service jar not found. Please run mvn package first."
  exit 1
fi
nohup java $JAVA_OPTS -jar "$DISCOVERY_JAR" </dev/null > "$ROOT_DIR/logs/discovery-service.log" 2>&1 &
DISCOVERY_PID=$!
echo "$DISCOVERY_PID" >> "$PID_FILE"
echo "   Eureka started (PID: $DISCOVERY_PID). Waiting for ready status..."

for i in {1..35}; do
  if curl -s http://localhost:8761 >/dev/null 2>&1; then
    echo "   ✔️ Eureka is ready!"
    break
  fi
  sleep 1
done

# 3. Start Customer Service (port 8056)
echo "👥 [2/6] Starting Customer Service (Port 8056)..."
CUSTOMER_JAR=$(ls -1 customer-service/target/customer-service-*.jar 2>/dev/null | grep -v original | head -n 1)
nohup java $JAVA_OPTS -jar "$CUSTOMER_JAR" </dev/null > "$ROOT_DIR/logs/customer-service.log" 2>&1 &
echo "$!" >> "$PID_FILE"
echo "   Customer Service started (PID: $!)."

# 4. Start EBank Service (port 8057)
echo "💳 [3/6] Starting EBank Service (Port 8057)..."
EBANK_JAR=$(ls -1 ebank-service/target/ebank-service-*.jar 2>/dev/null | grep -v original | head -n 1)
nohup java $JAVA_OPTS -jar "$EBANK_JAR" </dev/null > "$ROOT_DIR/logs/ebank-service.log" 2>&1 &
echo "$!" >> "$PID_FILE"
echo "   EBank Service started (PID: $!)."

# 5. Start Gateway Service (port 9999)
echo "🌐 [4/6] Starting Spring Cloud Gateway (Port 9999)..."
GATEWAY_JAR=$(ls -1 gateway-service/target/gateway-service-*.jar 2>/dev/null | grep -v original | head -n 1)
nohup java $JAVA_OPTS -jar "$GATEWAY_JAR" </dev/null > "$ROOT_DIR/logs/gateway-service.log" 2>&1 &
echo "$!" >> "$PID_FILE"
echo "   Gateway Service started (PID: $!)."

# Wait for Customer Service and EBank Service before starting EBank Bot (MCP dependencies)
echo "⏳ Waiting for Customer & EBank services to initialize..."
for i in {1..45}; do
  if curl -s http://localhost:8056/customers >/dev/null 2>&1 && curl -s http://localhost:8057/accounts >/dev/null 2>&1; then
    echo "   ✔️ Customer and EBank services are ready!"
    break
  fi
  sleep 1
done

# 6. Start EBank Bot (port 8058)
echo "🤖 [5/6] Starting EBank Bot (Port 8058)..."
BOT_JAR=$(ls -1 ebank-bot/target/ebank-bot-*.jar 2>/dev/null | grep -v original | head -n 1)
nohup java $JAVA_OPTS \
  -Dspring.ai.google.genai.api-key="$GEMINI_API_KEY" \
  -Dspring.ai.google.genai.chat.model=gemini-3.5-flash-lite \
  -Dtelegram.token="$TELEGRAM_TOKEN" \
  -Dtelegram.username=ebank1234_bot \
  -Ddiscord.token="$DISCORD_TOKEN" \
  -jar "$BOT_JAR" </dev/null > "$ROOT_DIR/logs/ebank-bot.log" 2>&1 &
echo "$!" >> "$PID_FILE"
echo "   EBank Bot started (PID: $!)."

for i in {1..25}; do
  if curl -s http://localhost:8058 >/dev/null 2>&1 || curl -s http://localhost:8058/actuator/health >/dev/null 2>&1; then
    echo "   ✔️ EBank Bot is ready on port 8058!"
    break
  fi
  sleep 1
done

# 7. Start Angular Frontend (port 4200)
echo "🎨 [6/6] Starting Angular Clean-Light UI (Port 4200 on 0.0.0.0)..."
(
  cd "$ROOT_DIR/angular-front"
  nohup npm start </dev/null > "$ROOT_DIR/logs/angular-front.log" 2>&1 &
  echo "$!" >> "$PID_FILE"
)
echo "   Angular UI starting. Waiting for build..."

for i in {1..25}; do
  if curl -s http://localhost:4200 >/dev/null 2>&1; then
    echo "   ✔️ Angular UI is ready on port 4200!"
    break
  fi
  sleep 1
done

# 8. Start Cloudflare HTTPS Public Tunnel (instant firewall-free access)
CLOUDFLARED_BIN="/home/yazid/.local/bin/cloudflared"
TUNNEL_URL=""
if [ -x "$CLOUDFLARED_BIN" ]; then
  echo "⚡ [Extra] Launching Cloudflare HTTPS Zero-Firewall Tunnel..."
  nohup "$CLOUDFLARED_BIN" tunnel --url http://localhost:4200 </dev/null > "$ROOT_DIR/logs/tunnel.log" 2>&1 &
  echo "$!" >> "$PID_FILE"
  for i in {1..15}; do
    TUNNEL_URL=$(grep -oE "https://[a-zA-Z0-9-]+\.trycloudflare\.com" "$ROOT_DIR/logs/tunnel.log" | tail -n 1)
    if [ -n "$TUNNEL_URL" ]; then
      break
    fi
    sleep 1
  done
fi

echo ""
echo "=========================================================="
echo "🎉 All services launched in background!"
echo "=========================================================="
PUBLIC_IP="51.170.134.81"
echo ""
if [ -n "$TUNNEL_URL" ]; then
  echo "🚀 INSTANT PUBLIC HTTPS ACCESS (No Firewall / Port Forwarding Required!):"
  echo "   👉 $TUNNEL_URL"
  echo ""
fi
echo "🌐 Direct Public Access Points (Requires Firewall / OCI Port Authorization):"
echo "   - Modern Web UI:    http://${PUBLIC_IP}:4200"
echo "   - Eureka Dashboard: http://${PUBLIC_IP}:8761"
echo "   - API Gateway:      http://${PUBLIC_IP}:9999"
echo "   - Customers API:    http://${PUBLIC_IP}:9999/CUSTOMER-SERVICE/customers"
echo "   - Accounts API:     http://${PUBLIC_IP}:9999/EBANK-SERVICE/accounts"
echo "   - Bot Stream API:   http://${PUBLIC_IP}:9999/EBANK-BOT/chatStream?query=hello"
echo ""
echo "💻 Local Access Points:"
echo "   - Modern Web UI:    http://localhost:4200"
echo "   - Eureka Dashboard: http://localhost:8761"
echo "   - API Gateway:      http://localhost:9999"
echo ""
echo "📝 Logs are available in: $ROOT_DIR/logs/"
echo "   To view logs: tail -f logs/*.log"
echo "🛑 To stop all services: ./stop-all.sh"
echo "=========================================================="
