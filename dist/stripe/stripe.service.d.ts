import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
export declare class StripeService {
    private readonly configService;
    private stripe;
    constructor(configService: ConfigService);
    createPaymentIntent(amount: number, currency: string): Promise<{
        clientSecret: string;
        paymentIntentId: string;
    }>;
    confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<Stripe.Response<Stripe.PaymentIntent>>;
    private toMinorUnits;
    private isZeroDecimalCurrency;
    private getMinimumMinorUnits;
}
