import { defineFunction } from '@aws-amplify/backend';

export const anthropicFunction = defineFunction({
    name: 'anthropic-function',
    entry: './handler.ts',
});
