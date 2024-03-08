import { Button } from "@mui/material";
import CommentPopUp from "./Comment";
import { useState } from "react";


function CallPopUp () {

    const [open, setOpen] = useState(false);

    const handlePopUp = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
    <>
       <Button variant="outlined" onClick={handlePopUp}>Call Comment PopUp
       <CommentPopUp open={open} handleClose={handleClose}></CommentPopUp>
       </Button>
       <Button variant="outlined">Call payment PopUp</Button>
       <Button variant="outlined">Call Book Info  Pop Up</Button>
    </>
    );

};

export default CallPopUp;