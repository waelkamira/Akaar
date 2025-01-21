// components/VideoPlayer.js
import { useRef } from 'react';

export default function VideoPlayer() {
  const videoRef = useRef(null);

  const togglePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
  };

  const toggleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.mozRequestFullScreen) {
      // Firefox
      videoRef.current.mozRequestFullScreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      // Chrome, Safari, and Opera
      videoRef.current.webkitRequestFullscreen();
    } else if (videoRef.current.msRequestFullscreen) {
      // IE/Edge
      videoRef.current.msRequestFullscreen();
    }
  };

  return (
    <div className="relative max-w-lg mx-auto">
      <video
        ref={videoRef}
        className=" shadow-sm shadow-gray-300  w-full"
        controls
        controlsList="nodownload"
        src="https://cdn.arteenz.com/75441e2b95254493ab02a4e94d7710e9:arteenz/001/a7lam_wa_fra7/a7lam_wa_fra7_01.mp4"
      />

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4 p-2 bg-gray-800 bg-opacity-70 rounded-b-lg">
        <button
          onClick={togglePlayPause}
          className="text-white p-2 rounded-xl bg-blue-600 hover:bg-blue-500 focus:outline-none"
        >
          ⏯️
        </button>
        <button
          onClick={toggleMute}
          className="text-white p-2 rounded-xl bg-yellow-600 hover:bg-yellow-500 focus:outline-none"
        >
          🔇
        </button>
        <button
          onClick={toggleFullscreen}
          className="text-white p-2 rounded-xl bg-green-600 hover:bg-green-500 focus:outline-none"
        >
          ⛶
        </button>
      </div>
    </div>
  );
}
