#!/usr/bin/env bash
set -eu

PROJECT_DIR="/home/pi/project TXT to HTML 1.0"
LOG_DIR="$PROJECT_DIR/logs"
SERVER_LOG="$LOG_DIR/server.log"
TUNNEL_LOG="$LOG_DIR/cloudflared.log"
PUBLIC_URL_FILE="$PROJECT_DIR/PUBLIC_URL.txt"
LB_PID="$LOG_DIR/load_balancer.pid"
TUNNEL_PID="$LOG_DIR/cloudflared.pid"
TUNNEL_TOKEN_FILE="$PROJECT_DIR/.cloudflared-token"

mkdir -p "$LOG_DIR"
cd "$PROJECT_DIR"

is_load_balancer_running() {
  [ -f "$LB_PID" ] || return 1
  PID="$(cat "$LB_PID")"
  [ -r "/proc/$PID/cmdline" ] || return 1
  tr '\0' ' ' <"/proc/$PID/cmdline" | grep -q "load_balancer.py"
}

is_named_tunnel_running() {
  [ -f "$TUNNEL_PID" ] || return 1
  PID="$(cat "$TUNNEL_PID")"
  [ -r "/proc/$PID/cmdline" ] || return 1
  tr '\0' ' ' <"/proc/$PID/cmdline" | grep -q "cloudflared tunnel run --token-file"
}

if ! is_load_balancer_running; then
  setsid python3 "$PROJECT_DIR/load_balancer.py" >>"$SERVER_LOG" 2>&1 < /dev/null &
  echo "$!" >"$LB_PID"
fi

if is_named_tunnel_running; then
  :
else
  : >"$TUNNEL_LOG"
  setsid cloudflared tunnel run --token-file "$TUNNEL_TOKEN_FILE" --url http://127.0.0.1:8080 >>"$TUNNEL_LOG" 2>&1 < /dev/null &
  echo "$!" >"$TUNNEL_PID"
fi

{
  echo "https://html2word-vedant.thescripter.org/"
  echo
  echo "Cloudflare named tunnel is configured through the provided token."
  echo "Local project URL: http://127.0.0.1:8080/vedant/"
  echo "Updated: $(date)"
} >"$PUBLIC_URL_FILE"
