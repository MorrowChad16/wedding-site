import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { anthropicFunction } from './anthropic-function/resource';

defineBackend({
    auth,
    data,
    anthropicFunction,
});
