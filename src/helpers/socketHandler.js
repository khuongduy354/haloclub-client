export function wsClient(ws, type, payload) {
  ws.send(JSON.stringify({ type, payload }));
}

export function connect_socket(username, userId, channel) {
  const chatSocket = new WebSocket(
    process.env.REACT_APP_SOCKET + channel + "/"
  );

  wsClient(chatSocket, "initialize", { username, user_id: userId });
  chatSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
  };

  chatSocket.onclose = function (e) {
    console.error("Chat socket closed unexpectedly");
    alert("Disconnected from chat");
  };
  return chatSocket;
}

// initialize {user_id, username}
// select_video {video_id, user_id}
// start_rating {score, user_id}
// finish_rating {user_id}

// userItem={
//   "user_id": 1,
//   "username": "user1"
//   "score": 5,
//   "ratedThisRound": false,
//   "isSinging": false,
// }

//response
// initialize {event_type:"initialize", "userList": array[userItem]}
// select_video {event_type:"select_video",video_id, user_id}
// start_rating {event_type:"start_rating", user_id,score,allowRating}
// rating {event_type:"rating", user_id, rate_for,rated_score}
// finish_rating {event_type:"finish_rating", user_id,next_singer,total_scores}
// finish_game {event_type:"finish_game", winner,quotes,userList:array[userItem]}
