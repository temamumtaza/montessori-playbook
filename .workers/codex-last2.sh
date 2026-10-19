#!/bin/bash
# Dua file terakhir via Codex luna
cd /home/temamumtaza/Documents/dev/montessori-playbook

codex exec -m gpt-5.6-luna --sandbox workspace-write --skip-git-repo-check "Kamu penulis konten parenting Bahasa Indonesia (app Montessori Playbook). Gaya hangat, praktis, tanpa klaim medis.

TULIS FILE content/parts/parents-2.json berisi ARRAY 22 objek ParentGuide. Topik (tulis SEMUA): jadwal harian per usia, transisi antar aktivitas, berbagi & giliran, pujian vs deskripsi, batas layar praktis, persiapan saudara baru, picky eater, rutinitas tidur, berpakaian mandiri, jalan-jalan keluar rumah, merawat diri orang tua, mengamati anak sebelum membantu, bahasa positif, konsekuensi alami, batasan yang sehat, keluarga dengan 2+ anak, mainan berantakan & merapikan, dapur sebagai kelas, toilet learning panduan singkat, tantrum di tempat umum, screen time per usia, merayakan progres kecil.

Skema persis tiap objek:
{\"id\":\"parents-<topik-kebab>\",\"title\":\"judul min 5 karakter\",\"category\":\"pilih: filosofi|komunikasi|disiplin|rutinitas|screen-time|sibling|toilet|tantrum|observasi|self-care\",\"ageBands\":[],\"body\":\"markdown ringkas MINIMAL 1200 KARAKTER, paragraf dipisah \\n\\n, boleh pakai **bold\",\"keyTakeaways\":[\"min 3 poin\"],\"references\":[{\"title\":\"HealthyChildren\",\"url\":\"https://www.healthychildren.org\"}]}

ATURAN: body parafrase sendiri, praktis (contoh nyata rumah Indonesia), tidak menggurui, tidak klaim medis. JSON valid, string satu baris (pakai \\n\\n literal untuk paragraf). File SELALU ditulis walau ada entri bermasalah — buang yang bermasalah saja.
Validasi: python3 -c \"import json;d=json.load(open('content/parts/parents-2.json'));print('OK',len(d),min(len(e['body']) for e in d))\"
Jawab terakhir: DONE parents-2" > .workers/logs/parents-2.log 2>&1
echo "parents-2: $?"

codex exec -m gpt-5.6-luna --sandbox workspace-write --skip-git-repo-check "Kamu penulis konten parenting Bahasa Indonesia (app Montessori Playbook).

TULIS FILE content/parts/checklists-1.json berisi ARRAY 8 objek Checklist. Cakup: checklist keamanan rumah per tangga bayi, kamar Montessori, tas ke luar rumah, rutinitas pagi, rutinitas malam, persiapan MPASI, persiapan toilet learning, kotak rotasi mainan.

Skema persis:
{\"id\":\"checklist-<topik-kebab>\",\"title\":\"judul\",\"kind\":\"pilih: environment|rutinitas|persiapan-aktivitas|keselamatan\",\"scope\":\"deskripsi singkat kapan dipakai\",\"items\":[{\"text\":\"butir min 5 karakter\",\"hint\":\"opsional\"}],\"references\":[{\"title\":\"NHS\",\"url\":\"https://www.nhs.uk\"}]}

ATURAN: items min 6 per checklist, praktis dan konkret. JSON valid. File SELALU ditulis.
Validasi: python3 -c \"import json;d=json.load(open('content/parts/checklists-1.json'));print('OK',len(d))\"
Jawab terakhir: DONE checklists-1" > .workers/logs/checklists-1.log 2>&1
echo "checklists-1: $?"
echo "=== DUA FILE TERAKHIR SELESAI ==="
