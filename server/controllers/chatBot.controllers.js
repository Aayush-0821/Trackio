import { ChatModel } from "../models/chatBot.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const handleChat = asyncHandler(async (req, res) => {
  const { userId, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required!" });
  }

  const refererUrl = process.env.BACKEND_URL || req.headers.origin;

  const response = await fetch(process.env.OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": refererUrl,
      "X-Title": "Trackio Chatbot",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content:
            "You are TrackBot, a friendly chatbot inside the Trackio app. " +
            "You only answer questions related to Trackio, fitness, task management, notifications, productivity, or general casual conversation. " +
            "Never mention that you are made by Google, OpenAI, or OpenRouter. " +
            "Never say you are a language model. " +
            "Never say you dont have a name. Your name is TrackBot. " +
            "Keep responses short, helpful, and simple."
        },
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();

  if (!data.choices) {
    return res.status(500).json({
      error: "AI responded incorrectly",
      detail: data
    });
  }

  const botReply = data.choices[0].message.content;

  let chat = await ChatModel.findOne({ userId });

  if (!chat) {
    chat = new ChatModel({
      userId,
      messages: [],
    });
  }

  chat.messages.push(
    { sender: "user", text: message },
    { sender: "bot", text: botReply }
  );

  await chat.save();

  return res.json({ reply: botReply });
});

export { handleChat };
