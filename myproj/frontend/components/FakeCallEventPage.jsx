import { Link, Route, Routes, useHistory, useNavigate } from "react-router-dom";
import EventPage from "./EventPage";
import { Backdrop, Button, Card, CardContent, colors } from "@mui/material";
import { useEffect, useState } from "react";


export default function UseEventPage(){
    const navigate = useNavigate();
        
    async function handleEventPage() { 
        
        console.log(concertInfoArray)

        navigate('/eventpage', {state:  {ID: "1"} })
        
    }

    return(
        <>
        <div>This is a test for call EventPage</div>
        <Button
            variant="outlined"
            
            sx ={{height: 150, width: 200}} 
            onClick={()=>{handleEventPage();}}>

            <Card sx={{width: '100%', height:'100%'}}>
                <CardContent>This is an event</CardContent>
            </Card>
        </Button>
            
        </>
    );
};