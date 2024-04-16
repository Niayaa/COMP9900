import React, {useEffect, useRef, useState} from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import Sun from '@mui/icons-material/LightMode';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { Autocomplete, Avatar, Box, Button, CardHeader, Chip, Container, ImageList, ListItem, Stack, TablePagination, Divider } from '@mui/material';
// import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
// import CardActions from '@mui/material/CardActions';
import Rating from '@mui/material/Rating';
// import CommentPopUp from './PopUpPages/Comment';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import CardMedia from '@mui/material/CardMedia'; // 引入CardMedia组件用于展示图片

// import { TextField } from '@mui/material';

import Image from './image/sydney-opera-house-363244_1280.jpg';
import { useLocation } from 'react-router-dom';
import './PopUpPages/bgImage.css';

// import MyComponent from './PopUpPages/EmbeddedGoogleMap.jsx';
import PaymentPopUp from './PopUpPages/Payment.jsx';
import ScrollableFrame from './PopUpPages/ForScroll.jsx';

import ShowComment from './ShowComments.jsx'; 
import BookInfoPopUp from './PopUpPages/BookInfo.jsx';

import { useAuth } from './AuthContext.js';


function EventInfoGrid() {

    return (
        <Paper>Event Info</Paper>
    );
};

function EventPage(props) {

    const [isCustomer, setIsCustomer] = useState(false);
    const [isOrganizer, setisOrganizer] = useState(false);
    const [isLogin, setisLogin] = useState(false);
    const { user } = useAuth();

    console.log("UUUUUUUUUUUUUUUUUSER", user)
    const isLoggedIn = user ? true : false;
    useEffect(() => {

        if(isLoggedIn){
            if(user.role === 'organizer'){
                setIsCustomer(false);
                setisOrganizer(true);
            }else{
                setIsCustomer(true);
                setisOrganizer(false);
            }
        }
        else{
            setIsCustomer(false);
            setisOrganizer(false);
        }
    }, 
    [1000]);
    
    const token = localStorage.getItem('token');
    // console.log("token", token);
    const tagElements = [];

    const location = useLocation();
    const propss = location.state
    console.log("propss", propss)
    // console.log("ID", propss.ID)
    const isCustome = propss.isCustomer;
    // console.log("isCustomer", isCustome)
    const isOrganize = !(propss.isCustomer);
    // console.log("isOrganize", isOrganize)
    // console.log("props", propss.isLoggedIn)
    console.log(propss.user_email)

    const user_id = user? user.id: null;
    const [eventInfo, setEventInfo] = useState([])
    const [seatarea, setSeatarea] = useState('');
    const [seat, setSeat] = useState({ area: '', price: 0 });
    const handleSeatarea = (event) => {
        const selectedArea = event.target.value;
        const selectedPrice = ticketPrice[ticketType.indexOf(selectedArea)][1]; // 假设 ticketPrice 根据区域索引存储价格
        setSeat({ area: selectedArea, price: selectedPrice });
    };
    
    const [seatamount, setSeatamount] = useState(null);
    const [tags, setTags] = useState(['#','#', '#']);
    const [ticketType, setTicketType] = useState([]);
    const [ticketPrice, setTicketPrice] = useState([]);
    const [openC, setOpenC] = useState(false);
    const [openP, setOpenP] = useState(false);
    const [totalRating, setTotalRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [commentLength, setCommentLength] = useState(0);
    const [numTicket, setNumTicket] = useState(0);

    function getCurrentDateISOString() {
        const now = new Date();
        // 将日期转换为ISO字符串（例如 "2024-03-07T00:00:00.000Z"）
        const isoString = now.toISOString();
        // 截取字符串以获取不包含毫秒的部分，并保持Z表示UTC
        return isoString.substring(0, 19) + 'Z';
        }
        
    const todaydate = getCurrentDateISOString();


    
    const handlePopUpComment = () => {
        setOpenC(true)
    }

    const handleCloseComment = () => {
        setOpenC(false)
    };

    const handlePopupPayment = () => {
        if (seat.area === '' || seatamount === '' ){
            alert("Please select seat area and seat amount first")
            return;
        } 
        setOpenP(true)
    };
    // function handlePopupPayment() {
        // const newWindow = window.open('', '_blank');
        // newWindow.document.write(`
        //     <html>
        //     <head>
        //         <title>Payment</title>
        //         <link rel="stylesheet" type="text/css" href="/path/to/your/css/styles.css">
        //         <script src="/path/to/your/bundle.js"></script>
        //     </head>
        //     <body>
        //         <div id="popup"></div>
        //     </body>
        //     </html>
        // `);
        // newWindow.document.close();
    
        // newWindow.onload = function() {
        //     const reactContent = newWindow.document.getElementById('popup');
        //     ReactDOM.render(<PaymentPopUp open={openP} cus_id={user_id} handleClose={handleClosePayment} tkprice={seat.price} seatArea={seat.area} seatAmount={seatamount} userEmail={propss.user_email} eventID={propss.ID}/>, reactContent);
        // };
    // }
    
    const handleClosePayment = () => {
        setOpenP(false)
    };

    const handleSeatamount = (e) => {
        
        setSeatamount(e.target.value);
    }

    const handleSeatFormSubmit = (e) => {

        // 发送到后端
        if (seatarea === '' || seatamount === '' ) return;
        e.preventDefault(); // 阻止表单默认的提交行为
        console.log(seatarea,seatamount);


        fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => response.json())
        .then(json => console.log(json))

        setSeatamount('');
        setSeatarea(1);

    }

    async function fetchEventInfo(eventID){
        // await fetch("https://660265249d7276a75553232d.mockapi.io/event/"+`${eventID}`,{
            await fetch("http://127.0.0.1:8000/event_page_detail/?event_id="+`${eventID}`,{
            method: 'GET',
            headers: {
                'content-type':'application/json',
                
            },
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
            // handle error
        }).then(event => {
            console.log("we get first event", event.token);
            // Do something with the list of tasks
            
            // console.log("fetchEventInfo", event)
            setEventInfo(event.token)
            // console.log("Hei HHH",event.token.type )
            if(event.token.event_tags===null || event.token.event_tags===undefined || event.token.event_tags===""){
                setTags(["No tag"])
            }else{

                setTags([event.token.event_tags, ""])
                let jsonStr = event.token.event_tags.replace(/'/g, '"');
    
                // 使用JSON.parse()将字符串转换为数组
                let arr = JSON.parse(jsonStr);
                setTags(arr|| [])
                if (Array.isArray(tags)) {
                    console.log("Hei hei hei", tags);
                }else{
                    console.log("Hei hei hei", "not an array");
                }
                console.log("Hei hei heii", tags)
            }
            setTicketType(Object.keys(event.token.tickets))
            setTicketPrice(Object.values(event.token.tickets))
            // console.log(Object.values(event.token.tickets)[1])
            setTotalRating(event.token.total_rating)
            // console.log("Hei hei", tags)
            // console.log("Hei hei", event.token.image)
            // if (Array.isArray(event.token.event_tags)) {
            //     console.log("Hei hei hei", event.token.event_tags);
            // }else{
            //     console.log("Hei hei hei", "not an array");
            // }
            

          }).catch(error => {
            // handle error
            alert("OOOP")
            alert(error);
          })
    }


    useEffect(() => {
        const fetchData = async () => {
            console.log("Reload EventPage");
            await fetchEventInfo(propss.ID);
            console.log("useEff event", eventInfo); // 在这里可以看到 eventInfo 的值
            
            if (eventInfo && eventInfo.comments && eventInfo.comments.length > 0) {
                const averageRating = eventInfo.total_ratings / eventInfo.comments.length;
                setAverageRating(averageRating);
                setCommentLength(eventInfo.comments.length)
                
            }
        };
        
        fetchData();
        if(eventInfo){
            setTags(eventInfo.event_tags|| [])

        }else{
            setTags([])
        }
        
        // if(propss.isCustomer === 'true' || propss.isCustomer === true){
        //     setIsCustomer(true);
        //     setisOrganizer(false);
        // }
        // else if(propss.isCustomer === 'false' || propss.isCustomer === false){
        //     setIsCustomer(false);
        //     setisOrganizer(true);
        // }
    }, []);

    useEffect(() => {
        console.log("Tags updated:", tags); // 当 tags 更新时执行
    }, [tags]); // 

    const [openI, setOpenI] = useState(false);

    const handlePopupBookInfo = () => {
        setOpenI(true)
    };

    const handleCloseBookInfo = () => {
        setOpenI(false)
    };

    return (
    <div 
    // className={classes.root}
        className='my-component-background'
    >
        <Container sx={{paddingBottom: {xs: 4}}}>
        <></>
        <Button variant="none" disabled={true}></Button>
       {/* <BookInfoPopUp cus_id={user_id} open={openI} eventID={propss.ID} handleClose={handleCloseBookInfo}></BookInfoPopUp> */}
        <Grid container spacing={2} direction={'column'} 
            sx={{
                // bgcolor: 'lightblue',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                // filter: 'blur(10px)', // 高斯模糊效果
                borderRadius: 2,
                mx: 'auto', my: 4, width: '90%', height: 'auto',
            }}
        > 
         <Grid container spacing={2} sx={{padding: 4}}>
            {/* left */}
            <Grid item xs={12} md={8}>
                {/* <Paper elevation={3} style={{ padding: 2 }}>左侧内容</Paper> */}
    <Box sx={{backgroundColor: 'rgba(255, 255, 255, 0.0)', width: '100%', mt: 3, mr:3, p: 2, textAlign: 'center',  borderRadius: '4px' }}>
      <Grid container alignItems="center" justifyContent="center" spacing={2} sx={{mr: 10}}>
        {todaydate <= eventInfo.date ? (
          <Typography variant="subtitle1">
            Event total rating will show up soon.
          </Typography>
        ) : (
          <>
            <Typography variant="h6" sx={{ lineHeight: 'normal', mt: '-5px' }}>
              The event total rating:
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: 2, height: '30px' }} />
            <Rating
              name="read-only"
              value={totalRating}
              precision={0.1}
              readOnly
              sx={{ verticalAlign: 'middle' }}  // Adjust alignment here
            />
            <Typography variant="subtitle1" sx={{ ml: 2, verticalAlign: 'middle' }}>
              {totalRating}
            </Typography>
          </>
        )}
      </Grid>
    </Box>
                <Grid> 
                    <Box
                        
                        sx={{

                            p: { xs: 1, md: 2 }, // 在小屏幕上padding为1，在中等及以上屏幕上为2
                            width: 'auto', 
                            height: 'auto',
                            
                            boxShadow: 5, // 应用阴影
                            borderRadius: 1, // 圆角
                        }}
                    >
                        <Paper elevation={0} square> {/* Paper组件用于展示内容 */}
                            {/* Your content here */}
                            <Card style={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.)', 
                                backdropFilter: 'blur(10px)' 
                                }}>
                                <CardMedia
                                    sx={{ height: 200 }}
                                    image={eventInfo.image}
                                    title=""
                                />
                                <CardHeader
                                    title={[ eventInfo.title]}
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
                                xs: '100%', // 小于600px宽时，Box占满容器
                                sm: '100%', // 小于960px宽时，Box宽度为容器的75%
                                md: '100%', // 小于1280px宽时，Box宽度为容器的50%
                                lg: '100%', // 小于1920px宽时，Box宽度为容器的25%
                            },
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' }, // 在小屏设备上使用列布局，在中等及以上设备上使用行布局
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 1, // 添加间距
                            transition: 'all 0.5s ease',
                        }}
                    >
                        </Box> 
                    </Grid>
            </Grid>
            </Grid>
            {/*right  */}
            <Grid sx={{ mt: 7}} item xs={12} md={2}>
            <Box sx={{ width: '100%' }}>
            <Stack spacing={2} >
                <Grid sx={{ m: 1, minWidth: 250 }} elevation={0} style={{ padding: 2 }}>
                    <Grid sx={{ m: 1, minWidth: 250 }} elevation={0} style={{ padding: 2 }}>
                        {/* {Array.isArray(tags) && tags.length > 0 && tags.map((tag, index) => (
                            <Button key={index}>{tag}</Button>
                        ))} */}
                        {tags.map((tag, index) => (
                            <Chip key={index} label={tag} sx={{mt:0.3, mb: 0.3, mr: 0.6}}/>
                        ))}
                        {/* {tags} */}
                    </Grid>
                    {tagElements.map((tagElement) => tagElement)}
                </Grid>
                    <Grid container direction={'column'} >
                    <Grid sx={{ml: 1}}>Tickets</Grid>
                    <Grid sx={{ml: 1}}>Last selling date: {eventInfo.last_selling_date}</Grid>
                    {/* <Grid sx={{mb: 1, ml:1, mr: 1, }}><Button variant="outlined" sx={{
                        textTransform: 'none',  
                        minWidth: 250,          
                    }}  onClick={handlePopupBookInfo}>Check My Booking Info</Button>
                    <BookInfoPopUp cus_id={user_id} open={openI} eventID={propss.ID} handleClose={handleCloseBookInfo}></BookInfoPopUp>
                    </Grid> */}
                    { 
                    // eventInfo.last_selling_date > todaydate 
                    // && 
                    <form onSubmit={handleSeatFormSubmit}>
                    <FormControl sx={{ mb: 1, ml:1, mr: 1, minWidth: 250 }}>
                        <InputLabel id="demo-simple-select-helper-label">Seat area</InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={seat.area}
                            label="Seat area"
                            onChange={handleSeatarea}
                        >
                            <MenuItem value={seat.area}>
                                <em>None</em>
                            </MenuItem>
                            {ticketType.map((area, index) => (
                                <MenuItem key={area} value={area}>
                                    {area} - Price: {ticketPrice[index][1]}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>Select Seat Area</FormHelperText>
                    </FormControl>

                    <FormControl sx={{ mb: 1, ml:1, mr: 1, minWidth: 250 }}>
                        <InputLabel id="demo-simple-select-helper-label">Seat amount</InputLabel>
                        <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={seatamount}
                        label="Seat amount"
                        onChange={handleSeatamount}
                        >
                        <MenuItem value={seatamount}>
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>

                        </Select>
                        <FormHelperText>Select Seat Amount</FormHelperText>
                    </FormControl>
                    <br></br>
                    {isLoggedIn && isCustomer && (todaydate <= eventInfo.last_selling_date) &&( 
                        <>
                        <Button sx={{ m: 1, minWidth: 250 }} type='button' variant='contained' onClick={handlePopupPayment}>Book</Button>
                        <PaymentPopUp open={openP} cus_id={user_id} handleClose={handleClosePayment} tkprice={seat.price} seatArea={seat.area} seatAmount={seatamount} userEmail={propss.user_email} eventID={propss.ID}></PaymentPopUp>
                        </>
                    )}
                    {
                        (!isLoggedIn || !isCustomer) && (
                        <Grid sx={{ml:1}}>Only login as customer can book.</Grid>
                    )}
                    {
                        (todaydate > eventInfo.last_selling_date) && (
                        <Grid sx={{ml:1}}>Over the last selling day</Grid>)
                    }
                    
                    </form>
                    }
                    </Grid>
            </Stack>
            </Box>
            </Grid>
            </Grid>
        {/* <Button onClick={handleClickOpen}>Click to Comment</Button> *点击然后弹出评论窗口 */}
        {/* <CommentPopUp open={open} handleClose={handleClose}/> */}
            <ScrollableFrame children={<ShowComment isLogin={isLoggedIn} cus_id={user_id} ifCustomer={isCustomer} ifOrganization={isOrganizer} event_date = {eventInfo.date} eventID={propss.ID}/>}></ScrollableFrame>
            
        </Grid>
    </Container>
    {/* // </Box> */}
    </div>
    );
}



export default EventPage;