import AgoraUIKit from "agora-react-uikit";
import React, { useEffect, useRef, useState } from "react";
import { SongList } from "./SongList";
import { connect_socket, wsClient } from "../helpers/socketHandler";

function MainView(props) {
  const { setSelectSong, videoRef, agoraProps } = props;
  return (
    // includes: select song button, videos, and main karaoke song (if available)
    <div>
      <button onClick={() => setSelectSong(true)}>Select Song</button>
      <div>
        {videoRef.current != null && (
          <video ref={videoRef} controls width="640" height="480" />
        )}
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
  const { username, userId, setVideocall, setChannel, channel } = props;

  const [chatSocket, setChatsocket] = useState(null);
  const [selectSong, setSelectSong] = useState(false);
  const [song, setSong] = useState("");

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
    // let _chatsocket = connect_socket(username, userId, channel);
    // setChatsocket(_chatsocket);
    // wsClient(chatSocket, "initialize", { username, user_id: userId });
    // alert("welcome to the room");
  }, []);

  useEffect(() => {
    //handlers
  }, []);

  return (
    <React.Fragment>
      {selectSong ? (
        <SongList setSelectSong={setSelectSong} setSong={setSong} />
      ) : (
        <MainView
          setSelectSong={setSelectSong}
          agoraProps={agoraProps}
          videoRef={videoRef}
        />
      )}
    </React.Fragment>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
  },
};
