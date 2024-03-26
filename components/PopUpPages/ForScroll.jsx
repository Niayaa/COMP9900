import { IconButton } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

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
  }); // 添加 ref.current 到依赖项数组中

  const frameStyle = {
    // border: '1px solid #ccc',
    borderRadius: '8px',
    height: '600px',
    overflowY: 'auto',
  };

  const contentStyle = {
    padding: '8px',
  };

  return (
    <div style={frameStyle} ref={ref}>
      <div style={contentStyle}>
        {children}
        <IconButton
            style={{
            position: "fixed",
            bottom: 10,
            right: 10,
            display: pos ? "block" : "none"
            }}
            onClick={handleTop}
        >
            Up
        </IconButton>
      </div>
    </div>
  );
}

export default ScrollableFrame;
