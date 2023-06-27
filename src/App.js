import React, { useState } from "react";
import AgoraUIKit, { PropsInterface } from "agora-react-uikit";
import { WebSocketServer } from "ws";
import { uuidv4 } from "uuid";
import { SocketHandler } from "./helpers/socketHandler";

const App: React.FunctionComponent = () => {
  const [videocall, setVideocall] = useState(false);
  const [channel, setChannel] = useState("test");
  const props: PropsInterface = {
    rtcProps: {
      appId: process.env.REACT_APP_AGORA_ID,
      channel: channel,
      token: null, // pass in channel token if the app is in secure mode
    },
    callbacks: {
      EndCall: () => {
        setVideocall(false);
        setChannel("");
      },
    },
  };

  const RoomComponent = () => {
    const [search, setSearch] = useState("");
    const [selectSong, setSelectSong] = useState(false);
    const [song, setSong] = useState("");
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState(uuidv4());

    const [videoIds, setVideoIds] = useState([]);
    const [nextPage, setNextPage] = useState("");
    const [prevPage, setPrevPage] = useState("");

    const fetchYoutube = async (pageToken = "") => {
      const somekey = process.env.REACT_APP_YTB_API_KEY;
      const url = `https://www.googleapis.com/youtube/v3/search?key=${somekey}&part=snippet&pageToken=${pageToken}&q=`;
      let result = await fetch(url + search);
      result = await result.json();
      const _videoIds = result.items.map(
        (item) => "https://www.youtube.com/embed/" + item.id.videoId
      );
      console.log(_videoIds);
      setVideoIds(_videoIds);
      const _nextPage = result.nextPageToken || "";
      const _prevPage = result.prevPageToken || "";
      setNextPage(_nextPage);
      setPrevPage(_prevPage);
    };
    return (
      <React.Fragment>
        {selectSong ? (
          <div>
            <button onClick={() => setSelectSong(false)}>Back</button>
            <button
              onClick={() => {
                fetchYoutube(prevPage);
              }}
            >
              Prev
            </button>
            <button
              onClick={() => {
                fetchYoutube(nextPage);
              }}
            >
              Next
            </button>
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for youtube song"
            />
            <button onClick={() => fetchYoutube()}>Search</button>
            {videoIds.map((videoId) => (
              <div>
                <button
                  onClick={() => {
                    setSong(videoId); //TODO: fetch here
                    setSelectSong(false);
                  }}
                >
                  Select
                </button>
                <iframe
                  width="560"
                  height="315"
                  src={videoId}
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                  onClick={() => {
                    alert("Song Selected");
                  }}
                ></iframe>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <button onClick={() => setSelectSong(true)}>Select Song</button>
            <div style={styles.container}>
              <AgoraUIKit
                rtcProps={props.rtcProps}
                callbacks={props.callbacks}
              />
            </div>
          </div>
        )}
      </React.Fragment>
    );
  };
  const joinRoom = () => {
    const chatSocket = new WebSocket(
      process.env.REACT_APP_SOCKE + channel + "/"
    );

    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);
    };
    const socketHandler = new SocketHandler(chatSocket);
    switch (data.type) {
      case "initialize":
        socketHandler.initialize(userId, username);
        break;
      case "select_video":
    }

    chatSocket.onclose = function (e) {
      console.error("Chat socket closed unexpectedly");
      alert("Disconnected from chat");
    };

    setVideocall(true);
  };
  return (
    <div>
      <label>
        {videocall ? channel : "Type in channel name and Start Call"}
      </label>
      {!videocall ? (
        <input type="text" onChange={(e) => setChannel(e.target.value)} />
      ) : null}
      {videocall ? (
        <RoomComponent />
      ) : (
        <button onClick={() => joinRoom()}>Start Call</button>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
  },
};

export default App;
