import React, { useState } from 'react';
import './Accountform.css'; 

const AccountForm = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const toggleTag = (tag) => {
      setSelectedTags(prevSelectedTags =>
        prevSelectedTags.includes(tag)
          ? prevSelectedTags.filter(t => t !== tag)
          : [...prevSelectedTags, tag]
      );
  };
  const tags = ['Event type 1', 'Event type 2', 'Event type 3'];
// 组件状态，用于跟踪按钮是否被点击
  const [isClicked, setIsClicked] = useState(false);

  // 处理按钮点击事件
  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  // 根据isClicked状态，计算按钮的className
  const buttonClassName = isClicked ? 'button clicked' : 'button';

  return (
    <div className="account-form-container">
      <div className="form-section left-section">
        <h2>Account Information</h2>
        <form>
          <label>
            First Name*
            <input type="text" />
          </label>
          <label>
            Last Name*
            <input type="text" />
          </label>
          <label>
            Email Address
            <input type="email" />
          </label>
          <label>
            Password
            <input type="password" />
          </label>
          <button className={buttonClassName} onClick={handleClick}>Edit</button>
        </form>
      </div>

      <div className="vertical-line"></div>

      <div className="form-section right-section">
        <label>
          Organization Address
          <input type="tel" />
        </label>
        <label>
          Organization Name
          <input type="text" />
        </label>
      </div>
    </div>
  );
};

export default AccountForm;