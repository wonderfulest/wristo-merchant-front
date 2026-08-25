import test from 'node:test'
import assert from 'node:assert/strict'
import { formatOrderOrigin, paymentDisplayKey } from '../src/views/account/purchaseDisplay.mjs'

test('legacy gift order origin is displayed without the gift prefix', () => {
  assert.equal(formatOrderOrigin('gift:taobao'), 'taobao')
  assert.equal(formatOrderOrigin('taobao'), 'taobao')
  assert.equal(formatOrderOrigin(''), '')
})

test('legacy gift payment method is displayed as other', () => {
  assert.equal(paymentDisplayKey('gift'), 'other')
  assert.equal(paymentDisplayKey('alipay'), 'alipay')
  assert.equal(paymentDisplayKey('wechat'), 'wechat')
})
