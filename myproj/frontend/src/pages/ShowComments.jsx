import React, { useEffect, useState } from "react";
// import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
// import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  Box,
  Button,
  // CardHeader,
  // Container,
  // ImageList,
  // ListItem,
  // Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Rating from "@mui/material/Rating";
// import { TextField } from "@mui/material";
import LikeButton from "./PopUpPages/Likes";

export default function ShowComment(props) {

  const tokenc = localStorage.getItem("userToken");
  // console.log("tokenc", tokenc);
  // console.log("ifCustomer---------", props.ifCustomer);
  // console.log("idddd---------", props.cus_id);
  const user_id = props.cus_id;

  function getCurrentDateISOString() {
    const now = new Date();
    // 将日期转换为ISO字符串（例如 "2024-03-07T00:00:00.000Z"）
    const isoString = now.toISOString();
    // 截取字符串以获取不包含毫秒的部分，并保持Z表示UTC
    return isoString.substring(0, 19) + 'Z';
    }
    
    const todaydate = getCurrentDateISOString();
    // console.log(todaydate);
    // console.log("/////////////",todaydate > props.event_date)
    // console.log("/////////////",todaydate )
    // console.log("//////////////",props.ifOrganization )

  useEffect(() => {

  },[props.ifCustomer]);


  const [comments, setComments] = useState([
    { comment_id: 1, event_rate: 4, comment: "This is a great event!", replies: [] },
  ]);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState({});

  // const [ratings, setRatings] = useState([2,3,4,5]);
  // const averageRating = ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;

  const [rate, setRate] = useState(0);

  // const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");  // State to hold the image URL
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);

  const handleRating = (e) => {
    setRate(parseFloat(e.target.value));
  };

  function generateUniqueId() {
    const timestamp = new Date().getTime(); // 获取当前时间戳
    const random = Math.random().toString(36).substring(2, 10); // 生成随机数
    return `${timestamp}-${random}`; // 结合时间戳和随机数生成唯一 ID
  }

  const fetchComments = async (eventID) => {
    // 获取event id
    // 读取对应event的comment
    // console.log("if id",eventID)
    await fetch(
      "http://127.0.0.1:8000/event_page_comment/?event_id=" +
        `${eventID}` ,    
        // await fetch(
        //   "https://660265249d7276a75553232d.mockapi.io/event/1/comments"
        //   ,
      {
        method: "GET",
        headers: { "content-type": "application/json" },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        // handle error
      })
      .then((eventdata) => {
        console.log("GET COMMENTS", eventdata.token);
        // console.log("GET COMMENTS", eventdata);
        // Do something with the list of tasks
        setComments(eventdata.token);
        // setComments(eventdata);
      })
      .catch((error) => {
        // handle error
        alert(error)
      });
  };

  useEffect(() => {
    fetchComments(props.eventID);
  }, [1000]); //加不加comments

  async function postComments(eventID, newComment) {

    console.log("newComment", newComment.comment)
    // console.log("pc",eventID)
    await fetch(
      "http://127.0.0.1:8000/submit_cus_comment/?event_id="+`${eventID}`+"&cus_id=" +`${props.cus_id}`
       ,    
      //  await fetch(
      //   "https://660265249d7276a75553232d.mockapi.io/event/1/comments"
      //    ,
      {
        method: "POST",
        headers: { "content-type": "application/json",
        // Authorization: `Bearer ${tokenc}`,
      },
        // Send your data in the request body as JSON
        body: JSON.stringify({
          // comment_id: newComment.id,
          // useremail: "",
          // comment: 
          comment_cus: newComment.comment,
          // replies: [],
          imageUrl: newComment.imageUrl,
          rating: newComment.event,
          // comment_time: new Date(),
        }),
      }
    )
      .then((res) => {
        alert(res)
        if (res.ok) {
          return res.json();
        }
      })  
      .then(data => {
        alert(`Comment posted successfully! ${data}`);
        // fetchComments(eventID);  // Assuming this is to refresh the comments displayed
      })
      .catch((error) => {
        // handle error
        alert(error);
        alert("Only customers can comment, if you're our customer, please login");
        return;
      });
  }
  //当下加了comment直接显示在界面上
  //同时发送到后端
  // 在下一次更新的时候再
  const addComment = () => {
    if (newComment === "") return;
    if (imageUrl !== "") {
       
        const newCommentObj = {
          id: generateUniqueId(),
          rating: rate,
          comment: newComment,
          replies: [],
          imageUrl: imageUrl, 
        };
        setComments([...comments, newCommentObj]);
        // post to backend
        postComments(props.eventID, newCommentObj);

        setNewComment("");
        // setImageFile(null);
      
      // reader.readAsDataURL(imageFile);
    } else {
      const newCommentObj = {
        id: generateUniqueId(),
        rating: rate, // Default rating for a new comment; adjust as necessary
        comment: newComment,
        replies: [],
        imageUrl: "",
      };
      // post到后端
      postComments(props.eventID, newCommentObj);
      setComments([...comments, newCommentObj]);
      setNewComment(""); // Reset new comment input
    }
  };

  async function postReplies(eventID, commentId, newReply) {
    // console.log("pr",commentId)
    await fetch(
      "http://127.0.0.1:8000/org_reply/?user_id="+`${user_id}`+"&comment_id="+`${commentId}` ,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
            //Authorization: `Bearer ${tokenc}`,
        },
        // Send your data in the request body as JSON
        body: JSON.stringify({
          reply_org: newReply[commentId],
        }),
      })
      .then((res) => {
        if (res.ok) {
          console( res.json())
          // return res.json();
        }
        // handle error
        console("iiiiiiiiiii", res.json())
        if(res.status === 400){
          alert("Only organization who create this event can reply, if you're, please login as the event organization.");
        }
      })
      .then((task) => {
        // do something with the new task
            // Update local state to reflect the new reply without needing to reload comments
                // Update local state to reflect the new reply without needing to reload comments
                console.log("iii", task)
        if(1){       
        setComments(comments.map(comment => {
          if (comment.comment_id === commentId) {
            return {
              ...comment,
              replies: [...comment.replies, { reply_content: newReply[commentId], reply_time: new Date().toISOString() }]
            };
          }
          return comment;
        }));
        fetchComments(props.eventID);
        }else{
          alert("Only organization who create this event can reply, if you're, please login as the event organization.");
        }
      })
      .catch((error) => {
        // handle error

        alert(error);
      });


      
  }

  const addReply = (commentId) => {
    // const replyContent = newReply[commentId];
    if (!newReply[commentId]) {
      alert("Reply cannot be empty");
      return;
    }
  
    postReplies(props.eventID, commentId, newReply);
    // Reset the specific reply input field
    setNewReply({ ...newReply, [commentId]: "" });
  };


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleReplyChange = (event, commentId) => {
    setNewReply({ ...newReply, [commentId]: event.target.value });
  };

  return (
    <Box sx={{ padding: { xs: 0, md: 4, lg: 4 } }}>
    {props.ifCustomer && props.isLogin && (todaydate > props.event_date) && (
      <>
        <TextField
          label="Add a Comment"
          multiline
          fullWidth
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        {/* <input type="file" accept="image/*" onChange={handleImageChange} /> */}
        <TextField label="Image URL" fullWidth value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} variant="outlined" sx={{ mb: 2 }} />
        <Rating name="rating" value={rate} onChange={handleRating} />
        <Button variant="contained" onClick={addComment}>
          Add Comment
        </Button>
      </>
    )}
    {
      !props.isLogin &&(
        <Grid>Only login as customer can commment.</Grid>
      )
    }
    {
      props.ifCustomer && props.isLogin && (todaydate < props.event_date) &&(
        <Grid>Comments are allowed after the event date</Grid>
      )
    }
      {comments.map((comment, index) => (
        <Card 
          key={comment.comment_id}
          variant="outlined"
          sx={{ bgcolor: "transparent", mt: 1, mb: 1, border:'none' }}
        >

    <Card sx={{boxShadow: 5, m: 2}}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          transition: "all 0.5s ease",
          
        }}
      >
        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          flexDirection: isMobile ? 'column' : 'row',
        }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar alt="User Name" src="/static/images/avatar/1.jpg" />
            <Typography variant="subtitle1" sx={{ ml: 2 }}>
              {comment.username}
            </Typography>
          </Box>
          <Box sx={{ mt: isMobile ? 2 : 0 }}>
            <LikeButton commentId={comment.comment_id} userId={user_id} isCustomer={props.ifCustomer} />
          </Box>
        </Box>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mx: 4, wordWrap: "break-word" }}
        >
          {comment.comment}
        </Typography>
        {comment.imageUrl && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 2,
            }}
          >
            <img
              src={comment.imageUrl}
              alt="Comment"
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
          { props.isLogin && props.ifOrganization &&(           
          <CardActions>
          <TextField
              label="Your Reply"
              size="small"
              multiline={true}
              value={newReply[comment.comment_id]}
              onChange={(event) => handleReplyChange(event, comment.comment_id)}
              variant="outlined"
              sx={{
                // radius: 3,
                borderRadius: 3,
                // marginLeft: "auto",
                width: "100%", // 或者使用具体的宽度值，比如 '300px'
                m: 1,
                ml: 9,
                mr: 2,
              }}
              InputProps={{
                style: {
                  borderRadius: '20px'  // 设置更大的圆角
                }
              }}
              // 如果是多行文本，还需要对textarea进行样式调整
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={() => addReply(comment.comment_id)}
            >
              Reply
            </Button>
          </CardActions>
          )}
          {comment.replies.map((reply, replyIndex) => (
            <Box
              key={replyIndex}
              justifyContent="flex-start"
              sx={{
                ml: 10,
                mr: 2,
                mt: 1,
                marginBottom: 1,
                bgcolor: "background.paper",
                p: 3,
                boxShadow: 5, // 应用阴影
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">{reply.reply_content}</Typography>
              <Typography variant="body2" sx={{ position: 'revert'}}>{reply.reply_time}</Typography>
            </Box>
          ))}
        </Card>
      ))}
    </Box>
  );
}
