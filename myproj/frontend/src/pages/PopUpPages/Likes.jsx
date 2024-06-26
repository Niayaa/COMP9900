import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Grid from '@mui/material/Grid';


const LikeButton = ({ commentId, userId, isCustomer }) => {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const fetchCheckIfLikes = () => {
    fetch(`http://127.0.0.1:8000/like_check/?comment_id=${parseInt(commentId)}&cus_id=${userId}`, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => {

      console.log("checj", data, commentId, userId)
      if (data.code === '1') {
        setHasLiked(false);
      } else if (data.code === '2') {
        setHasLiked(true);
      } else {
        console.error('Failed to check if the comment has been liked');
      }

    })
    .catch(error => {
      console.error('Error fetching likes:', error);
    });
  };

  const fetchNumberofLikes = () => {
    // console.log("commentIdcommentIdcommentId", userId)
    fetch(`http://127.0.0.1:8000/like_number/?comment_id=${parseInt(commentId)}&cus_id=${parseInt(userId)}`, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
      console.log("uuuuuuuuU",data, commentId);
      setLikes(data.token);
      // fetchCheckIfLikes()
      // console.log("cheeeecj", data, commentId)
      // if (data.code === '1') {
      //   setHasLiked(false);
      // } else if (data.code === '2') {
      //   setHasLiked(true);
      // } else {
      //   console.error('Failed to check if the comment has been liked');
      // }
    })
    .catch(error => {
      console.error('Error fetching likes:', error, commentId, userId);
    });
  };

  useEffect(() => {
    fetchCheckIfLikes();
    fetchNumberofLikes();
  }, []);

  const handleLike = () => {
    // console.log("userIduserIduserIduserId", userId)
    if (!hasLiked) {
      fetch(`http://127.0.0.1:8000/like_Comment/?comment_id=${parseInt(commentId)}&cus_id=${parseInt(userId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_id: commentId, cus_id: userId })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to like the comment');
        }
        return response.json();
      })
      .then(task => {
        console.log("After post like", task, commentId)
        // setLikes(likes => likes + 1);
        // setHasLiked(true);
        fetchCheckIfLikes();
        fetchNumberofLikes();

      })
      .catch(error => {
        console.error('Error liking the comment:', error);
      });
    }
  };

  useEffect(() => {}, [likes, hasLiked]);

  return (
    <Grid container alignItems="center" spacing={1}>
      <Grid item>
        <IconButton
          onClick={handleLike}
          disabled={hasLiked || !isCustomer}
          sx={{
            color: !isCustomer ? 'rgba(0, 0, 0, 0.26)' : // Disabled grey color for non-customers
                   hasLiked ? 'error.main' : // Red color if liked and is a customer
                   'rgba(0, 0, 0, 0.54)', // Default color if not liked but is a customer
            "&.Mui-disabled": {
              color: !isCustomer ? 'rgba(0, 0, 0, 0.26)' : // Keep disabled grey if not a customer
                     hasLiked ? 'rgba(255, 0, 0, 0.7)' : // Semi-transparent red if disabled but liked
                     'rgba(0, 0, 0, 0.26)' // Grey color if disabled and not liked
            }
          }}
        >
          {hasLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Grid>
      <Grid item>
        <span style={{ userSelect: 'none' }}>{likes}</span>
      </Grid>
    </Grid>
  );
};

export default LikeButton;
