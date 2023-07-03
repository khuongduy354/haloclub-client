import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { RoomComponent } from "./components/RoomComponent";
import { Lobby } from "./components/Lobby";

const App = () => {
  const [videocall, setVideocall] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(uuidv4());
  const [channel, setChannel] = useState("test");

  return (
    <div>
      <label>
        {videocall ? channel : "Type in channel name and Start Call"}
      </label>

      {videocall ? (
        <RoomComponent
          setVideocall={setVideocall}
          setChannel={setChannel}
          channel={channel}
          userId={userId}
          username={username}
        />
      ) : (
        <Lobby
          setChannel={setChannel}
          setVideocall={setVideocall}
          setUsername={setUsername}
        />
      )}
    </div>
  );
};

export default App;
