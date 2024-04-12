import { Box, Button, Card, CardContent, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, { useEffect } from "react";

export default function BookInfoPopUp(props) {

    const eventID = 1;
    const [eventInfo, setEventInfo] = React.useState({});
    
    async function fetchEventInfo(eventID){
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
          // console.log("we get first event", event.token);
          // Do something with the list of tasks
          
          // console.log("fetchEventInfo", event)
          setEventInfo(event.token)
          // console.log("Hei HHH",event.token.type )
          // setTags([event.token.type, ""])

          // console.log("Hei hei", tags)
          // console.log("Hei hei hei", Object.keys(event.token.tickets))

        }).catch(error => {
          // handle error
          alert(error);
        })
      }


    async function CancelEvent(eventID){
      await fetch("http://127.0.0.1:8000/event_page_detail/?event_id="+`${eventID}`,{
        method: 'DELETE',
        headers: {
            'content-type':'application/json',
            
        },
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    }).then(data => {
        

      }).catch(error => {
        // handle error
        alert(error);
      })
    }

    useEffect(() => {
        fetchEventInfo(eventID)
    }, []);


    return(
        <>
    <React.Fragment>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            
            props.handleClose();
          },
        }}
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
        </DialogContent>
        <DialogActions>
          
          <Button type="submit" onClick={props.handleClose}>Cancel it</Button>
          {/* <Button onClick={props.handleClose}>Re-schedule</Button> */}
        </DialogActions>
      </Dialog>
    </React.Fragment>
        </>
    );

};