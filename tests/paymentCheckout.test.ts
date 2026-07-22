import { describe, expect, it } from 'vitest'
import {
  buildCheckoutReturnUrls,
  getPaymentReturnState,
  getSafeCheckoutUrl,
  withoutPaymentFlag,
} from '../utils/paymentCheckout'

describe('buildCheckoutReturnUrls', () => {
  it('uses the current origin and localized pricing path', () => {
    expect(buildCheckoutReturnUrls('https://gptpix.ai', '/zh/pricing')).toEqual({
      checkoutSuccessUrl: 'https://gptpix.ai/zh/pricing?flag=true',
      checkoutCancelUrl: 'https://gptpix.ai/zh/pricing?flag=false',
    })
  })

  it('drops existing query parameters and hashes', () => {
    expect(buildCheckoutReturnUrls('http://localhost:3000', '/pricing?tab=monthly#plans')).toEqual({
      checkoutSuccessUrl: 'http://localhost:3000/pricing?flag=true',
      checkoutCancelUrl: 'http://localhost:3000/pricing?flag=false',
    })
  })
})

describe('getSafeCheckoutUrl', () => {
  it('accepts only absolute HTTP and HTTPS URLs', () => {
    expect(getSafeCheckoutUrl('https://checkout.stripe.com/c/pay/test')).toBe('https://checkout.stripe.com/c/pay/test')
    expect(getSafeCheckoutUrl('http://localhost:4242/checkout')).toBe('http://localhost:4242/checkout')
    expect(getSafeCheckoutUrl('javascript:alert(1)')).toBeNull()
    expect(getSafeCheckoutUrl('/relative-checkout')).toBeNull()
    expect(getSafeCheckoutUrl('')).toBeNull()
  })
})

describe('payment return query helpers', () => {
  it('maps only true and false flag values', () => {
    expect(getPaymentReturnState('true')).toBe('success')
    expect(getPaymentReturnState('false')).toBe('cancelled')
    expect(getPaymentReturnState('other')).toBeNull()
    expect(getPaymentReturnState(undefined)).toBeNull()
  })

  it('removes only flag and preserves unrelated query values', () => {
    expect(withoutPaymentFlag({ flag: 'true', campaign: 'summer', ref: ['a', 'b'] })).toEqual({
      campaign: 'summer',
      ref: ['a', 'b'],
    })
  })
})
