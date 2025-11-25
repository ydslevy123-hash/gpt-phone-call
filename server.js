import express from "express";
import dotenv from "dotenv";
import http from "http";
import { WebSocketServer } from "ws";   // ✅ fixed import
import twilio from "twilio";

dotenv.config();

const { VoiceResponse } = twilio;

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });  // ✅ fixed usage

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.post("/twiml", (req, res) => {
  const twiml = new VoiceResponse();
  twiml.say("Connecting you to GPT...");
  twiml.connect().stream({
    url: "wss://gpt-phone-call.onrender.com/voice-stream"
  });

  res.type("text/xml");
  res.send(twiml.toString());
});

wss.on("connection", (ws) => {
  console.log("🔊 Twilio stream connected");

  ws.on("message", async (msg) => {
    // TODO: Handle audio chunks, send to Whisper + GPT, return audio
    console.log("🎧 Received audio chunk:", msg.length);
  });

  ws.on("close", () => {
    console.log("❌ Twilio stream disconnected");
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Server running");
});
