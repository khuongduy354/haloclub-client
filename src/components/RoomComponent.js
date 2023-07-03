import AgoraUIKit from "agora-react-uikit";
import React, { useEffect, useRef, useState } from "react";
import { SongList } from "./SongList";
import { connect_socket, wsClient } from "../helpers/socketHandler";

function MainView(props) {
  const { song, setSelectSong, videoRef, agoraProps } = props;
  return (
    // includes: select song button, videos, and main karaoke song (if available)
    <div>
      <button onClick={() => setSelectSong(true)}>Select Song</button>
      <div>
        {song != "" && (
          <iframe
            id="video"
            width="560"
            height="315"
            src={song}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
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
    let _chatsocket = connect_socket(username, userId, channel);
    setChatsocket(_chatsocket);
  }, []);

  useEffect(() => {
    if (chatSocket) {
      chatSocket.onmessage = function (e) {
        let event_type = e.data.event_type;
        switch (event_type) {
          case "select_video":
            setSong(e.data.videoId);
            videoRef.current = "https://www.youtube.com/embed/" + song;
            setSelectSong(false);
            break;
        }
      };
    }
  }, [chatSocket]);

  return (
    <React.Fragment>
      {selectSong ? (
        <SongList setSelectSong={setSelectSong} setSong={setSong} />
      ) : (
        <MainView
          setSelectSong={setSelectSong}
          agoraProps={agoraProps}
          videoRef={videoRef}
          song={song}
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
