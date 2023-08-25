import React, { useState, useRef, useEffect } from "react";

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
      if (selectedFile === song && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.src = `/music/${song.fileName}`;
        audioRef.current.load();
        setIsPlaying(true);
        setSelectedFile(song);
      }
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
    <div>
      <h1>Music Player</h1>
      <audio ref={audioRef} src="" />
      <div>
        <p>
          {selectedFile
            ? `Now Playing: ${selectedFile.title}`
            : "Select a song to play:"}
        </p>
        <img
          src={selectedFile ? selectedFile.imageUrl : ""}
          alt={selectedFile ? selectedFile.title : ""}
          width="150"
          height="150"
        />
        <ul>
          {musicFiles.map((song, index) => (
            <li key={index}>
              <button onClick={() => playSelectedFile(song)}>
                {song.title}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
      </div>
      <div>
        <p>{formatTime(currentTime)}</p>
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleSeekBarChange}
          ref={seekBarRef}
        />
        <p>{formatTime(duration)}</p>
      </div>
    </div>
  );
};

export default MusicPlayer;
