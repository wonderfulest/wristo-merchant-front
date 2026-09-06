import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import * as ssoRedirect from './ssoRedirect'

describe('buildSsoPasswordUrl', () => {
  const originalWindow = globalThis.window

  beforeEach(() => {
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: {
        location: {
          origin: 'https://merchant.wristo.io',
          hostname: 'merchant.wristo.io',
        },
      },
    })
  })

  afterEach(() => {
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: originalWindow,
    })
  })

  it('builds the SSO password-change URL with the current session context', () => {
    const buildSsoPasswordUrl = (ssoRedirect as Record<string, unknown>).buildSsoPasswordUrl

    expect(buildSsoPasswordUrl).toBeTypeOf('function')
    if (typeof buildSsoPasswordUrl !== 'function') return

    const url = new URL(buildSsoPasswordUrl({
      token: 'merchant-session-token',
      email: 'merchant@example.com',
      redirectUri: 'https://merchant.wristo.io/account/profile',
    }))

    expect(url.pathname).toBe('/set-password')
    expect(url.searchParams.get('token')).toBe('merchant-session-token')
    expect(url.searchParams.get('email')).toBe('merchant@example.com')
    expect(url.searchParams.get('redirect_uri')).toBe('https://merchant.wristo.io/account/profile')
    expect(url.searchParams.get('mode')).toBe('change')
  })
})
