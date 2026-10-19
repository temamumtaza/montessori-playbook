#!/bin/bash
# Codex luna fleet: 9 aktivitas AgeBand, 4 paralel
cd /home/temamumtaza/Documents/dev/montessori-playbook
mkdir -p .workers/logs content/parts
MAXPAR=4

run_one() {
  local band="$1"
  local count="$2"
  local fname="content/parts/act-$band.json"
  [ -f "$fname" ] && python3 -c "import json;json.load(open('$fname'))" 2>/dev/null && { echo "[act-$band] sudah ada, skip"; return 0; }
  local PROMPT="Kamu penulis konten edukasi parenting Bahasa Indonesia untuk app Montessori Playbook (pembaca: orang tua awam, anak 0-5 th). Gaya hangat, praktis, tanpa jargon, tanpa klaim medis.

TULIS FILE $fname (relatif dari cwd) berisi ARRAY $count objek Activity Montessori untuk usia $band.

Skema WAJIB tiap objek (nama field persis):
{\"id\":\"$band-<topik-kebab-case>\",\"title\":\"nama aktivitas Indonesia min 5 karakter\",\"summary\":\"ringkasan min 30 karakter\",\"ageBands\":[\"$band\"],\"areas\":[\"pilih 1-3 dari: practical-life,sensorial,language,math,culture,movement,grace-courtesy,self-care,art-music,outdoor\"],\"skills\":[\"kata kunci\"],\"objectives\":[\"1-3 tujuan\"],\"materials\":[{\"name\":\"bahan\",\"fromHome\":true,\"optional\":false}],\"prepMinutes\":0-30,\"durationMinutes\":3-60,\"prepLevel\":\"rendah|sedang|tinggi\",\"presentation\":[{\"step\":1,\"text\":\"langkah min 15 karakter\"},{\"step\":2,\"text\":\"...\"}],\"controlOfError\":\"opsional\",\"variations\":[\"variasi\"],\"readySigns\":[\"min 1\"],\"struggleSigns\":[\"\"],\"safetyNotes\":[\"WAJIB min 1 untuk usia 0-3y\"],\"references\":[{\"title\":\"CDC Milestones\",\"url\":\"https://www.cdc.gov/ncbddd/actearly/milestones/index.html\"}]}

ATURAN: (1) variasikan area, durasi, prepLevel — jangan ada judul mirip; (2) sesuai tahap perkembangan nyata usia $band; (3) semua JSON valid, string satu baris (pakai spasi, bukan newline mentah); (4) bila ada entri bermasalah, BUANG entri itu dan tulis sisanya — file SELALU harus ditulis; (5) rujukan wajar: CDC, healthychildren.org, nhs.uk, who.int.

SETELAH menulis file, validasi: python3 -c \"import json;d=json.load(open('$fname'));print('OK',len(d))\"
Jawab terakhir persis: DONE act-$band"

  echo "[$(date +%H:%M:%S)] launch act-$band (codex luna)"
  codex exec -m gpt-5.6-luna --sandbox workspace-write --skip-git-repo-check "$PROMPT" > ".workers/logs/act-$band.log" 2>&1
  if [ -f "$fname" ] && python3 -c "import json;json.load(open('$fname'))" 2>/dev/null; then
    echo "[$(date +%H:%M:%S)] OK act-$band"
  else
    echo "[$(date +%H:%M:%S)] GAGAL act-$band"
  fi
}
export -f run_one

BANDS="0-3m:30 3-6m:30 6-9m:30 9-12m:30 12-18m:32 18-24m:32 2-3y:34 3-4y:34 4-5y:34"
running=0
for spec in $BANDS; do
  band="${spec%%:*}"; count="${spec#*:}"
  run_one "$band" "$count" &
  running=$((running+1))
  if [ "$running" -ge $MAXPAR ]; then wait -n; running=$((running-1)); fi
done
wait
echo "=== SEMUA ACTIVITY WORKERS SELESAI ==="
for f in content/parts/act-*.json; do python3 -c "import json;d=json.load(open('$f'));print('$f', len(d))" 2>/dev/null || echo "$f INVALID"; done
