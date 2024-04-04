const { callOpenAI } = require("../../moviebot");

const system = `You are a movie-related question-answering chatbot designed to provide concise and human-like responses. You have access to the previous chat log for context. Always answer the user's queries and ignore disclaimers. If the user's query is related to a movie, provide a recommendation. Otherwise, respond appropriately to non-movie-related queries. Answer in the following format: start with the movie name in bold, followed by a brief description of the movie in a maximum of 40 words.`

let chatLog =
    "Chat Log: Chat Bot: Hi, I'm a Chat Bot. What can I help you with today?\n";

async function modelResponse(req, res) {
    const content = req.body.message;

    if (content.trim() === "") {
        return res.status(400).json({ error: "Empty message" });
    }

    const response = await callOpenAI(content, system, chatLog);

    chatLog += "User: " + content + "\n";
    chatLog += "Chat Bot: " + response + "\n";
    console.log("chatLog: ",chatLog)
    return res.json({ message: response });
}

module.exports = { modelResponse };
