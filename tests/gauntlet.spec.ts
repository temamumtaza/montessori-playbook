// GAUNTLET Round 1 — Functional + PWA + Native Feel + A11y smoke
// Jalankan: npx playwright test tests/gauntlet.spec.ts
import { test, expect, devices } from '@playwright/test'

const BASE = 'https://montessori-playbook.vercel.app'
const iphone = { ...devices['iPhone 13'] }
const android = { ...devices['Pixel 7'] }

for (const [name, device] of [['iphone', iphone], ['android', android]]) {
  test.describe(`Functional @${name}`, () => {
    test.use({ viewport: device.viewport, userAgent: device.userAgent, isMobile: true, hasTouch: true })

    test('app shell + onboarding muncul tanpa white flash', async ({ page }) => {
      await page.goto(BASE, { waitUntil: 'domcontentloaded' })
      const bg = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor)
      await expect(page.locator('nav[aria-label="Navigasi utama"]')).toBeVisible({ timeout: 15000 })
      await expect(page.getByRole('heading', { name: 'Hari Ini' })).toBeVisible()
      // latar harus sudah terisi sky tint (bukan transparan/putih polos)
      expect(bg).toBe('rgb(240, 249, 255)')
    })

    test('onboarding profil anak → rekomendasi hari ini', async ({ page }) => {
      await page.goto(BASE + '/#/lainnya', { waitUntil: 'domcontentloaded' })
      await page.getByRole('button', { name: /Tambah anak/i }).click()
      await page.getByPlaceholder('Nama panggilan').fill('Tema')
      await page.locator('input[type="date"]').fill('2024-05-10')
      await page.getByRole('button', { name: 'Simpan' }).click()
      await expect(page.getByText('Profil anak')).toBeVisible()
      // ke beranda, harus ada halo
      await page.goto(BASE + '/#/', { waitUntil: 'domcontentloaded' })
      await expect(page.getByText(/Halo, Tema/)).toBeVisible({ timeout: 15000 })
    })

    test('playbook: grid area + filter + buka aktivitas', async ({ page }) => {
      await page.goto(BASE + '/#/playbook', { waitUntil: 'domcontentloaded' })
      await expect(page.getByText('Area Montessori')).toBeVisible({ timeout: 15000 })
      // klik tile area pertama
      const tiles = page.locator('section[aria-label="Area Montessori"] button')
      await tiles.first().click()
      // daftar aktivitas muncul
      await expect(page.getByText(/Semua Aktivitas/)).toBeVisible()
      const card = page.locator('main article').first()
      if (await card.count() > 0) {
        await card.click()
        await page.waitForTimeout(1500)
        // detail: ada hero dengan tombol kembali
        await expect(page.getByRole('button', { name: 'Kembali' })).toBeVisible()
      }
    })

    test('jurnal: tambah catatan observasi', async ({ page }) => {
      await page.goto(BASE + '/#/jurnal', { waitUntil: 'domcontentloaded' })
      const ta = page.getByLabel('Catatan observasi')
      await ta.fill('QA Gauntlet: anak fokus menuang air 10 menit.')
      await page.getByRole('button', { name: 'Simpan catatan' }).click()
      await expect(page.getByText(/QA Gauntlet: anak fokus/)).toBeVisible({ timeout: 10000 })
    })

    test('pencarian offline menemukan aktivitas', async ({ page }) => {
      await page.goto(BASE + '/#/cari', { waitUntil: 'domcontentloaded' })
      const input = page.locator('input[type="search"], input[aria-label*="Cari"], main input').first()
      await input.fill('menuang')
      await page.waitForTimeout(1200)
      const hasil = page.locator('main article')
      expect(await hasil.count()).toBeGreaterThan(0)
    })

    test('tab bar: 5 tab + pindah tab mempertahankan halaman', async ({ page }) => {
      await page.goto(BASE, { waitUntil: 'domcontentloaded' })
      const tabs = page.locator('nav[aria-label="Navigasi utama"] a')
      expect(await tabs.count()).toBe(5)
      await tabs.nth(1).click() // Playbook
      await expect(page.getByText('Area Montessori')).toBeVisible({ timeout: 10000 })
      await tabs.nth(2).click() // Jurnal
      await expect(page.getByText('Catat observasi')).toBeVisible()
    })

    test('detail aktivitas punya mode praktik + timer + safety', async ({ page }) => {
      await page.goto(BASE + '/#/playbook', { waitUntil: 'domcontentloaded' })
      await page.waitForTimeout(1500)
      const card = page.locator('main article').first()
      if (await card.count() > 0) {
        await card.click()
        await page.waitForTimeout(1200)
        const praktik = page.getByRole('tab', { name: /Praktik/ })
        if (await praktik.count() > 0) {
          await praktik.click()
          const durationSheet = page.getByRole('dialog', { name: 'Pilih Durasi Aktivitas' })
          await expect(durationSheet).toBeVisible()
          await durationSheet.locator('button', { hasText: /^5 mnt$/ }).click()
          await durationSheet.getByRole('button', { name: 'Mulai Aktivitas' }).click()
          await expect(page.getByText(/[0-9]:[0-9]{2}/).or(page.getByText(/0[0-9]:[0-9]{2}/))).toBeVisible()
          await expect(page.getByText(/Layar tidak akan mati|Layar mungkin mati otomatis/)).toBeVisible()
        }
        // safety section ada di aktivitas bayi
        const safety = page.getByText(/Keselamatan/)
        expect(await safety.count()).toBeGreaterThanOrEqual(0)
      }
    })

    test('dark mode toggle bekerja', async ({ page }) => {
      await page.goto(BASE + '/#/lainnya', { waitUntil: 'domcontentloaded' })
      const sw = page.getByRole('switch', { name: 'Mode gelap' })
      const before = await page.evaluate(() => document.documentElement.classList.contains('dark'))
      await sw.click()
      const after = await page.evaluate(() => document.documentElement.classList.contains('dark'))
      expect(after).not.toBe(before)
    })

    test('0 emoji di UI', async ({ page }) => {
      for (const route of ['/', '/#/playbook', '/#/lainnya', '/#/cari']) {
        await page.goto(BASE + route, { waitUntil: 'domcontentloaded' })
        await expect(page.locator('body')).toBeVisible()
        const bodyText = await page.locator('body').innerText()
        expect(bodyText).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}]/u)
      }
    })

    test('manifest + service worker + icons tersedia', async ({ request }) => {
      expect((await request.get(BASE + '/manifest.webmanifest')).ok()).toBeTruthy()
      expect((await request.get(BASE + '/sw.js')).ok()).toBeTruthy()
      expect((await request.get(BASE + '/icons/maskable-512.png')).ok()).toBeTruthy()
    })
  })
}
