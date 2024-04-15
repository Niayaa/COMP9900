import { Box, Button, Card, CardContent, TextField, Typography, } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from "react";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from 'react-router-dom';

export default function PaymentPopUp({ open, handleClose, seatArea, seatAmount, tkprice, eventID, userEmail, cus_id}) {

    console.log("ticke)price", seatAmount )
    const maxTicket = 2;
    const [price, setPrice] = useState(0);
    const [canPay, setCanPay] = useState(true);
    const [alreadyNumberTicket, setAlreadyNumberTicket] = useState(0);
    const navigate = useNavigate();

    async function GetTicketNumber() {
      await fetch(`http://127.0.0.1:8000/payment/check_ticket_number/?event_id=${parseInt(eventID)}&cus_id=${parseInt(cus_id)}`,{
        method: 'GET',
        headers: {
            'content-type':'application/json',
        },

    }).then(res => {
        if (res.ok) {
            return res.json();
        }
        // handle error
      }).then(task => {
          console.log("get ticket number",task)
          if(task.token>=maxTicket){
            setCanPay(false);
            setAlreadyNumberTicket(task.token)
            console.log("1111", alreadyNumberTicket)
          }
        }).catch(error => {
          // handle error
          alert("Caaaaaaaan nooooooot get ticket number")
          alert(error);
        })

    }
    async function PaymentProcess(){
      // console.log("payment process", parseInt(seatAmount))
      await fetch(`http://127.0.0.1:8000/payment/process/?amount=${parseInt(seatAmount)}&price=${price}`,{
        method: 'GET',
        headers: {
            'content-type':'application/json',
        },
        // body: JSON.stringify({
        //   ticket_type: seatArea,
        //   ticket_number: parseInt(seatAmount)
        // }),
      }).then(res => {
          if (res.ok) {
              return res.json();
          }
          // handle error
        }).then(data => {
            
            console.log(data.approval_url)
            if(data.approval_url){
              // fetch(data.approval_url, {
              //   method: 'GET',
              //   headers: {
              //     'content-type':'application/json',
              // },
              // }).then(res => {
              //   if (res.ok) {
              //       return res.json();
              //   }
              // }).then(task => {

              // }).catch(error => {
              //   // handle error
              //   alert(error);
              // })
              window.open(data.approval_url, '_blank', 'noopener,noreferrer');// 重定向到 PayPal 批准页面
            } else {
              console.error('Failed to create payment');
            }
            
            // if(data.code === 1){
              Book(userEmail, eventID);
            // }else{
            //   alert("Payment fail")
            // }


          }).catch(error => {
            // handle error
            alert("abcd")
            alert(error);
          })
    }

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
            alert("success book!")
              return res.json();
            }
          // handle error
      }).then(task => {
        }).catch(error => {
          // handle error
          alert(error);
        })
      }

    useEffect(() => {
      setPrice(tkprice)
      GetTicketNumber()
    })

    

    return(
        <>
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Payment</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">You are going to book</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Seat Area" variant="outlined" value={seatArea} />
            <TextField fullWidth label="Number of Seats" variant="outlined" value={seatAmount} sx={{ mt: 2 }} />
          </Grid>
          <Grid item xs={12} container justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Total price:</Typography>
            <Typography variant="h6" color="warning.main">${seatAmount * price}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {!canPay && (
          <Card variant="outlined">
            <CardContent>
              <Typography color="error">
                Sorry, the number of tickets you booked is over the maximum. You have already booked {maxTicket} tickets.
              </Typography>
            </CardContent>
          </Card>
        )}
        {canPay && (
          <Button type="submit" variant="contained" color="primary" onClick={PaymentProcess}>
            Pay it
          </Button>
        )}
        <Button onClick={handleClose}>Return</Button>
      </DialogActions>
    </Dialog>
        </>
    );

};