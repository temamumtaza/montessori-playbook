#!/bin/bash
# Queue dispatcher: jalankan worker konten BERURUTAN (max 2 paralel).
# Free tier opencode tidak stabil untuk >2 sesi concurrent.
cd /home/temamumtaza/Documents/dev/montessori-playbook
mkdir -p .workers/logs content/parts
MAXPAR=2
DEADLINE=$((SECONDS + 7200))  # 2 jam max

valid_json() { python3 -c "import json,sys;json.load(open('$1'))" >/dev/null 2>&1; }

pids=()
launch() {
  local id="$1" model="$2"
  local instr=".workers/instr-$id.txt"
  local fname=$(grep -oE 'content/parts/[a-z0-9.-]+\.json' "$instr" | head -1)
  local attempts=$(cat ".workers/attempts-$id" 2>/dev/null || echo 0)
  if [ "$attempts" -ge 3 ]; then echo "[$id] skip (3x gagal)"; return 1; fi
  echo $((attempts+1)) > ".workers/attempts-$id"
  local PROMPT="$(cat .workers/base-prompt.txt)

=== INSTRUKSI KHUSUS UNTUKMU (id pekerjaan: $id) ===
$(cat "$instr")"
  echo "[$(date +%H:%M:%S)] launch $id (#$((attempts+1)), $model)"
  opencode run --model "$model" "$PROMPT" < /dev/null > ".workers/logs/$id.log" 2>&1 &
  pids+=("$!:$id:$fname")
}

while [ $SECONDS -lt $DEADLINE ]; do
  # bersihkan daftar: worker selesai & file valid → hapus dari antrean
  newpids=()
  for entry in "${pids[@]}"; do
    pid="${entry%%:*}"; rest="${entry#*:}"; id="${rest%%:*}"; fname="${rest#*:}"
    if kill -0 "$pid" 2>/dev/null; then
      newpids+=("$entry")
    else
      if [ -f "$fname" ] && valid_json "$fname"; then
        echo "[$(date +%H:%M:%S)] OK $id"
      else
        echo "[$(date +%H:%M:%S)] GAGAL $id (akan di-retry)"
        launch "$id" "$(grep "^$id;" .workers/specs-nonact.tsv | cut -d';' -f2)"
      fi
    fi
  done
  pids=("${newpids[@]}")

  # isi slot kosong dari specs
  while [ ${#pids[@]} -lt $MAXPAR ] && IFS=';' read -r id model; do
    [ -z "$id" ] && continue
    instr=".workers/instr-$id.txt"
    fname=$(grep -oE 'content/parts/[a-z0-9.-]+\.json' "$instr" | head -1)
    if [ -f "$fname" ] && valid_json "$fname"; then continue; fi
    # jangan dobel-launch id yang sudah di antrean aktif
    dup=0; for e in "${pids[@]}"; do [[ "$e" == *":$id:"* || "$e" == *":$id" ]] && dup=1; done
    [ "$dup" -eq 1 ] && continue
    launch "$id" "$model"
  done < .workers/specs-nonact.tsv

  # selesai semua?
  remaining=0
  while IFS=';' read -r id model; do
    [ -z "$id" ] && continue
    instr=".workers/instr-$id.txt"
    fname=$(grep -oE 'content/parts/[a-z0-9.-]+\.json' "$instr" | head -1)
    { [ -f "$fname" ] && valid_json "$fname"; } || remaining=$((remaining+1))
  done < .workers/specs-nonact.tsv
  if [ "$remaining" -eq 0 ] && [ ${#pids[@]} -eq 0 ]; then
    echo "[$(date +%H:%M:%S)] SEMUA KONTEN BERES"
    exit 0
  fi
  sleep 20
done
echo "TIMEOUT queue dispatcher"
exit 1
