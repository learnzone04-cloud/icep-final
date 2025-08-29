import { StripeService } from './stripe.service';
export declare class StripeController {
    private readonly stripeService;
    constructor(stripeService: StripeService);
    createPaymentIntent(amount: number, currency: string): Promise<{
        clientSecret: string;
        paymentIntentId: string;
    }>;
    confirmPayment(body: {
        paymentIntentId: string;
        paymentMethodId: string;
        reservationId?: number;
    }): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.PaymentIntent>>;
}
