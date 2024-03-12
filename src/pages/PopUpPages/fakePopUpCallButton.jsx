import { Button } from "@mui/material";
import CommentPopUp from "./Comment";
import { useState } from "react";
import PaymentPopUp from "./Payment";
import BookInfoPopUp from "./BookInfo";


function CallPopUp () {

    const [openC, setOpenC] = useState(false);
    const [openP, setOpenP] = useState(false);
    const [openI, setOpenI] = useState(false);

    const handlePopUpComment = () => {
        setOpenC(true)
    }

    const handleCloseComment = () => {
        setOpenC(false)
    };

    const handlePopupPayment = () => {
        setOpenP(true)
    };

    const handleClosePayment = () => {
        setOpenP(false)
    };

    const handlePopupBookInfo = () => {
        setOpenI(true)
    };

    const handleCloseBookInfo = () => {
        setOpenI(false)
    };
    return (
    <>
       <Button variant="outlined" onClick={handlePopUpComment}>Call Comment PopUp
       <CommentPopUp description={'This is event description'} open={openC} handleClose={handleCloseComment}></CommentPopUp>
       </Button>
       <Button variant="outlined" onClick={handlePopupPayment}>Call payment PopUp</Button>
       <PaymentPopUp open={openP} handleClose={handleClosePayment}></PaymentPopUp>
       <Button variant="outlined" onClick={handlePopupBookInfo}>Call Book Info  Pop Up</Button>
       <BookInfoPopUp open={openI} handleClose={handleCloseBookInfo}></BookInfoPopUp>
    </>
    );

};

export default CallPopUp;