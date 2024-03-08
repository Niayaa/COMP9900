import React, {useState} from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { Avatar, Box, Button, CardHeader, ImageList, ListItem, Stack } from '@mui/material';
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

function EventInfoGrid() {

    return (
        <Paper>Event Info</Paper>
    );
};


function ShowComment() {
    const [comments, setComments] = useState([
        { id: 1, rating: 4, text: "This is a great event!", replies: [] }
    ]);
    const [newComment, setNewComment] = useState('');
    const [newReply, setNewReply] = useState({});

    const [ratings, setRatings] = useState([2,3,4,5]);

    const [imageFile, setImageFile] = useState(null);

    const averageRating = ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;

    const addComment = () => {
        if (newComment === '') return;
        if (imageFile)
        {
            const reader = new FileReader();
            reader.onload = function(e) {
                // 文件读取完成后，e.target.result包含图片的Base64
                const newCommentObj = {
                    id: comments.length + 1,
                    rating: 4,
                    text: newComment,
                    replies: [],
                    imageUrl: e.target.result // 将图片Base64保存为评论的一部分
                };
                setComments([...comments, newCommentObj]);
                setNewComment('');
                setImageFile(null);
            };
            reader.readAsDataURL(imageFile);
        }
        else {

            const newCommentObj = {
                id: comments.length + 1,
                rating: 0, // Default rating for a new comment; adjust as necessary
                text: newComment,
                replies: [],
                imageUrl: ''
            };
            setComments([...comments, newCommentObj]);
            setNewComment(''); // Reset new comment input
        }
    };

    const addReply = (commentId) => {
        if(newReply[commentId] === '') return;
        const updatedComments = comments.map(comment => {
            if (comment.id === commentId) {
                return { ...comment, replies: [...comment.replies, newReply[commentId]] };
            }
            return comment;
        });
        setComments(updatedComments);
        setNewReply({ ...newReply, [commentId]: '' }); // Reset reply input for this comment
    };

    const handleReplyChange = (event, commentId) => {
        setNewReply({ ...newReply, [commentId]: event.target.value });
    };

    const handleImageChange = (event) => {
        if (event.target.files[0]) {
            setImageFile(event.target.files[0]);
        }
    }

    return (
        <Box sx={{ padding: 4 }}>
            <Box>
                <Typography component="legend">Rating the event</Typography>
                <Rating
                    name="read-only"
                    value={averageRating}
                    precision={0.1} // 允许显示半星以提高精确度
                    readOnly // 将评分组件设置为只读，用户不能更改
                />
                <Typography component="p">total {ratings.length} tatings</Typography>
            </Box>
            {comments.map((comment, index) => (
                <Card key={comment.id} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar alt="User Name" src="/static/images/avatar/1.jpg" />
                    <Typography variant="subtitle1" sx={{ ml: 2 }}>
                        User Name
                    </Typography>
                    </Box>
                        <Typography variant="subtitle1">
                            {"Comment #" + comment.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {comment.text}
                        </Typography>
                        {comment.imageUrl && (
                            <img src={comment.imageUrl} alt="Comment" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                        )}
                        {/* Replies section */}
                        <Box padding={2} >~~~~~~~~~~~~~Reply~~~~~~~~~~~~~</Box>
                        {comment.replies.map((reply, replyIndex) => (
                            <Box key={replyIndex} sx={{ ml: 4, mt: 1, bgcolor: 'background.paper', p: 1, boxShadow: 5, // 应用阴影
                                borderRadius: 1, }}>
                                <Typography variant="body2">{reply}</Typography>
                            </Box>
                        ))}
                    </CardContent>
                    
                    <CardActions>
                        <TextField
                            label="Your Reply"
                            size="small"
                            value={newReply[comment.id]}
                            onChange={(event) => handleReplyChange(event, comment.id)}
                            variant="outlined"
                            sx={{ mr: 1 }}
                        />
                        <Button variant="contained" size="small" onClick={() => addReply(comment.id)}>Reply</Button>
                    </CardActions>
                </Card>
            ))}
            <TextField
                label="Add a Comment"
                multiline
                fullWidth
                value={newComment}
                onChange={(event) => setNewComment(event.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
            />
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <Button variant="contained" onClick={addComment}>Add Comment</Button>
        </Box>
    );
}

function EventPage() {
    const [open, setOpen] = useState(false);
    const [seatarea, setSeatarea] = useState('');
    const [seatamount, setSeatamount] = useState('');
    const [tags, setTags] = useState(['#TaylorSwiftLive, #SwiftieNation, #FolkloreOnStage, #EvermoreExperience, #SwiftieMeetup']);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () =>{
        setOpen(false);
    }

    const handleSeatarea = (e) => {
        setSeatarea(e.target.value);
        
    }

    const handleSeatamount = (e) => {
        setSeatamount(e.target.value);
    }

    const handleSubmit = (e) => {

        // 发送到后端
        if (seatarea === '' || seatamount === '') return;
        e.preventDefault(); // 阻止表单默认的提交行为
        console.log(seatarea,seatamount);

        // 发送到payment popup窗口
        setSeatamount('');
        setSeatarea(1);

    }

    return (
        <Grid2 container spacing={2} direction={'column'} 
            sx={{
                bgcolor: 'pink',
                mx: 'auto', my: 4, width: '80%'
            }}
        > 
         <Grid2 container spacing={2} sx={{padding: 4}}>
            {/* left */}
            <Grid2 item xs={12} md={8}>
                {/* <Paper elevation={3} style={{ padding: 2 }}>左侧内容</Paper> */}
                <Grid2> 
                    <Box
                        
                        sx={{

                            p: { xs: 1, md: 2 }, // 在小屏幕上padding为1，在中等及以上屏幕上为2
                            width: 'auto', 
                            height: 'auto',
                            
                            boxShadow: 5, // 应用阴影
                            borderRadius: 1, // 圆角
                        }}
                    >
                        <img width={200} src={Image} alt="picture" />
                        <Paper elevation={0} square> {/* Paper组件用于展示内容 */}
                            {/* Your content here */}
                            <Card>

                                <CardHeader
                                title="TAYLOR SWIFT | THE ERAS TOUR"
                                subheader="THUR, MAR 7, 2024"
                                />
                                <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    NATIONAL STADIUM, SINGAPORE
                                    Singapore, SG
                                </Typography>
                                </CardContent>
                            </Card>
                        </Paper>
                    </Box>
                    <Grid2>
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
                            <iframe
                                width="100%"
                                height="50%" // Adjust the height as needed
                                src="https://youtu.be/KudedLV0tP0?si=ywV_5uA3bwasbsvb"
                                title="YouTube video player"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                            ></iframe>
                            {/* <video src={'https://youtu.be/KudedLV0tP0?si=ywV_5uA3bwasbsvb'} width="100%" height="100%" controls="controls" autoplay="true" /> */}
                            <Card>This is a video</Card>
                            </Stack>
                        </Box>
                        </Box>
                    </Grid2>
            </Grid2>
            </Grid2>
            {/*right  */}
            <Grid2  item xs={12} md={2}>
            <Box sx={{ width: '100%' }}>
            <Stack spacing={2} >
                <Box sx={{ m: 1, minWidth: 250 }} elevation={0} style={{ padding: 2 }}>{tags}</Box>
                    <Grid2 container direction={'column'}>
                    <div>Tickets</div>
                    <form onSubmit={handleSubmit}>
                    <FormControl sx={{ m: 1, minWidth: 250 }}>
                        <InputLabel id="demo-simple-select-helper-label">Seat</InputLabel>
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
                        <InputLabel id="demo-simple-select-helper-label">Seat</InputLabel>
                        <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={seatamount}
                        label="Seat area"
                        onChange={handleSeatamount}
                        >
                        <MenuItem value="">
                            <em>1</em>
                        </MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={6}>6</MenuItem>
                        </Select>
                        <FormHelperText></FormHelperText>
                    </FormControl>
                    <Button type='submit' variant='contained'>Book</Button>
                    </form>
                    </Grid2>
            </Stack>
            </Box>
            </Grid2>
            </Grid2>
        {/* <Button onClick={handleClickOpen}>Click to Comment</Button> *点击然后弹出评论窗口 */}
        {/* <CommentPopUp open={open} handleClose={handleClose}/> */}
        <ShowComment/>
        </Grid2>

    );
}



export default EventPage;