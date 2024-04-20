import { IconButton } from "@mui/material";
import UpIcon from "@mui/icons-material/KeyboardArrowUp";
import React, { useEffect, useRef, useState } from "react";

const ScrollableFrame = ({ children }) => {
  const ref = useRef();

  const [pos, setPos] = useState(false);

  const handleTop = () => {
    ref.current.scrollTop = 0;
    setPos(false);
  };

  const handleScroll = () => {
    if (ref.current.scrollTop > 50) {
      if (!pos) setPos(true);
    } else {
      if (pos) setPos(false);
    }
  };

  useEffect(() => {
    const temp = ref.current;
    temp.addEventListener("scroll", handleScroll);
    return () => temp.removeEventListener("scroll", handleScroll);
  });

  const frameStyle = {
    // border: '1px solid #ccc',
    borderRadius: "8px",
    height: "600px",
    overflowY: "auto",
  };

  const contentStyle = {
    padding: "8px",
  };

  return (
    <div style={frameStyle} ref={ref}>
      <div style={contentStyle}>
        {children}
        <UpIcon
          sx={{
            position: { xs: "absolute", md: "absolute" }, // Use absolute for xs and fixed for md and up
            bottom: { xs: "50%", md: "50%" },
            right: { xs: "50%", md: "50%" },
            transform: {xs:"translate(-50%, -50%)",  md:"translate(-100%, -30%)"},
            color: "common.black",
            bgcolor: "white",
            width: 40,
            height: 40,
            borderRadius: "50%",
            "&:hover": {
              bgcolor: "darkgrey",
            },
          }}
          style={{
            position: "fixed",
            margin: "auto",
            bottom: 20,
            right: 10,
            display: pos ? "block" : "none",
          }}
          onClick={handleTop}
        />
      </div>
    </div>
  );
};

export default ScrollableFrame;
