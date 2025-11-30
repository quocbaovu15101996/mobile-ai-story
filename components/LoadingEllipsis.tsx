import React, { useEffect, useState } from 'react';
import type { TextProps } from 'react-native';
import TextApp from './TextApp';

type LoadingEllipsisProps = {
  prefix?: string;
  speed?: number; // Animation speed in milliseconds
  style?: TextProps['style'];
};

const LoadingEllipsis: React.FC<LoadingEllipsisProps> = ({
  prefix = '',
  speed = 500,
  style,
}) => {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots === '.') return '..';
        if (prevDots === '..') return '...';
        return '.';
      });
    }, speed);

    return () => clearInterval(interval);
  }, [speed]);

  return (
    <TextApp style={style}>
      {prefix}
      {dots}
    </TextApp>
  );
};

export default LoadingEllipsis;

