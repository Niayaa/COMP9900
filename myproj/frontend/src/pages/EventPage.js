import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import {
  Avatar,
  Box,
  Button,
  CardHeader,
  ImageList,
  ListItem,
  Stack,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Rating from "@mui/material/Rating";
import CommentPopUp from "./PopUpPages/Comment";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import CardMedia from "@mui/material/CardMedia";

import { TextField } from "@mui/material";

import Image from "./image/sydney-opera-house-363244_1280.jpg";
import { useLocation } from "react-router-dom";

import MyComponent from "./PopUpPages/EmbeddedGoogleMap.jsx";
import PaymentPopUp from "./PopUpPages/Payment.jsx";

function EventInfoGrid() {
  return <Paper>Event Info</Paper>;
}

function ShowComment() {
  const [comments, setComments] = useState([
    { id: 1, rating: 4, text: "This is a great event!", replies: [] },
  ]);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState({});

  const [ratings, setRatings] = useState([2, 3, 4, 5]);

  const [imageFile, setImageFile] = useState(null);

  const averageRating =
    ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;

  const addComment = () => {
    if (newComment === "") return;
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function (e) {

        const newCommentObj = {
          id: comments.length + 1,
          rating: 4,
          text: newComment,
          replies: [],
          imageUrl: e.target.result,
        };
        setComments([...comments, newCommentObj]);
        setNewComment("");
        setImageFile(null);
      };
      reader.readAsDataURL(imageFile);
    } else {
      const newCommentObj = {
        id: comments.length + 1,
        rating: 0, // Default rating for a new comment; adjust as necessary
        text: newComment,
        replies: [],
        imageUrl: "",
      };
      setComments([...comments, newCommentObj]);
      setNewComment(""); // Reset new comment input
    }
  };

  const addReply = (commentId) => {
    if (newReply[commentId] === "") return;
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply[commentId]],
        };
      }
      return comment;
    });
    setComments(updatedComments);
    setNewReply({ ...newReply, [commentId]: "" }); // Reset reply input for this comment
  };

  const handleReplyChange = (event, commentId) => {
    setNewReply({ ...newReply, [commentId]: event.target.value });
  };

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Box>
        <Typography component="legend">Rating the event</Typography>
        <Rating
          name="read-only"
          value={averageRating}
          precision={0.1}
          readOnly
        />
        <Typography component="p">total {ratings.length} tatings</Typography>
      </Box>
      {comments.map((comment, index) => (
        <Card key={comment.id} variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
              <img
                src={comment.imageUrl}
                alt="Comment"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            )}
            {/* Replies section */}
            <Box padding={2}>~~~~~~~~~~~~~Reply~~~~~~~~~~~~~</Box>
            {comment.replies.map((reply, replyIndex) => (
              <Box
                key={replyIndex}
                justifyContent="flex-start"
                sx={{
                  ml: 10,
                  mr: 4,
                  mt: 1,
                  bgcolor: "background.paper",
                  p: 3,
                  boxShadow: 5,
                  borderRadius: 1,
                }}
              >
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
            <Button
              variant="contained"
              size="small"
              onClick={() => addReply(comment.id)}
            >
              Reply
            </Button>
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
      <Button variant="contained" onClick={addComment}>
        Add Comment
      </Button>
    </Box>
  );
}

function EventPage(props) {
  const location = useLocation();
  const propss = location.state;
  console.log("propss", propss);

  const [seatarea, setSeatarea] = useState("");
  const [seatamount, setSeatamount] = useState("");
  const [tags, setTags] = useState([
    "#TaylorSwiftLive, #SwiftieNation, #FolkloreOnStage, #EvermoreExperience, #SwiftieMeetup",
  ]);

  const [openC, setOpenC] = useState(false);
  const [openP, setOpenP] = useState(false);

  const handlePopUpComment = () => {
    setOpenC(true);
  };

  const handleCloseComment = () => {
    setOpenC(false);
  };

  const handlePopupPayment = () => {
    setOpenP(true);
  };

  const handleClosePayment = () => {
    setOpenP(false);
  };

  const handleSeatarea = (e) => {
    setSeatarea(e.target.value);
  };

  const handleSeatamount = (e) => {
    setSeatamount(e.target.value);
  };

  const handleSubmit = (e) => {

    if (seatarea === "" || seatamount === "") return;
    e.preventDefault();
    console.log(seatarea, seatamount);

    setSeatamount("");
    setSeatarea(1);
  };

  return (
    <Grid2
      container
      spacing={2}
      direction={"column"}
      sx={{
        bgcolor: "white",
        mx: "auto",
        my: 4,
        width: "90%",
      }}
      style={{
        backgroundImage: { Image },
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Grid2 container spacing={2} sx={{ padding: 4 }}>
        {/* left */}
        <Grid2 item xs={12} md={8}>
          {/* <Paper elevation={3} style={{ padding: 2 }}>左侧内容</Paper> */}
          <Grid2>
            <Box
              sx={{
                p: { xs: 1, md: 2 },
                width: "auto",
                height: "auto",

                boxShadow: 5,
                borderRadius: 1,
              }}
            >
              <Paper elevation={0} square>
                {" "}
                {/*  */}
                {/* Your content here */}
                <Card
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CardMedia sx={{ height: 200 }} image={Image} title="" />
                  <CardHeader
                    title={propss[0].ConcertTitle}
                    subheader={propss[0].Date}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      NATIONAL STADIUM, SINGAPORE Singapore, SG
                    </Typography>
                  </CardContent>
                </Card>
              </Paper>
            </Box>
            <Grid2>
              <Box
                sx={{
                  width: {
                    xs: "100%",
                    sm: "100%",
                    md: "100%",
                    lg: "100%",
                  },
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1,
                  transition: "all 0.5s ease",
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
                  sx={{ width: "100%", border: "2px solid grey" }}
                >
                  google map API
                  <MyComponent />
                </Box>
                <Box
                  height={400}
                  my={1}
                  mx={1}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  p={2}
                  sx={{ width: "100%", border: "2px solid grey" }}
                >
                  <Stack>
                    <iframe
                      width="auto"
                      height="auto"
                      src="https://www.youtube.com/embed/KudedLV0tP0?si=T-jx27C0cgOIj16C"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
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
        <Grid2 item xs={12} md={2}>
          <Box sx={{ width: "100%" }}>
            <Stack spacing={2}>
              <Box
                sx={{ m: 1, minWidth: 250 }}
                elevation={0}
                style={{ padding: 2 }}
              >
                {tags}
              </Box>
              <Grid2 container direction={"column"}>
                <div>Tickets</div>
                <form onSubmit={handleSubmit}>
                  <FormControl sx={{ m: 1, minWidth: 250 }}>
                    <InputLabel id="demo-simple-select-helper-label">
                      Seat area
                    </InputLabel>
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
                      <MenuItem value={"A"}>A</MenuItem>
                      <MenuItem value={"B"}>B</MenuItem>
                      <MenuItem value={"C"}>C</MenuItem>
                    </Select>
                    <FormHelperText>Select Seat Area</FormHelperText>
                  </FormControl>
                  <FormControl sx={{ m: 1, minWidth: 250 }}>
                    <InputLabel id="demo-simple-select-helper-label">
                      Seat amount
                    </InputLabel>
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
                  <Button
                    type="button"
                    variant="contained"
                    onClick={handlePopupPayment}
                  >
                    Book
                  </Button>
                  <PaymentPopUp
                    open={openP}
                    handleClose={handleClosePayment}
                    seatArea={seatarea}
                    seatAmount={seatamount}
                  ></PaymentPopUp>
                </form>
              </Grid2>
            </Stack>
          </Box>
        </Grid2>
      </Grid2>
      {/* <Button onClick={handleClickOpen}>Click to Comment</Button> * */}
      {/* <CommentPopUp open={open} handleClose={handleClose}/> */}
      <ShowComment />
    </Grid2>
  );
}

export default EventPage;
