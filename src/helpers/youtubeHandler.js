export const fetchYoutube = async (pageToken = "", search = "") => {
  const somekey = process.env.REACT_APP_YTB_API_KEY;

  const url = `https://www.googleapis.com/youtube/v3/search?key=${somekey}&part=snippet&pageToken=${pageToken}&q=${search}`;
  let result = await fetch(url);
  result = await result.json();

  const videoEmbeds = result.items.map(
    (item) => "https://www.youtube.com/embed/" + item.id.videoId
  );
  const nextPage = result.nextPageToken || "";
  const prevPage = result.prevPageToken || "";

  return { videoEmbeds, nextPage, prevPage };
};
