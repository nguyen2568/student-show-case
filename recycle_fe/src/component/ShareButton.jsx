import React from "react";

const FacebookShareButton = ({username}) => {
  const shareUrl = "https://www.facebook.com/sharer/sharer.php?u=" +
    encodeURIComponent(`https://api.recyclebox.rocks/share/milestone/${username}`);

  const handleShare = () => {
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <button onClick={handleShare} className="text-blue-500">
      Share Your Milestone on Facebook
    </button>
  );
};

export default FacebookShareButton;