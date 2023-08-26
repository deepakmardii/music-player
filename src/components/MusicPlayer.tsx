// MusicPlayer.tsx
import React, { useState, useRef, useEffect } from "react";
// import "./MusicPlayer.css";

interface Song {
  title: string;
  fileName: string;
  imageUrl: string;
}

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<Song | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seekBarRef = useRef<HTMLInputElement | null>(null);

  const musicFiles: Song[] = [
    {
      title: "Song 1",
      fileName: "song1.mp3",
      imageUrl: "/images/song1.jpg",
    },
    {
      title: "Song 2",
      fileName: "song2.mp3",
      imageUrl: "/images/song2.jpg",
    },
    {
      title: "Song 3",
      fileName: "song3.mp3",
      imageUrl: "/images/song3.jpg",
    },
  ];

  useEffect(() => {
    if (musicFiles.length > 0) {
      setSelectedFile(musicFiles[0]);
      if (audioRef.current) {
        audioRef.current.src = `/music/${musicFiles[0].fileName}`;
      }
    }

    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", () => {
        setCurrentTime(audioRef.current ? audioRef.current.currentTime : 0);
      });
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current ? audioRef.current.duration : 0);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playSelectedFile = (song: Song) => {
    if (audioRef.current) {
      audioRef.current.src = `/music/${song.fileName}`;
      audioRef.current.load();
      audioRef.current.play();
      setIsPlaying(true);
      setSelectedFile(song);

      // Start image rotation animation
      setIsRotating(true);

      // Remove the rotation class after the animation is complete
      setTimeout(() => {
        setIsRotating(false);
      }, 500); // Adjust the duration to match the CSS transition duration
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleSeekBarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseFloat(event.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Music Player</h1>
        <audio ref={audioRef} src="" className="hidden" />

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <div
              className={`mt-4 mx-auto rounded-full overflow-hidden w-36 h-36 ${
                isPlaying ? "rotate" : ""
              } ${isRotating ? "rotating" : ""}`}
            >
              <img
                src={selectedFile ? selectedFile.imageUrl : ""}
                alt={selectedFile ? selectedFile.title : ""}
                width="150"
                height="150"
                className={`w-full h-full transform hover:scale-110 transition-transform duration-500 ${
                  isPlaying ? "rotate" : ""
                }`}
              />
            </div>
            <p className="text-lg mt-4 text-center">
              {selectedFile
                ? `Now Playing: ${selectedFile.title}`
                : "Select a song to play:"}
            </p>
          </div>
          <div className="w-full">
            <ul className="space-y-2 h-full flex flex-col justify-center">
              {musicFiles.map((song, index) => (
                <li key={index}>
                  <button
                    onClick={() => playSelectedFile(song)}
                    className="bg-blue-500 text-white px-4 py-2 w-full rounded-lg hover:bg-blue-600 focus:outline-none"
                  >
                    {song.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <p className="text-lg">{formatTime(currentTime)}</p>
            <button
              onClick={togglePlay}
              className={`bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 focus:outline-none ${
                isPlaying ? "animate-pulse" : ""
              }`}
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <p className="text-lg">{formatTime(duration)}</p>
          </div>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSeekBarChange}
            ref={seekBarRef}
            className="w-full mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
