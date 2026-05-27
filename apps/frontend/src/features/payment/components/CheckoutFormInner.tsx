"use client";

import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

interface CheckoutFormInnerProps {
    clientSecret: string;
    bookingId: string;
}

export default function CheckoutFormInner({ clientSecret, bookingId }: CheckoutFormInnerProps) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace(`/payment/cancelTime?bookingId=${bookingId}`);
        }, 1 * 60 * 1000);

        return () => clearTimeout(timer);
    }, [router, bookingId]);


    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) {
            setErrorMsg("Dịch vụ thanh toán chưa sẵn sàng. Vui lòng thử lại.");
            return;
        }

        setLoading(true);
        setErrorMsg(null);

        const card = elements.getElement(CardElement);
        if (!card) {
            setErrorMsg("Không thể tải biểu mẫu thẻ. Vui lòng tải lại trang.");
            setLoading(false);
            return;
        }

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card },
        });

        if (result.error) {
            setErrorMsg(result.error.message ?? "Thanh toán không thành công");
        } else if (result.paymentIntent?.status === "succeeded") {
            router.push(`/payment/success?bookingId=${bookingId}`);
        } else {
            setErrorMsg("Thanh toán chưa hoàn tất. Vui lòng liên hệ hỗ trợ nếu tài khoản đã bị trừ tiền.");
        }

        setLoading(false);
    };

    const handleCancel = () => {
        router.push(`/payment/cancel?bookingId=${bookingId}`);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-2 border rounded">
                <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    {loading ? "Đang xử lý..." : "Thanh toán ngay"}
                </button>

                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                >
                    Huỷ thanh toán
                </button>
            </div>

            {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        </form>
    );
}


