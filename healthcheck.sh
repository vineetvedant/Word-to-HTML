#!/usr/bin/env bash
set -u

PROJECT_DIR="/home/pi/project TXT to HTML 1.0"
LOG_DIR="$PROJECT_DIR/logs"
HEALTH_LOG="$LOG_DIR/healthcheck.log"
PUBLIC_URL_FILE="$PROJECT_DIR/PUBLIC_URL.txt"
PUBLIC_URL="https://html2word-vedant.thescripter.org/"
LOCAL_URL="http://127.0.0.1:8080/vedant/"
TUNNEL_PID="$LOG_DIR/cloudflared.pid"

mkdir -p "$LOG_DIR"

log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') $*" >>"$HEALTH_LOG"
}

TUNNEL_RUNNING=0
if [ -f "$TUNNEL_PID" ]; then
  PID="$(cat "$TUNNEL_PID" 2>/dev/null || true)"
  if [ -n "$PID" ] && [ -r "/proc/$PID/cmdline" ] && tr '\0' ' ' <"/proc/$PID/cmdline" | grep -q "cloudflared tunnel run --token-file"; then
    TUNNEL_RUNNING=1
  fi
fi

if curl -fsS --max-time 10 "$LOCAL_URL" >/dev/null 2>&1; then
  LOCAL_RUNNING=1
else
  LOCAL_RUNNING=0
fi

if curl -fsS --max-time 15 "$PUBLIC_URL" >/dev/null 2>&1; then
  PUBLIC_RUNNING=1
else
  PUBLIC_RUNNING=0
fi

if [ "$TUNNEL_RUNNING" -eq 1 ] && [ "$LOCAL_RUNNING" -eq 1 ] && [ "$PUBLIC_RUNNING" -eq 1 ]; then
  log "OK public URL, named Cloudflare tunnel, and local app are running: $PUBLIC_URL"
  exit 0
fi

log "FAIL public_running=$PUBLIC_RUNNING tunnel_running=$TUNNEL_RUNNING local_running=$LOCAL_RUNNING; restarting"

if [ -f "$TUNNEL_PID" ]; then
  PID="$(cat "$TUNNEL_PID" 2>/dev/null || true)"
  if [ -n "$PID" ] && kill -0 "$PID" >/dev/null 2>&1; then
    log "Stopping stale Cloudflare tunnel pid $PID"
    kill "$PID" >/dev/null 2>&1 || true
    sleep 2
  fi
  rm -f "$TUNNEL_PID"
fi

for PID in $(pgrep -x cloudflared 2>/dev/null || true); do
  log "Stopping stale Cloudflare tunnel process $PID"
  kill "$PID" >/dev/null 2>&1 || true
done
sleep 2

log "Restarting project and Cloudflare tunnel"
/bin/bash "$PROJECT_DIR/start_server.sh" >>"$LOG_DIR/cron.log" 2>&1

if [ -f "$PROJECT_DIR/PUBLIC_URL.txt" ]; then
  log "Current saved public URL: $(head -n 1 "$PROJECT_DIR/PUBLIC_URL.txt")"
fi
