import { Link, Route, Routes, useHistory, useNavigate } from "react-router-dom";
import EventPage from "./EventPage";
import { Backdrop, Button, Card, CardContent, colors } from "@mui/material";
import { useEffect, useState } from "react";


export default function UseEventPage(){
    const navigate = useNavigate();

    const concertInfoArray=[];


    concertInfoArray[0] = {ConcertTitle: "TAYLOR SWIFT | THE ERAS TOUR", Date: "THUR, MAR 7, 2024"}
    
    // useEffect(()=>{
        
        // }, [concertInfoArray])
        
    async function handleEventPage() {
        
        console.log(concertInfoArray)
        navigate('/eventpage', {state:  concertInfoArray })
        
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
        <Button
            variant="outlined"
            
            sx ={{height: 150, width: 200}} 
            onClick={()=>{handleEventPage();}}>

            <Card sx={{width: '100%', height:'100%'}}>
                <CardContent>This is an event</CardContent>
            </Card>
        </Button>

        <Button
            variant="outlined"
            
            sx ={{height: 150, width: 200}} 
            onClick={()=>{handleEventPage();}}>

            <Card sx={{width: '100%', height:'100%'}}>
                <CardContent>This is an event</CardContent>
            </Card>
        </Button>
        <Button
            variant="outlined"
            
            sx ={{height: 150, width: 200}} 
            onClick={()=>{handleEventPage();}}>

            <Card sx={{width: '100%', height:'100%'}}>
                <CardContent>This is an event</CardContent>
            </Card>
        </Button>
        <Button
            variant="outlined"
            
            sx ={{height: 150, width: 200}} 
            onClick={()=>{handleEventPage();}}>

            <Card sx={{width: '100%', height:'100%'}}>
                <CardContent>This is an event</CardContent>
            </Card>
        </Button>
        <Button
            variant="outlined"
            
            sx ={{height: 150, width: 200}} 
            onClick={()=>{handleEventPage();}}>

            <Card sx={{width: '100%', height:'100%'}}>
                <CardContent>This is an event</CardContent>
            </Card>
        </Button>
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