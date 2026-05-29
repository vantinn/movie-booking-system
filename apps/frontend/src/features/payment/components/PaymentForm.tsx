"use client";

import React from "react";
import CheckoutFormInner from "@/features/payment/components/CheckoutFormInner";

interface PaymentFormProps {
    clientSecret: string;
    bookingId: string;
}

export default function PaymentForm({ clientSecret, bookingId }: PaymentFormProps) {
    return <CheckoutFormInner clientSecret={clientSecret} bookingId={bookingId} />;
}


