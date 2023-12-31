import AgoraUIKit from "agora-react-uikit";
import React, { useEffect, useState } from "react";
import { SongList } from "./SongList";
import { connect_socket, wsClient } from "../helpers/socketHandler";

function MainView(props) {
  const {
    song,
    setSelectSong,
    agoraProps,
    userId,
    singer,
    rating,
    setRating,
    chatSocket,
  } = props;
  const [rated, setRated] = useState(false);
  const [ratedScore, setRatedscore] = useState(0);
  return (
    // includes: select song button, videos, and main karaoke song (if available)
    <div>
      <button onClick={() => setSelectSong(true)}>Select Song</button>
      <div>
        {song != "" && userId == singer && (
          <div>
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
            <button
              onClick={() => {
                wsClient(chatSocket, "start_rating", {
                  score: 0,
                  user_id: userId,
                });
              }}
            >
              Finish Singing
            </button>
          </div>
        )}
        {rating && (
          <div>
            <input
              type="number"
              onChange={(e) => {
                setRatedscore(e.target.value);
              }}
            />
            <button
              onClick={() => {
                wsClient(chatSocket, "start_rating", {
                  user_id: userId,
                  score: ratedScore,
                });
                setRated(true);
              }}
            >
              Send score
            </button>
            {/* <button
              onClick={() => {
                setRating(false);
              }}
            >
              Back
            </button> */}
            {singer == userId && (
              <button
                onClick={() =>
                  wsClient(chatSocket, "finish_rating", {
                    user_id: userId,
                  })
                }
              >
                Finish rating
              </button>
            )}
          </div>
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

  const [ratingCount, setRatingcount] = useState(0);
  const [rating, setRating] = useState(false);
  const [chatSocket, setChatsocket] = useState(null);
  const [selectSong, setSelectSong] = useState(false);
  const [song, setSong] = useState("");

  const [singer, setSinger] = useState("");
  const [singerName, setSingername] = useState("");

  const resetToNewRound = () => {
    setRating(false);
    setSelectSong(false);
    setSong("");
    setSinger("");
    setSingername("");
  };
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

  useEffect(() => {
    let _chatsocket = connect_socket(username, userId, channel);
    _chatsocket.onclose = function (e) {
      setVideocall(false);
    };
    setChatsocket(_chatsocket);
  }, []);

  useEffect(() => {
    if (chatSocket) {
      chatSocket.onmessage = function (e) {
        //handlers
        let result = JSON.parse(e.data);
        let event_type = result.event_type;
        switch (event_type) {
          case "initialize":
            alert(`${result.new_user.username} joined the room`);
            break;
          case "select_video":
            alert(`${result.singer_name} selected the song!`);
            setSinger(result.user_id);
            setSingername(result.singer_name);
            if (singer == userId) {
              setSong(result.video_id);
              setSelectSong(false);
            }
            break;
          case "start_rating":
            alert(`${result.singer_name} finished singing, let start rating!`);
            setRating(true);
            setSong("");
            break;
          case "rating":
            alert(
              `${username} rated ${result.rate_for.username} ${result.rated_score} points!`
            );
            setRatingcount(ratingCount + 1);
            break;
          case "finish_rating":
            setRating(false);
            alert(
              `${result.current_singer.username} got ${result.current_singer.score} points!`
            );

            let next = result.next_singer;
            setSinger(next.user_id);
            setSingername(next.username);
            setSong("");
            alert("Next singer is " + next.username);
            break;
          case "finish_game":
            alert(`${result.winner.username} is the winner`);
            alert(
              `${result.winner.username} got a total of ${result.winner.score}`
            );
            resetToNewRound();
            break;
        }
      };
    }
  }, [chatSocket]);

  return (
    <React.Fragment>
      {selectSong ? (
        <SongList
          ws={chatSocket}
          setSelectSong={setSelectSong}
          setSong={setSong}
          userId={userId}
        />
      ) : (
        <MainView
          setSelectSong={setSelectSong}
          agoraProps={agoraProps}
          chatSocket={chatSocket}
          song={song}
          userId={userId}
          singer={singer}
          rating={rating}
          setRating={setRating}
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
