import { StatusPayment, PaymentBank } from "../enums/status";


export interface CreatePaymentDto {
    booking_id: string;
    user_id: string;
    provider: PaymentBank;
    provider_session_id: string;
    provider_payment_id: string;
    currency?: string;
    statusPaymnet: StatusPayment;
}

