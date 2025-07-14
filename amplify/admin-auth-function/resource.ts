import { defineFunction, secret } from '@aws-amplify/backend';

export const adminAuthFunction = defineFunction({
    name: 'admin-auth',
    entry: './handler.ts',
    environment: {
        JACE_ALYSSA_WEDDING_2026_ADMIN: secret('JaceAlyssaAdminCreds'),
    },
});
