export class SocketHandler {
  // {"userId":setUserId}
  constructor(ws, payload) {
    this.ws = ws;
    this.payload = payload;
  }
    //   if action == "initialize":
    //     payload = {"user_id": user["user_id"], "username": user["username"]}
    // if action == "select_video":
    //     payload = {"video_id": user["video_id"], "user_id": user["user_id"]}
    // if action == "start_rating":
    //     payload = {"score": user["rateOther"], "user_id": user["user_id"]}
    // if action == "finish_rating":
    //     payload = {"user_id": user["user_id"]}

  send_message  (type){
    newpayload = {}
    match (type) {
      case "initialize":
        newpayload["user_id"] = this.payload["user_id"]
        newpayload["username"] = this.payload["username"]
        break;
      case "select_video":
        newpayload["video_id"] = this.payload["video_id"]
        newpayload["user_id"] = this.payload["user_id"] 
        break;
      case "start_rating": 
        newpayload["score"] = this.payload["rate_other"]
        newpayload["user_id"] = this.payload["user_id"]
        break;
      case "finish_rating":
        newpayload["user_id"] = this.payload["user_id"]
        break;
    }
    this.ws.send(JSON.stringify({type:type, payload:newpayload}));
}
}
