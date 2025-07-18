import React, { memo } from 'react';
import { Link } from 'react-router-dom';

interface CustomLinkProps {
  link: string;
  label: string;
  mini?: boolean;
  className?: string;
}

const CustomLink: React.FC<CustomLinkProps> = ({ link, label, mini, className }) => {
  if (mini) {
    return (
      <Link to={link} className={`text-sm text-blue-600 hover:text-blue-800 ${className || ''}`}>
        {label}
      </Link>
    );
  }

  return (
    <Link to={link} className={`text-base text-blue-600 hover:text-blue-800 ${className || ''}`}>
      {label}
    </Link>
  );
};

export const MemoizedCustomLink = memo(CustomLink);
