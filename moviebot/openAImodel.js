const { OpenAI } = require("openai");
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
}
)
const gptModel = process.env.MODEL;
async function callOpenAI(promptContent, systemContent, previousChat) {
    try {
        const messages = [];
        const userPrompt = {
            role: "user",
            content: promptContent,
        };
        const systemPrompt = {
            role: "system",
            content: systemContent,
        };
        const assistantPrompt = {
            role: "assistant",
            content: previousChat,
        };
        messages.push(userPrompt);
        messages.push(systemPrompt);
        messages.push(assistantPrompt);

        const response = await openai.chat.completions.create({
            model: gptModel,
            messages: messages,
        });
        return response.choices[0]?.message?.content;
    } catch (error) {
        console.error("Error:", error);
        return `An error occurred while processing the request: ${error}`;
    }
}

module.exports = callOpenAI;