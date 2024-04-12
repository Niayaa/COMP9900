import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Rating } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export default function CommentPopUp({
  eventID,
  description,
  open,
  handleClose,
}) {
  const [comment, setComment] = React.useState("");
  const [rate, setRate] = React.useState(2);
  const [imageFile, setImageFile] = React.useState(null);

  const handleInputComment = (e) => {
    if (e.target.value === "") return;
    setComment(e.target.value);
  };

  const handleRating = (e) => {
    setRate(e.target.value);
  };

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  function generateUniqueId() {
    const timestamp = new Date().getTime(); // 获取当前时间戳
    const random = Math.random().toString(36).substring(2, 10); // 生成随机数
    return `${timestamp}-${random}`; // 结合时间戳和随机数生成唯一 ID
  }

  async function handleSubmit() {
    let imgData = "";
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        // 文件读取完成后，e.target.result包含图片的Base64
        imgData = e.target.result; // 将图片Base64保存为评论的一部分
      };
      reader.readAsDataURL(imageFile);
    } else {
      imgData = "";
    }
    console.log("popupcomment", eventID);
    await fetch(
      "https://660265249d7276a75553232d.mockapi.io/event/" +
        `${eventID}` +
        "/comments",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        // Send your data in the request body as JSON
        body: JSON.stringify({
          id: generateUniqueId(),
          useremail: "",
          content: comment,
          replies: [],
          imageUrl: imgData,
          rating: rate,
          eventId: eventID,
          createAt: new Date(),
        }),
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        // handle error
      })
      .then((data) => {
        // do something with the new task
      })
      .catch((error) => {
        // handle error
        alert(error);
      });
    console.log(comment, rate);
    setComment("");
    handleClose();
  }

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();

            handleClose();
          },
        }}
      >
        <DialogTitle>Your Reply is really important to us!</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            Your Reply is really important to us!
          </DialogContentText> */}
          <Grid2
            container
            sx={{ width: "auto", height: "auto" }}
            direction={"row"}
          >
            <Grid2 item>
              <Box sx={{ width: 200 }}>
                {/* 到时候读取event ID 获取description */}
                {description}
              </Box>
            </Grid2>
            <Grid2 item>
              <TextField
                id="Comment"
                label="Type comment"
                value={comment}
                multiline
                // rows={4}
                onChange={handleInputComment}
              />
              <Rating name="rating" value={rate} onChange={handleRating} />
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {/* <Button onClick={handleClose}>Cancel</Button> */}
          <Button type="submit" onClick={handleSubmit}>
            Submit comment
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
