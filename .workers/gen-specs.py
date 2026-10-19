#!/usr/bin/env python3
"""Generate .workers/instr-<id>.txt + .workers/specs.tsv untuk fleet konten."""
import os

W = os.path.dirname(os.path.abspath(__file__))

GLM = "opencode/glm-5.3-flash-free"
DS = "opencode/deepseek-v4.1-flash-free"

# ===== AgeBand bundles: aktivitas per band =====
BANDS = [
    ("0-3m", 30), ("3-6m", 30), ("6-9m", 30), ("9-12m", 30),
    ("12-18m", 32), ("18-24m", 32), ("2-3y", 34), ("3-4y", 34), ("4-5y", 34),
]

specs = []
n = 0
for band, count in BANDS:
    n += 1
    wid = f"act-{band}"
    fname = f"content/parts/act-{band}.json"
    instr = f"""Tulis file {fname} berisi ARRAY tepat {count} objek Activity Montessori untuk usia {band}.

Skema WAJIB tiap objek (field name persis):
{{
  "id": "kebab-case-unik-dimulai-{band.replace('-', '')}",
  "title": "nama aktivitas bahasa Indonesia (min 5 karakter)",
  "summary": "ringkasan 1-2 kalimat (min 30 karakter)",
  "ageBands": ["{band}"],
  "areas": ["pilih 1-3 dari: practical-life, sensorial, language, math, culture, movement, grace-courtesy, self-care, art-music, outdoor"],
  "skills": ["kata kunci skill"],
  "objectives": ["1-3 tujuan"],
  "materials": [{{"name":"bahan","fromHome":true,"optional":false}}],
  "prepMinutes": angka 0-30,
  "durationMinutes": angka 3-60,
  "prepLevel": "rendah|sedang|tinggi",
  "presentation": [{{"step":1,"text":"langkah minimal 15 karakter"}}, {{"step":2,"text":"..."}}],
  "controlOfError": "cara anak tahu salah/benar sendiri (opsional tapi disarankan)",
  "variations": ["variasi"],
  "readySigns": ["tanda anak siap (min 1)"],
  "struggleSigns": ["tanda kesulitan"],
  "safetyNotes": ["WAJIB minimal 1 untuk usia 0-3y: supervisi, ukuran benda, tali, posisi, alergi, dll"],
  "references": [{{"title":"CDC Milestones {band}","url":"https://www.cdc.gov/ncbddd/actearly/milestones/index.html"}}]
}}

VARIASI KONTEN: campur area berbeda (movement, language, practical-life, sensorial, self-care, art-music, outdoor sesuai usia), durasi & prepLevel bervariasi, JANGN ada dua aktivitas dengan judul mirip. Sesuai tahap perkembangan usia {band} (motorik, bahasa, kognitif, sosial yang realistis).
Setelah menulis file, validasi: python3 -c "import json;d=json.load(open('{fname}'));assert len(d)=={count};print('OK',len(d))"
Jawab: DONE act-{band}
"""
    with open(f"{W}/instr-{wid}.txt", "w") as f:
        f.write(instr)
    specs.append((wid, GLM if n % 2 else DS))

# ===== Milestones per band =====
for band, count in BANDS:
    n += 1
    wid = f"mile-{band}"
    fname = f"content/parts/mile-{band}.json"
    instr = f"""Tulis file {fname} berisi ARRAY 9-11 objek Milestone perkembangan untuk usia {band} (dasarkan pola umum CDC/WHO, parafrase Indonesia).

Skema persis:
{{
  "id": "mile-{band.replace('-', '')}-<topik-kebab>",
  "title": "judul singkat (min 5 karakter)",
  "ageBand": "{band}",
  "domain": "motorik-kasar|motorik-halus|bahasa|kognitif|sosial-emosional|self-help",
  "description": "penjelasan 1 kalimat (min 30 karakter)",
  "typicalFromMonths": angka,
  "typicalToMonths": angka,
  "redFlags": ["tanda perlu konsultasi dokter (boleh kosong)"],
  "references": [{{"title":"CDC Milestones","url":"https://www.cdc.gov/ncbddd/actearly/milestones/index.html"}}]
}}
Campur domain beragam. Rentang bulan wajar untuk band {band}.
Validasi: python3 -c "import json;d=json.load(open('{fname}'));print('OK',len(d))"
Jawab: DONE mile-{band}
"""
    with open(f"{W}/instr-{wid}.txt", "w") as f:
        f.write(instr)
    specs.append((wid, GLM if n % 2 else DS))

# ===== Global parts =====
GLOBAL_PARTS = [
    ("glossary-2", DS, "40 objek glossary lanjutan (JANGAN duplikat istilah: absorbent mind, sensitive period, prepared environment, practical life, sensorial, control of error, normalization, pincer grasp, object permanence — itu sudah ada). Isi: istilah aktivitas sehari-hari, istilah pendidikan, istilah perkembangan, istilah mainan/bahan Montessori.", None),
    ("materials-1", GLM, "32 objek Material Montessori (skema: id kebab-case, name, purpose min 30 karakter, ageBands array dari enum 0-3m..4-5y, budget rendah|sedang|tinggi, buyHint opsional, diy boolean, safetyNotes array, references array minimal 1). Cakup: mobil (Munari dll generik), grasping toys, stacking, inset, threading, tray praktis, dsb.", "materials"),
    ("materials-2", DS, "32 objek Material lain (JANGAN duplikat mobil Munari/interlocking discs/pink tower — buat variasi lain: object permanence box, imbangan, kancing dressing frame generik, dsb). Skema sama seperti Material.", "materials"),
    ("diy-1", GLM, "30 objek DIYGuide (skema: id, title min 5, makes, timeMinutes 5-240, cost gratis|rendah|sedang, materialsNeeded array string min 1, steps array string min 3, ageBands array, safetyNotes array, references min 1). Contoh: sensory bottles, treasure basket, posting box dari kardus, playdough rumahan, mobile DIY, drum dari kaleng aman, dsb.", "diy"),
    ("diy-2", DS, "30 objek DIYGuide lain (variasi beda: kamishibai kardus, gevoelsmuur/texture board, rak mini kardus, apron anak dari kaos lama, counting jar, dll). Skema sama.", "diy"),
    ("rooms-1", GLM, "6 objek RoomSetup (skema: id, room enum kamar-anak|kamar-mandi|dapur|ruang-keluarga|area-makan|outdoor, title, principles array min 3, items array min 5 objek {name, essential bool, budgetRendah string, budgetSedang string opsional, diy bool}, layoutTips array min 2, ageBands array, references min 1). SATU objek per nilai room enum.", "rooms"),
    ("parents-1", DS, "22 objek ParentGuide (skema: id, title min 5, category enum filosofi|komunikasi|disiplin|rutinitas|screen-time|sibling|toilet|tantrum|observasi|self-care, ageBands array boleh kosong, body STRING markdown panjang minimal 1200 karakter per panduan — paragraf dengan \\n\\n, keyTakeaways array min 3, references min 1). Cakup semua category.", "parents"),
    ("parents-2", GLM, "22 objek ParentGuide lain (topik beda dari partner-mu: jadwal harian per usia, transisi aktivitas, berbagi/sharing, pujian vs deskripsi, batas layar praktis, persiapan saudara baru, makan picky eater, tidur, berpakaian mandiri, out & about). body min 1200 karakter markdown.", "parents"),
    ("checklists-1", DS, "8 objek Checklist (skema: id, title, kind enum environment|rutinitas|persiapan-aktivitas|keselamatan, scope string, items array min 6 objek {text, hint opsional}, references min 1). Cakup: safety-proof rumah per usia, checklist kamar montessori, tas ke luar rumah, rutinitas pagi/malam, persiapan MPASI, persiapan toilet learning, kotak rotasi mainan.", "checklists"),
]

for wid, model, what, _tag in GLOBAL_PARTS:
    n += 1
    fname = f"content/parts/{wid}.json"
    instr = f"""Tulis file {fname} berisi ARRAY. Isi: {what}
Enum ageBands valid: 0-3m, 3-6m, 6-9m, 9-12m, 12-18m, 18-24m, 2-3y, 3-4y, 4-5y.
Validasi: python3 -c "import json;d=json.load(open('{fname}'));print('OK',len(d))"
Jawab: DONE {wid}
"""
    with open(f"{W}/instr-{wid}.txt", "w") as f:
        f.write(instr)
    specs.append((wid, model))

with open(f"{W}/specs.tsv", "w") as f:
    for wid, model in specs:
        f.write(f"{wid};{model}\n")

print(f"Generated {len(specs)} worker specs")
for wid, m in specs:
    print(f"  {wid:16s} {m}")
