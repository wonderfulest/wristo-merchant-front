import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { buildCompletedDayRange } from '../src/components/dashboard/funnelRange.mjs'

test('merchant funnel uses completed natural days and displays a half-open interval', async () => {
  const source = await readFile(
    new URL('../src/components/dashboard/FunnelAnalytics.vue', import.meta.url),
    'utf8',
  )
  const salesSource = await readFile(
    new URL('../src/components/dashboard/SalesLineChart.vue', import.meta.url),
    'utf8',
  )

  assert.match(source, /buildCompletedDayRange/)
  assert.match(source, /buildCompletedDayRange\(rangeDays\[rangeType\.value\]\)/)
  assert.match(source, /dashboard\.period'\) \}\}\{\{ displayPeriod/)
  assert.doesNotMatch(source, /funnel\?\.periodKey \|\| displayPeriod/)
  assert.match(salesSource, /<template #header>/)
  assert.match(salesSource, /dashboard\.period'\) \}\}\{\{ displayPeriod/)
})

test('completed natural-day ranges are shown as half-open intervals', () => {
  const now = new Date(2026, 6, 17, 18, 0, 0)
  assert.deepEqual(buildCompletedDayRange(1, now), {
    startDate: '2026-07-16',
    endDate: '2026-07-16',
    displayPeriod: '[2026-07-16 00:00, 2026-07-17 00:00)',
  })
  assert.deepEqual(buildCompletedDayRange(7, now), {
    startDate: '2026-07-10',
    endDate: '2026-07-16',
    displayPeriod: '[2026-07-10 00:00, 2026-07-17 00:00)',
  })
})
