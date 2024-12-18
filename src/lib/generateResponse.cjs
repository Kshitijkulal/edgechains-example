import { OpenAI } from "@arakoodev/edgechains.js/openai";

async function openAICall({ prompt, openAIApiKey }) {
    try {
        const openai = new OpenAI({ apiKey: openAIApiKey });
        const response = await openai.chat({ prompt, max_tokens: 2000 });
        return JSON.stringify(response.content);
    } catch (error) {
        return error;
    }
}

module.exports = openAICall;
