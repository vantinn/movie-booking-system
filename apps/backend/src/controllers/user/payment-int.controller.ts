import { Request, Response } from "express";
import { stripe } from "../../utils/stripe";
import { PaymentService } from "../../services/user/payment-int.service";

const paymentService = new PaymentService();

export class PaymentController {
    static async createPaymentIntent(req: Request, res: Response) {
        const { bookingId } = req.body;
        const data = await paymentService.createPaymentIntent(bookingId);
        return res.json(data);
    }

    static async stripeWebhook(req: Request, res: Response) {
        const sig = req.headers["stripe-signature"] as string;
        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (err: any) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        try {
            await paymentService.handleWebhook(event);
        } catch (err) {
            console.error("Webhook handler failed", err);
            return res.status(500).json({ error: "Webhook failed" });
        }

        return res.json({ received: true });
    }
}

