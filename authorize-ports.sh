#!/bin/bash
# ==============================================================================
# Script: authorize-ports.sh
# Description: Authorizes incoming traffic for Smart E-Banking microservices
# Ports:
#   - 4200: Angular Modern UI (Clean Light Bento Grid)
#   - 8761: Eureka Discovery Server
#   - 9999: Spring Cloud Gateway
#   - 8056: Customer Service (REST + MCP)
#   - 8057: EBank Service (Accounts, Operations, REST + MCP)
#   - 8058: EBank Bot (Spring AI, Gemini Flash, SSE Flux)
# ==============================================================================

set -e

if [ "$EUID" -ne 0 ]; then
  echo "❌ This script requires root privileges to configure firewall rules."
  echo "👉 Please run with: sudo $0"
  exit 1
fi

echo "=========================================================="
echo "🛡️  Configuring Linux Firewall (iptables / ufw)"
echo "=========================================================="

PORTS=(4200 8761 9999 8056 8057 8058)

for PORT in "${PORTS[@]}"; do
  if iptables -C INPUT -p tcp --dport "$PORT" -j ACCEPT 2>/dev/null; then
    echo "✔️  Port $PORT already allowed in iptables."
  else
    echo "➕ Adding iptables ACCEPT rule for port $PORT..."
    iptables -I INPUT 1 -p tcp --dport "$PORT" -j ACCEPT
  fi
done

# If UFW is active, also add ufw rules
if command -v ufw >/dev/null 2>&1; then
  if ufw status 2>/dev/null | grep -q "Status: active"; then
    echo "🛡️  UFW is active, adding rules to UFW..."
    for PORT in "${PORTS[@]}"; do
      ufw allow "$PORT"/tcp
    done
    ufw reload
  fi
fi

# Persist iptables rules
if command -v netfilter-persistent >/dev/null 2>&1; then
  echo "💾 Persisting iptables rules..."
  netfilter-persistent save
fi

echo ""
echo "=========================================================="
echo "✅ All host firewall ports authorized!"
echo "=========================================================="
echo "⚠️  IMPORTANT FOR ORACLE CLOUD (OCI) / CLOUD PROVIDERS:"
echo "If your VM is in Oracle Cloud, you must also allow these ports"
echo "in your OCI Console Security List (VCN Ingress Rules):"
echo "  - CIDR Source: 0.0.0.0/0"
echo "  - IP Protocol: TCP"
echo "  - Destination Port Range: 4200,8056-8058,8761,9999"
echo "=========================================================="

