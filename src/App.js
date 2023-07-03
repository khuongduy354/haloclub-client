import React, { useEffect, useRef, useState } from "react";
import AgoraUIKit, { PropsInterface } from "agora-react-uikit";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import { wsClient } from "./helpers/socketHandler";
const App: React.FunctionComponent = () => {
  const [videocall, setVideocall] = useState(false);
  const [channel, setChannel] = useState("test");
  const [chatSocket, setChatsocket] = useState(null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(uuidv4());
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

    const [videoIds, setVideoIds] = useState([]);
    const [nextPage, setNextPage] = useState("");
    const [prevPage, setPrevPage] = useState("");

    const fetchYoutube = async (pageToken = "") => {
      const somekey = process.env.REACT_APP_YTB_API_KEY;

      const url = `https://www.googleapis.com/youtube/v3/search?key=${somekey}&part=snippet&pageToken=${pageToken}&q=${search}`;
      let result = await fetch(url);
      result = await result.json();

      const _videoIds = result.items.map(
        (item) => "https://www.youtube.com/embed/" + item.id.videoId
      );
      setVideoIds(_videoIds);
      const _nextPage = result.nextPageToken || "";
      const _prevPage = result.prevPageToken || "";
      setNextPage(_nextPage);
      setPrevPage(_prevPage);
    };
    const selectSongHandler = (videoId) => {
      setSong(videoId);
      wsClient(chatSocket, "select_video", { videoId, userId });
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
                    selectSongHandler(videoId);
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
            <div>
              <video ref={videoRef} controls width="640" height="480" />
            </div>
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
  const playVideo = () => {};
  const joinRoom = () => {
    const _chatSocket = new WebSocket(
      process.env.REACT_APP_SOCKET + channel + "/"
    );
    setChatsocket(_chatSocket);

    wsClient(chatSocket, "initialize", { username, user_id: userId });
    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);
    };

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
