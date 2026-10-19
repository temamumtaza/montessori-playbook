import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: 1,
  reporter: [['list']],
  use: { baseURL: 'https://montessori-playbook.vercel.app', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
})
