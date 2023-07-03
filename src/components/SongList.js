import { useState } from "react";
import { fetchYoutube } from "../helpers/youtubeHandler";
export function SongList(props) {
  const { setSelectSong, setSong } = props;
  const [search, setSearch] = useState("");
  const [videoIds, setVideoIds] = useState([]);
  const [nextPage, setNextPage] = useState("");
  const [prevPage, setPrevPage] = useState("");

  const ToolPanel = () => {
    return (
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
      </div>
    );
  };
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
  };
  return (
    <div>
      <ToolPanel />
      <button onClick={() => fetchYoutube()}>Search</button>
      <TheList />
    </div>
  );
}
