import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createPaymentIntent(
    @Body('amount') amount: number,
    @Body('currency') currency: string,
  ) {
    return this.stripeService.createPaymentIntent(amount, currency);
  }

  @UseGuards(JwtAuthGuard)
  @Post('confirm')
  async confirmPayment(@Body() body: { paymentIntentId: string, paymentMethodId: string, reservationId?: number }) {
    const { paymentIntentId, paymentMethodId, reservationId } = body;
    try {
      const intent = await this.stripeService.confirmPayment(paymentIntentId, paymentMethodId);
      // Note: We removed reservation tracking, so no need to consume
      // In the future, you can add usage tracking here if needed
      return intent;
    } catch (error) {
      // Note: We removed reservation tracking, so no need to release
      // In the future, you can add usage tracking here if needed
      throw error;
    }
  }
}