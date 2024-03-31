import { Box, Button, Card, CardContent, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React from "react";

export default function BookInfoPopUp(props) {



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
                    <Box  sx={{ outline: '1px solid', padding: 6}}>Event Description</Box>
                    <Box  sx={{ outline: '1px solid', padding: 6}}>Event Description</Box>
                </Grid2>
                <Grid2 item >
                    <Box  sx={{ padding: 4}}>Date</Box>
                    <Box  sx={{ padding: 4}}>Seat area</Box>
                    <Box  sx={{ padding: 4}}>Seat amount</Box>
                    <Box  sx={{ padding: 4}}>Event Address</Box>

                </Grid2>
            </Grid2>
        </DialogContent>
        <DialogActions>
          {/* 到时候这里都要改*/}
          <Button type="submit" onClick={props.handleClose}>Cancel it</Button>
          <Button onClick={props.handleClose}>Re-schedule</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
        </>
    );

};