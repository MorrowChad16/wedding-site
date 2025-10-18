import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { adminAuthFunction } from './admin-auth-function/resource';
import { storage } from './storage/resource';

defineBackend({
    auth,
    data,
    adminAuthFunction,
    storage,
});
