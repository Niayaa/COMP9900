import { Box, Button, Card, CardContent, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, { useEffect, useState } from "react";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from 'react-router-dom';

export default function PaymentPopUp({ open, handleClose, seatArea, seatAmount, tkprice}) {

    const [price, setPrice] = useState(0);
    
    const navigate = useNavigate();

    const handleSubmit = () => {
        handleClose()
    }

    useEffect(() => {
      setPrice(tkprice)
    })

    

    return(
        <>
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            
            handleClose();
          },
        }}
      >
        <DialogTitle>Payment</DialogTitle>
        <DialogContent>
            <Grid2 container direction={'row'}>
                <Grid2 item sx={{padding: 2}}>This is Event Description</Grid2>
                <Grid2 item sx={{padding: 2}}> 
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker label="Basic date time picker" />
                </LocalizationProvider>
                <br/><TextField sx={{padding: 2}} id="outlined-basic" label="seatArea" variant="outlined" value={seatArea} />
                <br/><TextField sx={{padding: 2}} id="outlined-basic" label="Outlined" variant="outlined"  value={seatAmount}/>
                </Grid2>

                <Grid2 container justify="space-between">
                <Grid2 item sx={{paddingRight: 5}}>
                    <Box sx={{padding: 2}}>Total price
                        <Box sx={{ color: 'warning.main' }}>${seatAmount*60}</Box>
                    </Box>
                </Grid2>
                <Grid2 item >
                    <Box  sx={{ border: 1, padding: 5}}>Payment Information</Box>
                </Grid2>
                </Grid2>
            </Grid2>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Cancel</Button> */}
          <Button type="submit" onClick={handleSubmit}>Pay it</Button>
          <Button onClick={handleClose}>Return</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
        </>
    );

};