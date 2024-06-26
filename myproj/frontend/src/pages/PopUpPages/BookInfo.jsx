import { Box, Card, Button, CardContent, TextField, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from "react";
import { useAuth } from '../AuthContext.js';
import backgroundimg from '../image/BlackBeigeModernMusicFestivalEventTicket2.jpg';
export default function BookInfoPopUp(props) {
    function getCurrentDateISOString() {
        const now = new Date();

        const isoString = now.toISOString();

        return isoString.substring(0, 19) + 'Z';
    }
    
    const todaydate = getCurrentDateISOString();
    const [dayDifferece, setDayDifference] = useState(0);
    
    const eventID = props.eventID;
    const user_id = props.cus_id
    const {user} = useAuth();

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
        setOpenCancelDialog(false);
    };
    
    const handleCancelSubmit = async () => {
        if (window.confirm(`Are you sure you want to cancel ${cancelAmount} tickets?`)) {
            // Proceed with cancellation logic here...
            CancelTicket(cancelAmount, selectedReservation.reservation_id)
            handleCloseCancelDialog();  // Close the dialog after action
        }
    };
    
    // useEffect(() => {
    //     // fetchEventInfo and fetchBookInfo logic...
    // }, [InfoArray]);
    
    
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
            // Convert date strings to Date objects

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
        if(InfoArray){
            if(InfoArray.code === '1'){
                setInfoArray(InfoArray.token)
                console.log("InfoArray===", InfoArray)
                
            }else{
                setInfoArray([])
    
            }
        }else{
            setInfoArray([])
        }
        }).catch(error => {
          // handle error
          setInfoArray([])
          if(error === "TypeError: Failed to fetch"){

          }
          console.log("KKKKKKKKKKKKKKKK",error)
          alert(error);
        })
      }
  
  
    async function CancelTicket(amount, reservation_id){
        await fetchBookInfo(); // Re-fetch tickets info before cancellation (to ensure the latest info is used
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
        const fetchData = async () => {
            await fetchEventInfo();
        };

        fetchData();
        fetchBookInfo(); // Assuming fetchBookInfo is another function you need to call
        console.log("todaydate", todaydate);
    }, []); // Empty dependency array to run only once


    // Second useEffect to calculate the day difference when eventInfo changes
    useEffect(() => {
        if (eventInfo.date) { // Make sure the date exists
            console.log("eventInfo.date", eventInfo.date);

            const dateTime1 = new Date(todaydate);
            const dateTime2 = new Date(eventInfo.date);

            // Calculate the difference in milliseconds
            const differenceInMilliseconds = dateTime2 - dateTime1;

            // Convert the difference from milliseconds to days
            const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
            setDayDifference(differenceInDays);

            console.log(`The difference is ${differenceInMilliseconds} milliseconds, which is approximately ${differenceInDays} days.`);
        }
    }, [eventInfo]); // Dependency on eventInfo

    const ticketStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        background: 'linear-gradient(130deg, #ffffff, #f4f4f4)',
        color: '#333',
        padding: '16px',
        margin: '8px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 'bold',
        letterSpacing: '0.015em',
      };
    
      const sectionStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '8px',
        gap: '4px',
      };
      const aspectRatio = 647 / 2000;
    return (
      <>
          <Dialog
              open={props.open}
              onClose={props.handleClose}
              maxWidth="md"
            //   sx={{backgroundColor: 'rgba(255, 255, 255, 0.5)'}}
                sx={{
                    '& .MuiDialog-container': {
                        '& .MuiPaper-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent background
                        }
                    },
                    height: { xs: '300px', sm: 'auto' }, // Set height to 300px on xs screens, and 'auto' on sm screens and above
                    mb: { xs: '200px', sm: 'auto' }, 
                }}
          >
              <DialogTitle sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>Book Information</DialogTitle>
              <DialogContent >
                  <Grid2 container spacing={2} >
                      <Grid2 item  xs={12} md={6}>
                      <Card sx={{ m: 1, mt: 2, padding: 2, boxShadow: 3 }}>
                                <Typography variant="h6" component="div" sx={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
                                    {eventInfo.title}
                                </Typography>
                            </Card>
                            <Card sx={{ m: 1, padding: 3, boxShadow: 3 }}>
                                <Typography sx={{ fontFamily: 'Arial, sans-serif' }}>
                                    {eventInfo.description}
                                </Typography>
                            </Card>
                      </Grid2>
                      <Grid2 item sx={{m : 1, mt: 2}}>
                      <Card sx={{ m: 1, padding: 1, boxShadow: 3 }}>
                                <Typography sx={{ fontFamily: 'Arial, sans-serif' }}>
                                    Date: {eventInfo.date}
                                </Typography>
                            </Card>
                            <Card sx={{ m: 1, padding: 1, boxShadow: 3 }}>
                                <Typography sx={{ fontFamily: 'Arial, sans-serif' }}>
                                    Event Address: {eventInfo.location}
                                </Typography>
                            </Card>
                      </Grid2>
                  </Grid2>
              { user && (InfoArray !== null ) && (InfoArray.length > 0)? (InfoArray.map((info, index) => (
                        <Card 
                        // sx={{ 
                        //     width: '100%', m: 1, padding: 1, boxShadow: 3 }}
                        // sx={{
                        //     maxWidth: '100%', // To ensure it doesn't exceed the width of its container
                        //     height: `calc(100vw * ${aspectRatio})`, // Set the height to match the image
                        //     // backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        //     backgroundColor: 'transparent', // Set the background to transparent
                        //     backgroundImage: `url(${backgroundimg})`,
                        //     backgroundRepeat: 'no-repeat',
                        //     backgroundSize: 'contain',
                        //     // backgroundPosition: 'center',
                        //     display: 'flex',
                        //     flexDirection: 'column',
                        //     justifyContent: 'space-between',
                        //     // p: 2,
                        //     pl:1,
                        //     pr:1,
                        //     boxShadow: 3,
                        //     position: 'relative',
                        //     overflow: 'hidden',
                        // }}
                            >
                  <Grid key={index}sx={{marginTop: 2}} container justifyContent="space-between" alignItems="center">
                        <Grid item >
                        <Card sx={{height: '100%', width: '100%', m: 1, padding: 1, boxShadow: 3 }}>
                            <p>Ticket type: {info.ticket_type}</p>
                            <p>Seat: {info.reserve_seat}</p>
                            <p>Number of Tickets: {info.amount}</p>
                            <p>Price per ticket: {info.ticket_price}</p>
                            <p>Total price: {info.total_price}</p>
                            <p>Booked time: {info.reserving_time}</p>
                            {/* {info.amount > 1 && <p>More than one ticket booked!</p>} */}
                        </Card>
                        </Grid>
                        <Grid item>
                        <Card sx={{ height: '100%', width: '100%', m: 1, padding: 1, boxShadow: 3 }}>
                            {/* <Button onClick={() => CancelTicket(1, info.reservation_id)}>Cancel</Button> */}
                            {
                                todaydate < eventInfo.date || (dayDifferece > 7) ? <Button onClick={() => {handleOpenCancelDialog(info)}}>Cancel</Button> : <Button disabled>Cancel</Button>
                                // <Button onClick={() => {handleOpenCancelDialog(info)}}>Cancel</Button>
                            }
                            
                            </Card>
                        </Grid>
                    </Grid>
                        </Card>

                ))):(<></>)}
              </DialogContent>
              <DialogActions>
                  { (InfoArray !== null ) ? (InfoArray.map((info, index) => (
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
                      sx={{mt:1}}
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