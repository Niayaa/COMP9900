import { Box, Button, Card, CardContent, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from "react";

export default function BookInfoPopUp(props) {

    const eventID = props.eventID;
    const user_id = props.cus_id;
    const [eventInfo, setEventInfo] = React.useState({});
    const [InfoArray, setInfoArray] = React.useState([]);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [cancelAmount, setCancelAmount] = useState(1);
    const [selectedReservation, setSelectedReservation] = useState(null);

    const handleOpenCancelDialog = (info) => {
        setSelectedReservation(info);
        setOpenCancelDialog(true);
    };

    const handleCloseCancelDialog = () => {
        CancelTicket(cancelAmount, selectedReservation.reservation_id)
        setOpenCancelDialog(false);
    };

    const handleCancelSubmit = async () => {
        if (window.confirm(`Are you sure you want to cancel ${cancelAmount} tickets?`)) {
            // Proceed with cancellation logic here...
            handleCloseCancelDialog();  // Close the dialog after action
        }
    };

    useEffect(() => {
        // fetchEventInfo and fetchBookInfo logic...
    }, [InfoArray]);

    
    async function fetchEventInfo(){
      // await fetch("https://660265249d7276a75553232d.mockapi.io/event/"+`${eventID}`,{
          await fetch("http://127.0.0.1:8000/event_page_detail/?event_id="+`${eventID}`,{
          method: 'GET',
          headers: {
              'content-type':'application/json',
              
          },
      }).then(res => {
          if (res.ok) {
              return res.json();
          }
          // handle error
      }).then(event => {
          setEventInfo(event.token)

        }).catch(error => {
          // handle error
          alert(error);
        })
      }

    async function fetchBookInfo(){
            console.log("fetchBookInfofetchBookInfo")
          await fetch(`http://127.0.0.1:8000/cus/event/ticket/?user_id=${user_id}&event_id=${eventID}`,{
          method: 'GET',
          headers: {
              'content-type':'application/json',
          },
      }).then(res => {
          if (res.ok) {
              return res.json();
          }
          // handle error
        //   alert(res.json())
      }).then(InfoArray => {
        console.log("InfoArray", InfoArray)
        if(InfoArray.code === '1'){
            setInfoArray(InfoArray.token)
            console.log("InfoArray===", InfoArray)
            
        }else{
            setInfoArray([])

        }
        }).catch(error => {
          // handle error
          if(error === "TypeError: Failed to fetch"){

              setInfoArray(null)
          }
          console.log("KKKKKKKKKKKKKKKK",error)
        //   alert(error);
        })
      }
  
  
    async function CancelTicket(amount, reservation_id){
        // if (window.confirm("Are you sure you want to cancel this ticket?")) {
            await fetch(`http://127.0.0.1:8000/cus/cancel/event/?amount=${amount}&reservation_id=${reservation_id}`, {
                method: 'PUT',
                headers: {
                    'content-type':'application/json',
                },
                body: JSON.stringify({
                  reservation_id: reservation_id
                }),
            }).then(res => {
                if (res.ok) {
                  alert("Ticket cancelled successfully");
                  fetchBookInfo(); // Re-fetch tickets info after success
                  return res.json();
                }
            }).then(task=> {
                console.log("Cancel ticket",task)
                fetchBookInfo(); // Re-fetch tickets info after success

            })
            .catch(error => {
                alert(error);
            });
        // }
    }


    useEffect(() => {
        fetchEventInfo();
        fetchBookInfo();
    }, []);


    return (
      <>
          <Dialog
              open={props.open}
              onClose={props.handleClose}
              maxWidth="md"
          >
              <DialogTitle>Book Information</DialogTitle>
              <DialogContent>
                  <Grid2 container >

                      <Grid2 item >
                          <Box  sx={{ outline: '1px solid', marginTop: 2}}>{eventInfo.title}</Box>
                          <Box  sx={{ outline: '1px solid', padding: 6}}>{eventInfo.description}</Box>
                      </Grid2>
                      <Grid2 item >
                          <Box  sx={{ padding: 1}}>Date: {eventInfo.date}</Box>
                          <Box  sx={{ padding: 1}}>Event Address: {eventInfo.location}</Box>
                          <Box  sx={{ padding: 1}}>Seat area: {}</Box>
                          <Box  sx={{ padding: 1}}>Seat amount: {}</Box>

                      </Grid2>
                  </Grid2>
              
              {(InfoArray !== undefined ) && (InfoArray.length > 0)? (InfoArray.map((info, index) => (
                    <Grid key={index}sx={{outline: '1px solid', marginTop: 2}} container justifyContent="space-between" alignItems="center">
                        <Grid item >
                            <p>Ticket type: {info.ticket_type}</p>
                            <p>Seat: {info.reserve_seat}</p>
                            <p>Number of Tickets: {info.amount}</p>
                            <p>Price per ticket: {info.ticket_price}</p>
                            <p>Total price: {info.total_price}</p>
                            <p>Booked time: {info.reserving_time}</p>
                            {/* {info.amount > 1 && <p>More than one ticket booked!</p>} */}
                        </Grid>
                        <Grid item>
                            {/* <Button onClick={() => CancelTicket(1, info.reservation_id)}>Cancel</Button> */}
                            <Button onClick={() => {handleOpenCancelDialog(info)}}>Cancel</Button>
                        </Grid>
                    </Grid>
                ))):(<></>)}
              </DialogContent>
              <DialogActions>
                  { InfoArray.length > 0 ?(InfoArray.map((info, index) => (
                      <Grid key={index} container justifyContent="space-between" alignItems="center">
                          <Grid item>
                              {/* Ticket details display */}
                          </Grid>
                      </Grid>
                  )) ):(<></>)}
                  <Button onClick={props.handleClose}>Return</Button>
              </DialogActions>
          </Dialog>

          {/* Cancel Dialog */}
          <Dialog
              open={openCancelDialog}
              onClose={handleCloseCancelDialog}
          >
              <DialogTitle>Cancel Tickets</DialogTitle>
              <DialogContent>
                  <TextField
                      label="Number of Tickets to Cancel"
                      type="number"
                      InputProps={{ inputProps: { min: 1, max: selectedReservation ? selectedReservation.amount : 1 } }}
                      value={cancelAmount}
                      onChange={(e) => setCancelAmount(Math.max(1, Math.min(e.target.value, selectedReservation ? selectedReservation.amount : 1)))}
                      fullWidth
                  />
              </DialogContent>
              <DialogActions>
                  <Button onClick={handleCancelSubmit}>Submit</Button>
                  <Button onClick={handleCloseCancelDialog}>Close</Button>
              </DialogActions>
          </Dialog>
      </>
  )
};