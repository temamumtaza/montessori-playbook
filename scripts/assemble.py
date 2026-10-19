#!/usr/bin/env python3
"""Rakit content/parts/*.json → content/global.json + content/bundles/<band>.json, lalu validasi."""
import json, glob, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, 'content', 'parts')

def load_all(pattern):
    out = []
    for f in sorted(glob.glob(os.path.join(P, pattern))):
        d = json.load(open(f))
        out.extend(d)
    return out

def dedupe(items, key='id'):
    seen, out = set(), []
    for it in items:
        k = it.get(key) or it.get('term')
        if k in seen: continue
        seen.add(k)
        out.append(it)
    return out

activities = load_all('act-*.json')
milestones = load_all('mile-*.json')
materials = dedupe(load_all('materials-*.json'))
diy = dedupe(load_all('diy-*.json'))
rooms = dedupe(load_all('rooms-*.json'))
parents = dedupe(load_all('parents-*.json'))
glossary = dedupe(load_all('glossary-*.json'), key='term')
checklists = dedupe(load_all('checklists-*.json'))

# normalisasi ringan
def norm_activity(a):
    a.setdefault('safetyNotes', [])
    a.setdefault('variations', [])
    a.setdefault('struggleSigns', [])
    a.setdefault('skills', [])
    a.setdefault('materialIds', [])
    if 'controlOfError' in a and not a['controlOfError']:
        a.pop('controlOfError')
    return a

activities = [norm_activity(a) for a in activities]

BANDS = ['0-3m','3-6m','6-9m','9-12m','12-18m','18-24m','2-3y','3-4y','4-5y']
os.makedirs(os.path.join(ROOT, 'content', 'bundles'), exist_ok=True)
for b in BANDS:
    acts = [a for a in activities if b in a.get('ageBands', [])]
    mil = [m for m in milestones if m.get('ageBand') == b]
    json.dump({'ageBand': b, 'activities': acts, 'milestones': mil},
              open(os.path.join(ROOT, 'content', 'bundles', f'{b}.json'), 'w'), ensure_ascii=False, indent=1)

globalj = {
    'skills': [],
    'materials': materials,
    'diyGuides': diy,
    'roomSetups': rooms,
    'parentGuides': parents,
    'glossary': glossary,
    'checklists': checklists,
}
# ageBands & areas disediakan oleh src/content/meta.ts (di-merge saat load di store)
json.dump(globalj, open(os.path.join(ROOT, 'content', 'global.json'), 'w'), ensure_ascii=False, indent=1)

print(f"Activity:    {len(activities)}")
print(f"Milestone:   {len(milestones)}")
print(f"Material:    {len(materials)}")
print(f"DIYGuide:    {len(diy)}")
print(f"RoomSetup:   {len(rooms)}")
print(f"ParentGuide: {len(parents)}")
print(f"Glossary:    {len(glossary)}")
print(f"Checklist:   {len(checklists)}")
for b in BANDS:
    d = json.load(open(os.path.join(ROOT, 'content', 'bundles', f'{b}.json')))
    print(f"  bundle {b}: {len(d['activities'])} aktivitas, {len(d['milestones'])} milestone")
