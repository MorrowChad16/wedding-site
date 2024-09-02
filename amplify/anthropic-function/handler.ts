import Anthropic from '@anthropic-ai/sdk';
import { TextBlock } from '@anthropic-ai/sdk/resources/messages.mjs';
import { Schema } from '../data/resource';

const anthropic = new Anthropic({
    apiKey: process.env.VITE_CLAUDE_API_KEY,
});

export const handler: Schema['askWeddingQuestion']['functionHandler'] = async (event) => {
    try {
        const { context, question } = event.arguments;

        // Call the Anthropic API
        const msg = await anthropic.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 300,
            temperature: 0.5,
            system: context!,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: question!,
                        },
                    ],
                },
            ],
        });

        console.log(msg.content);
        return (msg.content[0] as TextBlock).text;
    } catch (error) {
        return "I'm sorry, I encountered an error while processing your question. Please try again later or contact the wedding organizer for assistance.";
    }
};
