#!/bin/bash
# Dispatcher fleet worker konten Montessori Playbook (opencode free models)
cd /home/temamumtaza/Documents/dev/montessori-playbook
mkdir -p .workers/logs content/parts

launched=0
while IFS=';' read -r id model; do
  [ -z "$id" ] && continue
  [ -f ".workers/logs/$id.log" ] && grep -q "DONE" ".workers/logs/$id.log" 2>/dev/null && { echo "skip $id (sudah DONE)"; continue; }
  PROMPT="$(cat .workers/base-prompt.txt)

=== INSTRUKSI KHUSUS UNTUKMU (id pekerjaan: $id) ===
$(cat .workers/instr-$id.txt)"
  nohup opencode run --model "$model" "$PROMPT" > ".workers/logs/$id.log" 2>&1 &
  echo "launched $id ($model) pid=$!"
  launched=$((launched+1))
  sleep 1
done < .workers/specs.tsv
echo "TOTAL LAUNCHED: $launched"
