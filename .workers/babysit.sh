#!/bin/bash
# Babysitter: loop sampai semua parts konten ada & JSON valid.
# - worker yang masih hidup (pgrep by id) → tunggu
# - log DONE tapi file invalid → relaunch
# - tidak ada log/process → launch
cd /home/temamumtaza/Documents/dev/montessori-playbook
mkdir -p .workers/logs content/parts
DEADLINE=$((SECONDS + 5400))  # max 90 menit

valid_json() { python3 -c "import json,sys;json.load(open('$1'))" >/dev/null 2>&1; }

while [ $SECONDS -lt $DEADLINE ]; do
  pending=0
  while IFS=';' read -r id model; do
    [ -z "$id" ] && continue
    # tentukan file output yang diharapkan dari instruksi
    instr=".workers/instr-$id.txt"
    [ -f "$instr" ] || continue
    fname=$(grep -oE 'content/parts/[a-z0-9.-]+\.json' "$instr" | head -1)
    [ -z "$fname" ] && continue

    if [ -f "$fname" ] && valid_json "$fname"; then
      continue  # sudah beres
    fi

    alive=$(pgrep -f "id pekerjaan: $id" | head -1)
    if [ -n "$alive" ]; then
      pending=$((pending+1))
      continue  # masih jalan
    fi

    # perlu (re)launch
    attempts=$(cat ".workers/attempts-$id" 2>/dev/null || echo 0)
    if [ "$attempts" -ge 4 ]; then
      pending=$((pending+1))
      continue  # menyerah untuk id ini, dilaporkan nanti
    fi
    echo $((attempts+1)) > ".workers/attempts-$id"
    PROMPT="$(cat .workers/base-prompt.txt)

=== INSTRUKSI KHUSUS UNTUKMU (id pekerjaan: $id) ===
$(cat "$instr")"
    nohup opencode run --model "$model" "$PROMPT" < /dev/null > ".workers/logs/$id.log" 2>&1 &
    echo "[$(date +%H:%M:%S)] launch $id (attempt $((attempts+1)), $model)"
    pending=$((pending+1))
    sleep 2
  done < .workers/specs.tsv

  if [ "$pending" -eq 0 ]; then
    echo "[$(date +%H:%M:%S)] SEMUA PARTS KONTEN BERES"
    exit 0
  fi
  sleep 45
done
echo "TIMEOUT: ada worker yang tidak selesai. Cek .workers/logs/"
exit 1
