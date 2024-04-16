import { PayPalButtons } from "@paypal/react-paypal-js";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetTicketNumber } from "./Payment";
export default function PayPal({userEmail, eventID, seatArea, seatAmount, tkprice}) {
    async function Book(){

        await fetch(`http://127.0.0.1:8000/booking/?email=${userEmail}&event_id=${parseInt(eventID)}`,{
        method: 'POST',
        headers: {
            'content-type':'application/json',
            
        },
        body: JSON.stringify({
          ticket_type: seatArea,
          ticket_number: parseInt(seatAmount)
        }),
    }).then(res => {
        if (res.ok) {
        //   alert("success book!")
            return res.json();
          }
        // handle error
    }).then(task => {
        console.log(task)
        if(task){
            alert(`${task.message}`)
            if(task.code == '3')
            {
                alert("Refund will be processed in 1 business days")
            }
        }
      }).catch(error => {
        // handle error
        alert(error);
      })
    }
    const handleApprove = (data, actions) => {
        return actions.order.capture().then(details => {
            // 这里使用 fetch 或者 axios 发送数据到你的后端服务器

            console.log('Payment Successful:', details);
            // 实现具体的逻辑
        }).then(task=>{
            
            Book()
        })
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
