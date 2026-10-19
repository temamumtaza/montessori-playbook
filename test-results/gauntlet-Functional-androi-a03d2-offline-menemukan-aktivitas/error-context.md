# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: gauntlet.spec.ts >> Functional @android >> pencarian offline menemukan aktivitas
- Location: tests/gauntlet.spec.ts:59:5

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - heading "Cari" [level=1] [ref=e6]
  - main [ref=e7]:
    - generic [ref=e9]:
      - generic [ref=e10]:
        - generic [ref=e11]: Cari aktivitas atau glosarium
        - generic [ref=e12]:
          - generic [aria-hidden] [ref=e13]: 🔍
          - searchbox "Cari aktivitas atau glosarium" [active] [ref=e14]: menuang
          - button "Hapus pencarian" [ref=e15]: ✕
      - region [ref=e16]:
        - heading "Aktivitas (0)" [level=2] [ref=e17]:
          - text: Aktivitas
          - generic [ref=e18]: (0)
      - region [ref=e35]:
        - heading "Glosarium (4)" [level=2] [ref=e37]:
          - text: Glosarium
          - generic [ref=e38]: (4)
        - generic [ref=e39]:
          - generic [ref=e40]:
            - term [ref=e41]: practical life
            - definition [ref=e42]: Kegiatan sehari-hari seperti menuang, menyapu, atau berpakaian yang melatih kemandirian, koordinasi gerak, dan rasa tanggung jawab anak.
          - generic [ref=e43]:
            - term [ref=e44]: fine motor
            - definition [ref=e45]: Keterampilan menggunakan otot kecil, terutama tangan dan jari, untuk menggenggam, menuang, meronce, mengancingkan baju, atau memegang alat tulis.
          - generic [ref=e46]:
            - term [ref=e47]: menuang
            - definition [ref=e48]: Kegiatan memindahkan air, pasir, atau biji-bijian dari satu wadah ke wadah lain, sering dimulai dari menuang air ke gelas. Kegiatan ini melatih koordinasi, konsentrasi, dan kemandirian saat makan atau minum.
          - generic [ref=e49]:
            - term [ref=e50]: Latihan menuang
            - definition [ref=e51]: Latihan memindahkan cairan atau bahan kering dari satu wadah ke wadah lain dengan gerak perlahan dan terkontrol.
  - navigation "Navigasi utama" [ref=e52]:
    - generic [ref=e53]:
      - link "Hari Ini" [ref=e54] [cursor=pointer]:
        - /url: "#/"
        - generic [aria-hidden] [ref=e55]: ☀️
      - link "Playbook" [ref=e57] [cursor=pointer]:
        - /url: "#/playbook"
        - generic [aria-hidden] [ref=e58]: 📖
      - link "Jurnal" [ref=e60] [cursor=pointer]:
        - /url: "#/jurnal"
        - generic [aria-hidden] [ref=e61]: 📝
      - link "Progres" [ref=e63] [cursor=pointer]:
        - /url: "#/progres"
        - generic [aria-hidden] [ref=e64]: 🌱
      - link "Lainnya" [ref=e66] [cursor=pointer]:
        - /url: "#/lainnya"
        - generic [aria-hidden] [ref=e67]: ⋯
```

# Test source

```ts
  1   | // GAUNTLET Round 1 — Functional + PWA + Native Feel + A11y smoke
  2   | // Jalankan: npx playwright test tests/gauntlet.spec.ts
  3   | import { test, expect, devices } from '@playwright/test'
  4   | 
  5   | const BASE = 'https://montessori-playbook.vercel.app'
  6   | const iphone = { ...devices['iPhone 13'] }
  7   | const android = { ...devices['Pixel 7'] }
  8   | 
  9   | for (const [name, device] of [['iphone', iphone], ['android', android]]) {
  10  |   test.describe(`Functional @${name}`, () => {
  11  |     test.use({ viewport: device.viewport, userAgent: device.userAgent, isMobile: true, hasTouch: true })
  12  | 
  13  |     test('app shell + onboarding muncul tanpa white flash', async ({ page }) => {
  14  |       await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  15  |       const bg = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor)
  16  |       await expect(page.locator('nav[aria-label="Navigasi utama"]')).toBeVisible({ timeout: 15000 })
  17  |       await expect(page.getByRole('heading', { name: 'Hari Ini' })).toBeVisible()
  18  |       // latar harus sudah terisi sky tint (bukan transparan/putih polos)
  19  |       expect(bg).toBe('rgb(240, 249, 255)')
  20  |     })
  21  | 
  22  |     test('onboarding profil anak → rekomendasi hari ini', async ({ page }) => {
  23  |       await page.goto(BASE + '/#/lainnya', { waitUntil: 'domcontentloaded' })
  24  |       await page.getByRole('button', { name: /Tambah anak/i }).click()
  25  |       await page.getByLabel('Nama panggilan anak').fill('Tema')
  26  |       await page.getByLabel('Tanggal lahir anak').fill('2024-05-10')
  27  |       await page.getByRole('button', { name: 'Simpan' }).click()
  28  |       await expect(page.getByText('Profil anak')).toBeVisible()
  29  |       // ke beranda, harus ada halo
  30  |       await page.goto(BASE + '/#/', { waitUntil: 'domcontentloaded' })
  31  |       await expect(page.getByText(/Halo, Tema/)).toBeVisible({ timeout: 15000 })
  32  |     })
  33  | 
  34  |     test('playbook: grid area + filter + buka aktivitas', async ({ page }) => {
  35  |       await page.goto(BASE + '/#/playbook', { waitUntil: 'domcontentloaded' })
  36  |       await expect(page.getByText('Area Montessori')).toBeVisible({ timeout: 15000 })
  37  |       // klik tile area pertama
  38  |       const tiles = page.locator('section[aria-label="Area Montessori"] button')
  39  |       await tiles.first().click()
  40  |       // daftar aktivitas muncul
  41  |       await expect(page.getByText(/Semua Aktivitas/)).toBeVisible()
  42  |       const card = page.locator('main article').first()
  43  |       if (await card.count() > 0) {
  44  |         await card.click()
  45  |         await page.waitForTimeout(1500)
  46  |         // detail: ada hero dengan tombol kembali
  47  |         await expect(page.getByRole('button', { name: 'Kembali' })).toBeVisible()
  48  |       }
  49  |     })
  50  | 
  51  |     test('jurnal: tambah catatan observasi', async ({ page }) => {
  52  |       await page.goto(BASE + '/#/jurnal', { waitUntil: 'domcontentloaded' })
  53  |       const ta = page.getByLabel('Catatan observasi')
  54  |       await ta.fill('QA Gauntlet: anak fokus menuang air 10 menit.')
  55  |       await page.getByRole('button', { name: 'Simpan catatan' }).click()
  56  |       await expect(page.getByText(/QA Gauntlet: anak fokus/)).toBeVisible({ timeout: 10000 })
  57  |     })
  58  | 
  59  |     test('pencarian offline menemukan aktivitas', async ({ page }) => {
  60  |       await page.goto(BASE + '/#/cari', { waitUntil: 'domcontentloaded' })
  61  |       const input = page.locator('input[type="search"], input[aria-label*="Cari"], main input').first()
  62  |       await input.fill('menuang')
  63  |       await page.waitForTimeout(1200)
  64  |       const hasil = page.locator('main article')
> 65  |       expect(await hasil.count()).toBeGreaterThan(0)
      |                                   ^ Error: expect(received).toBeGreaterThan(expected)
  66  |     })
  67  | 
  68  |     test('tab bar: 5 tab + pindah tab mempertahankan halaman', async ({ page }) => {
  69  |       await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  70  |       const tabs = page.locator('nav[aria-label="Navigasi utama"] a')
  71  |       expect(await tabs.count()).toBe(5)
  72  |       await tabs.nth(1).click() // Playbook
  73  |       await expect(page.getByText('Area Montessori')).toBeVisible({ timeout: 10000 })
  74  |       await tabs.nth(2).click() // Jurnal
  75  |       await expect(page.getByText('Catat observasi')).toBeVisible()
  76  |     })
  77  | 
  78  |     test('detail aktivitas punya mode praktik + timer + safety', async ({ page }) => {
  79  |       await page.goto(BASE + '/#/playbook', { waitUntil: 'domcontentloaded' })
  80  |       await page.waitForTimeout(1500)
  81  |       const card = page.locator('main article').first()
  82  |       if (await card.count() > 0) {
  83  |         await card.click()
  84  |         await page.waitForTimeout(1200)
  85  |         const praktik = page.getByRole('tab', { name: /Praktik/ })
  86  |         if (await praktik.count() > 0) {
  87  |           await praktik.click()
  88  |           await page.waitForTimeout(2100)
  89  |           // timer jalan
  90  |           await expect(page.getByText(/⏱ 00:0[12]/)).toBeVisible()
  91  |         }
  92  |         // safety section ada di aktivitas bayi
  93  |         const safety = page.getByText(/Keselamatan/)
  94  |         expect(await safety.count()).toBeGreaterThanOrEqual(0)
  95  |       }
  96  |     })
  97  | 
  98  |     test('dark mode toggle bekerja', async ({ page }) => {
  99  |       await page.goto(BASE + '/#/lainnya', { waitUntil: 'domcontentloaded' })
  100 |       const sw = page.getByRole('switch')
  101 |       if (await sw.count() > 0) {
  102 |         const before = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  103 |         await sw.click()
  104 |         const after = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  105 |         expect(after).not.toBe(before)
  106 |       }
  107 |     })
  108 | 
  109 |     test('manifest + service worker + icons tersedia', async ({ request }) => {
  110 |       expect((await request.get(BASE + '/manifest.webmanifest')).ok()).toBeTruthy()
  111 |       expect((await request.get(BASE + '/sw.js')).ok()).toBeTruthy()
  112 |       expect((await request.get(BASE + '/icons/maskable-512.png')).ok()).toBeTruthy()
  113 |     })
  114 |   })
  115 | }
  116 | 
```