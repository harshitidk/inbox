import React from 'react';

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ className, style }) => {
  return (
    <img
      src="/Assets/logo/Inbox-White-Tagline.png"
      alt="INBOX. The Printing & Packaging Company"
      className={className}
      style={{ display: 'block', height: 'auto', ...style }}
    />
  );
};

export default Logo;
