export function Lobby(props) {
  const { setUsername, setChannel, setVideocall } = props;
  return (
    <div>
      <input
        placeholder="Channel name"
        type="text"
        onChange={(e) => setChannel(e.target.value)}
      />
      <input
        placeholder="Username"
        type="text"
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={() => setVideocall(true)}>Start Call</button>
    </div>
  );
}
