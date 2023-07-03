import AgoraUIKit from "agora-react-uikit";
import React, { useEffect, useRef, useState } from "react";
import { SongList } from "./SongList";

function MainView(props) {
  const { setSelectSong, videoRef, agoraProps } = props;
  return (
    // includes: select song button, videos, and main karaoke song (if available)
    <div>
      <button onClick={() => setSelectSong(true)}>Select Song</button>
      <div>
        <video ref={videoRef} controls width="640" height="480" />
      </div>
      <div style={styles.container}>
        <AgoraUIKit
          rtcProps={agoraProps.rtcProps}
          callbacks={agoraProps.callbacks}
        />
      </div>
    </div>
  );
}
export function RoomComponent(props) {
  const [chatSocket, setChatsocket] = useState(null);
  const [selectSong, setSelectSong] = useState(false);
  const [song, setSong] = useState("");

  const { setVideocall, setChannel, channel } = props;
  const agoraProps = {
    rtcProps: {
      appId: process.env.REACT_APP_AGORA_ID,
      channel: channel,
    },
    callbacks: {
      EndCall: () => {
        setVideocall(false);
        setChannel("");
      },
    },
  };

  const videoRef = useRef(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API + "/stream/video?videoId=" + song
        );
        const blob = await response.blob();
        const videoUrl = URL.createObjectURL(blob);
        videoRef.current.src = videoUrl;
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();
  }, []);

  return (
    <React.Fragment>{selectSong ? <SongList /> : <MainView />}</React.Fragment>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
  },
};
