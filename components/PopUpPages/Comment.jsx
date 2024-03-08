import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Rating } from '@mui/material';

export default function CommentPopUp({open, handleClose}) {
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
          <TextField
            id = "Comment"
            label = "Type comment"
            value={comment}
            multiline
            rows={4}
            onChange={handleInputComment}
            />
            <Rating
              name="rating"
              value={rate}
              onChange={handleRating}
            />
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Cancel</Button> */}
          <Button type="submit" onClick={handleSubmit}>Submit comment</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
