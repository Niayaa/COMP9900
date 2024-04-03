import React, {useEffect, useRef, useState} from 'react';
import Sun from '@mui/icons-material/LightMode';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { Autocomplete, Avatar, Box, Button, CardHeader, Chip, Container, ImageList, ListItem, Stack, TablePagination } from '@mui/material';
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

import CardMedia from '@mui/material/CardMedia'; // 引入CardMedia组件用于展示图片

import { TextField } from '@mui/material';

import Image from './image/sydney-opera-house-363244_1280.jpg';
import { useLocation } from 'react-router-dom';

import MyComponent from './EmbeddedGoogleMap.jsx';
import PaymentPopUp from './PopUpPages/Payment.jsx';
import ScrollableFrame from './PopUpPages/ForScroll.jsx';

import ShowComment from './ShowComments.jsx'; 

const useStyles = makeStyles((theme) => ({
    root: {
      // 添加背景图片
    //   backgroundImage: `url(${Image})`,
      backgroundImage: `url('${Image}')`,
      backgroundSize: 'cover', // 背景图片铺满容器
      backgroundPosition: 'center', // 将背景图片居中
      minHeight: '100vh', // 确保容器高度与视口高度相等
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: -1, // 将背景置于底层
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
    const [ticketType, setTicketType] = useState([]);
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

    const getTags = () =>{

        setTags()
    }

    async function fetchEventInfo(eventID){
        // await fetch("https://660265249d7276a75553232d.mockapi.io/event/"+`${eventID}`,{
            await fetch("http://demo5359668.mockable.io/events/"+`${eventID}`,{
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
            console.log("we get first event", event);
            // Do something with the list of tasks
            
            console.log("fetchEventInfo", event)
            setEventInfo(event)
            setTags(event.tags)
            setTicketType(event.seat_area)
            console.log("Hei hei", tags)
            console.log("Hei hei", event.seat_areas)

          }).catch(error => {
            // handle error
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
    }, []);

    return (
    <div className={classes.root}>
        <Container>
        <Grid container spacing={2} direction={'column'} 
            sx={{
                // bgcolor: 'lightblue',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                // filter: 'blur(10px)', // 高斯模糊效果
                borderRadius: 2,
                mx: 'auto', my: 4, width: '90%',
            }}
        > 
         <Grid container spacing={2} sx={{padding: 4}}>
            {/* left */}
            <Grid item xs={12} md={8}>
                {/* <Paper elevation={3} style={{ padding: 2 }}>左侧内容</Paper> */}
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
                <Grid sx={{ m: 1, minWidth: 250 }} elevation={0} style={{ padding: 2 }}>
                    {/* {tags} */}
                    {tags.map((tag, index)=>(
                        // <Chip>
                        <Button>{tag}</Button>
                            
                    //   {/* </Chip> */}
                    ))}
                </Grid>
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
                        {ticketType.map((area,index)=>(
                            <MenuItem value={area}>{area}</MenuItem>
                        ))}
                        {/* <MenuItem value={'A'}>A</MenuItem>
                        <MenuItem value={'B'}>B</MenuItem>
                        <MenuItem value={'C'}>C</MenuItem> */}
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
                        {/* <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={6}>6</MenuItem> */}
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
        {/* <Button onClick={handleClickOpen}>Click to Comment</Button> *点击然后弹出评论窗口 */}
        {/* <CommentPopUp open={open} handleClose={handleClose}/> */}
            <Box sx={{direction: 'row'}}>
                <Typography component="legend">Rating the event</Typography>
                <Rating
                    name="read-only"
                    value={averageRating}
                    precision={0.1} // 允许显示半星以提高精确度
                    readOnly // 将评分组件设置为只读，用户不能更改
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