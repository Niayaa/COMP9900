import React, {useEffect, useRef, useState} from 'react';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { Avatar, Box, Button, CardHeader, Container, ImageList, ListItem, Stack } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Rating from '@mui/material/Rating';
import CommentPopUp from './PopUpPages/Comment';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import CardMedia from '@mui/material/CardMedia';

import { TextField } from '@mui/material';

import Image from './image/sydney-opera-house-363244_1280.jpg';
import { useLocation } from 'react-router-dom';

import MyComponent from './EmbeddedGoogleMap.jsx';
import PaymentPopUp from './PopUpPages/Payment.jsx';
import ScrollableFrame from './PopUpPages/ForScroll.jsx';

import ShowComment from './ShowComments.jsx'; 

const useStyles = makeStyles((theme) => ({
    root: {

      backgroundImage: `url('${Image}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: -1,
    },
  }));

function EventInfoGrid() {

    return (
        <Paper>Event Info</Paper>
    );
};

function EventPage(props) {

    const classes = useStyles();
    const location = useLocation();
    const propss = location.state
    console.log("propss", propss)
    console.log("ID", propss.ID)
    const [eventInfo, setEventInfo] = useState([])
    const [seatarea, setSeatarea] = useState('');
    const [seatamount, setSeatamount] = useState('');
    const [tags, setTags] = useState(['#TaylorSwiftLive, #SwiftieNation, #FolkloreOnStage, #EvermoreExperience, #SwiftieMeetup']);
    const [openC, setOpenC] = useState(false);
    const [openP, setOpenP] = useState(false);
    // const [totalRating, setTotalRating] = useState([2,3,4,5]);
    const [averageRating, setAverageRating] = useState(0);
    const [commentLength, setCommentLength] = useState(0);
    
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


    const handleSeatarea = (e) => {
        setSeatarea(e.target.value);
        
    }

    const handleSeatamount = (e) => {
        setSeatamount(e.target.value);
    }

    const handleSeatFormSubmit = (e) => {


        if (seatarea === '' || seatamount === '' ) return;
        e.preventDefault();
        console.log(seatarea,seatamount);


        fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => response.json())
        .then(json => console.log(json))

        setSeatamount('');
        setSeatarea(1);

    }

    const getTags = () =>{

        setTags()
    }

    async function fetchEventInfo(eventID){
        await fetch("https://660265249d7276a75553232d.mockapi.io/event/"+`${eventID}`,{
            method: 'GET',
            headers: {'content-type':'application/json'},
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
            // handle error
        }).then(event => {
            console.log("we get first event", event);
            // Do something with the list of tasks
            
            console.log("fetchEventInfo", event)
            setEventInfo(event)

          }).catch(error => {
            // handle error
            alert(error);
          })
    }

    useEffect(() => {
        const fetchData = async () => {
            console.log("Reload EventPage");
            await fetchEventInfo(propss.ID);
            console.log("useEff event", eventInfo);
            if (eventInfo && eventInfo.comments && eventInfo.comments.length > 0) {
                const averageRating = eventInfo.total_ratings / eventInfo.comments.length;
                setAverageRating(averageRating);
                setCommentLength(eventInfo.comments.length)
            }
        };
    
        fetchData();
    }, []);

    return (
    <div className={classes.root}>
        <Container>
        <Grid container spacing={2} direction={'column'} 
            sx={{
                // bgcolor: 'lightblue',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',

                borderRadius: 2,
                mx: 'auto', my: 4, width: '90%',
            }}
        > 
         <Grid container spacing={2} sx={{padding: 4}}>
            {/* left */}
            <Grid item xs={12} md={8}>
                {/* <Paper elevation={3} style={{ padding: 2 }}>/Paper> */}
                <Grid> 
                    <Box
                        
                        sx={{

                            p: { xs: 1, md: 2 },
                            width: 'auto', 
                            height: 'auto',
                            
                            boxShadow: 5,
                            borderRadius: 1,
                        }}
                    >
                        <Paper elevation={0} square> {/*  */}
                            {/* Your content here */}
                            <Card style={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.)', 
                                backdropFilter: 'blur(10px)' 
                                }}>
                                <CardMedia
                                    sx={{ height: 200 }}
                                    image={eventInfo.imageUrl}
                                    title=""
                                />
                                <CardHeader
                                    title={[eventInfo.singer ," | ", eventInfo.title]}
                                    subheader={eventInfo.date}
                                />
                                <CardContent>
                                <Typography variant="body1" color="text.primary">
                                    {eventInfo.description}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
                                    {eventInfo.location}
                                </Typography>
                                </CardContent>
                            </Card>
                        </Paper>
                    </Box>
                    <Grid>
                    <Box       
                        sx={{
                            width: {
                                xs: '100%',
                                sm: '100%',
                                md: '100%',
                                lg: '100%',
                            },
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 1,
                            transition: 'all 0.5s ease',
                        }}
                    >
                        <Box
                            height={400}
                            
                            my={1}
                            mx={1}
                            display="flex"
                            alignItems="center"
                            gap={1}
                            p={2}
                            sx={{width:'100%', border: '2px solid grey' }}
                            >
                            google map API
                            <MyComponent/>
                        </Box>
                        <Box
                            height={400}
                            my={1}
                            mx={1}
                            display="flex"
                            alignItems="center"
                            gap={1}
                            p={2}
                            sx={{width:'100%', border: '2px solid grey' }}
                            >
                            <Stack>
                            <iframe width="auto" height="auto" src="https://www.youtube.com/embed/KudedLV0tP0?si=T-jx27C0cgOIj16C" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>

                            {/* <video src={'https://youtu.be/KudedLV0tP0?si=ywV_5uA3bwasbsvb'} width="100%" height="100%" controls="controls" autoplay="true" /> */}
                            <Card>This is a video</Card>
                            </Stack>
                        </Box>
                        </Box>
                    </Grid>
            </Grid>
            </Grid>
            {/*right  */}
            <Grid  item xs={12} md={2}>
            <Box sx={{ width: '100%' }}>
            <Stack spacing={2} >
                <Box sx={{ m: 1, minWidth: 250 }} elevation={0} style={{ padding: 2 }}>{tags}</Box>
                    <Grid container direction={'column'}>
                    <div>Tickets</div>
                    <form onSubmit={handleSeatFormSubmit}>
                    <FormControl sx={{ m: 1, minWidth: 250 }}>
                        <InputLabel id="demo-simple-select-helper-label">Seat area</InputLabel>
                        <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={seatarea}
                        label="Seat area"
                        onChange={handleSeatarea}
                        >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={'A'}>A</MenuItem>
                        <MenuItem value={'B'}>B</MenuItem>
                        <MenuItem value={'C'}>C</MenuItem>
                        </Select>
                        <FormHelperText>Select Seat Area</FormHelperText>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 250 }}>
                        <InputLabel id="demo-simple-select-helper-label">Seat amount</InputLabel>
                        <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={seatamount}
                        label="Seat amount"
                        onChange={handleSeatamount}
                        >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={6}>6</MenuItem>
                        </Select>
                        <FormHelperText>Select Seat Amount</FormHelperText>
                    </FormControl>
                    <br></br>
                    <Button type='button' variant='contained' onClick={handlePopupPayment}>Book</Button>
                    <PaymentPopUp open={openP} handleClose={handleClosePayment} seatArea={seatarea} seatAmount={seatamount}></PaymentPopUp>
                    </form>
                    </Grid>
            </Stack>
            </Box>
            </Grid>
            </Grid>
        {/* <Button onClick={handleClickOpen}>Click to Comment</Button> * */}
        {/* <CommentPopUp open={open} handleClose={handleClose}/> */}
            <Box sx={{direction: 'row'}}>
                <Typography component="legend">Rating the event</Typography>
                <Rating
                    name="read-only"
                    value={averageRating}
                    precision={0.1}
                    readOnly
                />
                <Typography component="p">total {commentLength} ratings</Typography>
            </Box>
            <ScrollableFrame children={<ShowComment eventID={propss.ID}/>}></ScrollableFrame>
            
        </Grid>
    </Container>
    {/* // </Box> */}
    </div>
    );
}



export default EventPage;