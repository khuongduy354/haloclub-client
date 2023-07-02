export function wsClient(ws, type, payload) {
  ws.send(JSON.stringify({ type, payload }));
}
