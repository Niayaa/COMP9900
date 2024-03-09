import { Link, Route, Routes, useHistory, useNavigate } from "react-router-dom";
import EventPage from "./EventPage";
import { Backdrop, Button, colors } from "@mui/material";


export default function UseEventPage(){
    const navigate = useNavigate();

    
    const handleEventPage = () => {
        navigate('/eventpage', {state: { ConcertTitle: "Please Type Title",
                                         Date: "12 12 24"}})
    }

    return(
        <>
        <div>This is a test for call EventPage</div>
        <Button
            variant="outlined"
            
            sx ={{height: 150, width: 200}} 
            onClick={handleEventPage}>

        </Button>
            
        </>
    );
};