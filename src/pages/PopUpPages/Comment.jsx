import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Rating } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

export default function CommentPopUp({description, open, handleClose}) {
  const [comment, setComment] = React.useState('');
  const [rate, setRate] = React.useState(2);

  const handleInputComment = (e) => {
    
    setComment(e.target.value);
  };

  const handleRating = (e) =>{
    setRate(e.target.value);
  };

  const handleSubmit = () => {
    console.log(comment, rate)
    setComment('')
    handleClose();
  };

  return (
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
        <DialogTitle>Your Reply is really important to us!</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            Your Reply is really important to us!
          </DialogContentText> */}
          <Grid2 container sx={{width: 'auto', height: 'auto'}} direction={'row'}>
          <Grid2 item>
            <Box sx={{width: 200}}>
              {/* 到时候读取event ID 获取description */}
                {description}
            </Box>
          </Grid2>
          <Grid2 item>
          <TextField
            id = "Comment"
            label = "Type comment"
            value={comment}
            multiline
            // rows={4}
            onChange={handleInputComment}
            />
            <Rating
              name="rating"
              value={rate}
              onChange={handleRating}
            />
            </Grid2>
            </Grid2>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Cancel</Button> */}
          <Button type="submit" onClick={handleSubmit}>Submit comment</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
