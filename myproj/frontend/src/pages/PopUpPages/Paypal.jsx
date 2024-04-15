import { PayPalButtons } from "@paypal/react-paypal-js";
import React from "react";

export default function PayPal() {
    const handleApprove = (data, actions) => {
        return actions.order.capture().then(details => {
            // 这里使用 fetch 或者 axios 发送数据到你的后端服务器
            console.log('Payment Successful:', details);
            // 实现具体的逻辑
        });
    };

    return (
        <PayPalButtons
            createOrder={(data, actions) => {
                return actions.order.create({
                    purchase_units: [
                        {
                            amount: {
                                value: "10.00", // 设置支付金额
                            },
                        },
                    ],
                });
            }}
            onApprove={handleApprove}
        />
    );
}
