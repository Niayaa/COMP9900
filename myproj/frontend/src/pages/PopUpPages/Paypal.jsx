import { PayPalButtons } from "@paypal/react-paypal-js";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetTicketNumber } from "./Payment";
import { useAuth } from "../AuthContext";

export default function PayPal({userEmail, eventID, seatArea, seatAmount, tkprice}) {
    const { user } = useAuth();
    console.log("PPPPPP", seatAmount )
    async function Book(){

        await fetch(`http://127.0.0.1:8000/booking/?user_id=${user.id}&event_id=${parseInt(eventID)}`,{
        method: 'POST',
        headers: {
            'content-type':'application/json',
            
        },
        body: JSON.stringify({
          ticket_type: seatArea,
          ticket_number: seatAmount
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


            console.log('Payment Successful:', details);

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
                                value: tkprice,
                            },
                        },
                    ],
                });
            }}
            onApprove={handleApprove}
        />
    );
}
