export function Lobby(props) {
  const { setChannel, setVideocall } = props;
  const joinRoom = () => {
    setVideocall(true);
  };
  return (
    <div>
      <input type="text" onChange={(e) => setChannel(e.target.value)} />
      <button onClick={() => joinRoom()}>Start Call</button>
    </div>
  );
}
