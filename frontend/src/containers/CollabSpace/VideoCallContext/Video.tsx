// Ref: https://www.youtube.com/watch?v=IkNaQZG2Now

/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef } from 'react';

interface IVideoProps {
  stream: MediaStream;
  className?: string;
}

export default function Video({ stream, className } : IVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, className]);
  return (
    <div>
      {
        className === 'me'
          ? (
            <div className={className}>
              <video playsInline ref={videoRef} autoPlay muted />
            </div>
          ) : (
            <div className={className}>
              <video playsInline ref={videoRef} autoPlay />
            </div>
          )
      }
    </div>
  );
}
