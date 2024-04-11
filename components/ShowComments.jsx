import React, {useEffect, useState} from 'react';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Typography from '@mui/material/Typography';
import { Avatar, Box, Button, CardHeader, Container, ImageList, ListItem, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Rating from '@mui/material/Rating';
import { TextField } from '@mui/material';


export default function ShowComment(props) {

    const [comments, setComments] = useState([
        { id: 1, rating: 4, content: "This is a great event!", replies: []}
    ]);
    const [newComment, setNewComment] = useState('');
    const [newReply, setNewReply] = useState({});

    // const [ratings, setRatings] = useState([2,3,4,5]);
    // const averageRating = ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;

    const [rate, setRate] = useState(0);

    const [imageFile, setImageFile] = useState(null);

    const handleRating = (e) =>{
        setRate(parseFloat(e.target.value));
    };
    
    function generateUniqueId() {
        const timestamp = new Date().getTime(); // 获取当前时间戳
        const random = Math.random().toString(36).substring(2, 10); // 生成随机数
        return `${timestamp}-${random}`; // 结合时间戳和随机数生成唯一 ID
    }

    const fetchComments = (eventID) => {
        // 获取event id
        // 读取对应event的comment
        // console.log("if id",eventID)
        fetch('https://660265249d7276a75553232d.mockapi.io/event/'+`${eventID}`+'/comments', {
            method: 'GET',
            headers: {'content-type':'application/json'},
          }).then(res => {
            if (res.ok) {
                return res.json();
            }
            // handle error
          }).then(eventdata => {
            console.log("we get first event", eventdata);
            // Do something with the list of tasks
            setComments(eventdata)
          }).catch(error => {
            // handle error
          })
    }

    
    useEffect(()=>{
        fetchComments(props.eventID)
    },[]); //加不加comments
    
    async function postComments(eventID, newComment) {
        // console.log("pc",eventID)
        await fetch('https://660265249d7276a75553232d.mockapi.io/event/'+`${eventID}`+'/comments', {
            method: 'POST',
            headers: {'content-type':'application/json'},
            // Send your data in the request body as JSON
            body: JSON.stringify({
                id: newComment.id,
                useremail: "",
                content: newComment.content,
                replies: [],
                imageUrl: newComment.imageUrl,
                rating: newComment.rating,
                eventId: eventID,
                createAt: new Date(),

            })
          }).then(res => {
            if (res.ok) {
                return res.json();
            }
            // handle error
          }).then(task => {
            // do something with the new task

          }).catch(error => {
            // handle error
            alert(error);
          })
    }
    //当下加了comment直接显示在界面上
    //同时发送到后端
    // 在下一次更新的时候再
    const addComment = () => {
        if (newComment === '') return;
        if (imageFile)
        {
            const reader = new FileReader();
            reader.onload = function(e) {
                // 文件读取完成后，e.target.result包含图片的Base64
                const newCommentObj = {
                    id: generateUniqueId(),
                    rating: rate,
                    content: newComment,
                    replies: [],
                    imageUrl: e.target.result // 将图片Base64保存为评论的一部分
                };
                setComments([...comments, newCommentObj]);
                // post to backend
                postComments(props.eventID, newCommentObj)
                
                setNewComment('');
                setImageFile(null);
            };
            reader.readAsDataURL(imageFile);

        }
        else {

            const newCommentObj = {
                id: generateUniqueId(),
                rating: rate, // Default rating for a new comment; adjust as necessary
                content: newComment,
                replies: [],
                imageUrl: ''
            };
            // post到后端
            postComments(props.eventID, newCommentObj)
            setComments([...comments, newCommentObj]);
            setNewComment(''); // Reset new comment input
        }
    };

    async function postReplies(eventID, commentId, newReply) {
        // console.log("pr",commentId)
        await fetch('https://660265249d7276a75553232d.mockapi.io/event/'+`${eventID}`+'/comments/'+`${commentId}`+'', {
            method: 'POST',
            headers: {
                'content-type':'application/json',
            //   Authorization: `Bearer ${token}`,
            },
            // Send your data in the request body as JSON
            body: JSON.stringify({
                id: newReply.id,
                eventId: eventID,
                commentID: commentId,
                content: newReply.content,
                createAt: new Date(),

            })
          }).then(res => {
            if (res.ok) {
                return res.json();
            }
            // handle error
          }).then(task => {
            // do something with the new task

          }).catch(error => {
            // handle error
            alert(error);
          })
    };

    async function fakeUpdateRepies(eventID, commentId, Replies) {
        // console.log("Replies", Replies)
        await fetch('https://660265249d7276a75553232d.mockapi.io/event/'+`${eventID}`+'/comments/'+`${commentId}`, {
            method: 'PUT',
            headers: {
              'Content-type': 'application/json',
            //   Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(
              {
                id: commentId,
                replies: Replies,
              }
            )
          }).then(res => {
            if (res.ok) {
                return res.json();
            }
            // handle error
          }).then(task => {
            // do something with the new task

          }).catch(error => {
            // handle error
            alert(error);
          });
      
    }

    const addReply = (commentId) => {
        if(newReply[commentId] === '') return;
        const updatedComments = comments.map(comment => {
            if (comment.id === commentId) {
                fakeUpdateRepies(props.eventID, commentId,  [...comment.replies, newReply[commentId]])
                return { ...comment, replies: [...comment.replies, newReply[commentId]] };
            }
            return comment;
        });
        setComments(updatedComments);
        // console.log("comments", comments)
        // console.log("comments[commentId].replies", comments[commentId])
        // post到后端 或者选择 update/put comments 倾向前一种
        // postReplies(props.eventID, commentId, newReply[commentId])
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
        <Box sx={{ padding: {xs:0, md:4, lg:4} }}>
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
            <Rating
              name="rating"
              value={rate}
              onChange={handleRating}
            />
            <Button variant="contained" onClick={addComment}>Add Comment</Button>
            {comments.map((comment, index) => (
                <Card key={comment.id} variant="outlined" sx={{  bgcolor:'transparent', mt: 1, mb: 1, 
            }}>
                    <Card>
                    <CardContent
                        sx={{
                            
                            width: {
                                xs: '50%', // 小于600px宽时，Box占满容器
                                sm: '100%', // 小于960px宽时，Box宽度为容器的75%
                                md: '100%', // 小于1280px宽时，Box宽度为容器的50%
                                lg: '100%', // 小于1920px宽时，Box宽度为容器的25%
                            },
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'column' }, // 在小屏设备上使用列布局，在中等及以上设备上使用行布局
                            // justifyContent: 'space-between',
                            // alignItems: 'center',
                            // gap: 1, // 添加间距
                            transition: 'all 0.5s ease',
                            
                        }}
                        >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar alt="User Name" src="/static/images/avatar/1.jpg" />
                    <Typography variant="subtitle1" sx={{ ml: 2 }}>
                        {comment.username}
                    </Typography>
                    </Box>
                        {/* <Typography variant="subtitle1">
                            {"Comment #" + comment.id}
                        </Typography> */}
                        <Typography variant="body1" color="text.secondary" sx={{ m: 4, mr: 10, }} style={{ wordWrap: 'break-word' }}>
                            {comment.content}
                        </Typography>
                        {comment.imageUrl && (
                            <img src={comment.imageUrl} alt="Comment" style={{ maxWidth: '50%', maxHeight: '200px',  alignItems: 'center',}} />
                            )}
                    </CardContent>
                    </Card>
                    <CardActions>
                    <TextField
                            label="Your Reply"
                            size="medium"
                            multiline = "true"
                            value={newReply[comment.id]}
                            onChange={(event) => handleReplyChange(event, comment.id)}
                            variant="outlined"
                            sx={{ 
                                marginLeft: 'auto',
                                width: '40%', // 或者使用具体的宽度值，比如 '300px'
                                m: 1,
                            }}
                        />
                        <Button variant="contained" size="small" onClick={() => addReply(comment.id)}>Reply</Button>
                    </CardActions>
                        {comment.replies.map((reply, replyIndex) => (
                            <Box key={replyIndex} 
                            justifyContent="flex-start"
                            sx={{ ml: 10, mr: 2, mt: 1, 
                                bgcolor: 'background.paper', 
                                p: 3, 
                                boxShadow: 5, // 应用阴影
                                borderRadius: 1, 
                            }}>
                                <Typography variant="body2">{reply}</Typography>
                            </Box>
                        ))}
                    
                </Card>
            ))}

        </Box>
    );
}