import { useState } from "react";
import { fetchYoutube } from "../helpers/youtubeHandler";
import { wsClient } from "../helpers/socketHandler";

export function SongList(props) {
  const { setSelectSong, setSong, ws, userId } = props;
  const [search, setSearch] = useState("");
  const [videoIds, setVideoIds] = useState([]);
  const [nextPage, setNextPage] = useState("");
  const [prevPage, setPrevPage] = useState("");

  function ToolPanel(props) {
    const { setSelectSong, prevPage, nextPage, setSearch, search } = props;
    return (
      <div>
        <button onClick={() => setSelectSong(false)}>Back</button>
        <button
          onClick={async () => {
            await searchHandler(prevPage);
          }}
        >
          Prev
        </button>
        <button
          onClick={async () => {
            await searchHandler(nextPage);
          }}
        >
          Next
        </button>
        <input
          value={search}
          type="text"
          autoFocus
          onChange={(e) => {
            e.preventDefault();
            setSearch(e.target.value);
          }}
        />
      </div>
    );
  }
  const TheList = () => {
    return videoIds.map((videoId) => (
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
    ));
  };

  const selectSongHandler = (videoId) => {
    setSong(videoId);
    // wsClient(ws, "select_video", { video_id: videoId, user_id: userId });
  };
  const searchHandler = async (pageToken = "") => {
    const {
      videoEmbeds,
      nextPage: _nextPage,
      prevPage: _prevPage,
    } = await fetchYoutube(pageToken, search);
    setVideoIds(videoEmbeds);
    setNextPage(_nextPage);
    setPrevPage(_prevPage);
  };
  return (
    <div>
      <ToolPanel
        setSelectSong={setSelectSong}
        search={search}
        setSearch={setSearch}
        nextPage={nextPage}
        prevPage={prevPage}
      />
      <button onClick={() => searchHandler()}>Search</button>
      <TheList />
    </div>
  );
}
