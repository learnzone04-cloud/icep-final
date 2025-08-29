import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-05-28.basil',
    });
  }

  async createPaymentIntent(amount: number, currency: string) {
    const amountMinor = this.toMinorUnits(amount, currency);
    const min = this.getMinimumMinorUnits(currency);
    if (amountMinor < min) {
      throw new BadRequestException(`Amount too low for ${currency}. Minimum is ${min} in minor units.`);
    }
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountMinor,
      currency,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  async confirmPayment(paymentIntentId: string, paymentMethodId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });
      return paymentIntent;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw new Error('Payment confirmation failed');
    }
  }

  // Helpers
  private toMinorUnits(amountMajor: number, currency: string): number {
    if (amountMajor == null || Number.isNaN(amountMajor)) return 0;
    const zeroDecimal = this.isZeroDecimalCurrency(currency);
    const factor = zeroDecimal ? 1 : 100;
    return Math.round(amountMajor * factor);
  }

  private isZeroDecimalCurrency(currency: string): boolean {
    const zero = new Set(['BIF','CLP','DJF','GNF','JPY','KMF','KRW','MGA','PYG','RWF','UGX','VND','VUV','XAF','XOF','XPF']);
    return zero.has((currency || '').toUpperCase());
  }

  private getMinimumMinorUnits(currency: string): number {
    const c = (currency || '').toUpperCase();
    if (c === 'AED') return 200; // 2.00 AED
    if (c === 'USD') return 50;  // $0.50
    if (c === 'EUR') return 50;  // €0.50
    if (c === 'GBP') return 30;  // £0.30
    return 50; // sensible default
  }
}