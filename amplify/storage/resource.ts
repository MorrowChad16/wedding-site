import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'wedding-website-jace-alyssa-2026',
    access: (allow) => ({
        'home/*': [allow.guest.to(['read', 'write', 'delete'])],
        'gallery/*': [allow.guest.to(['read', 'write', 'delete'])],
        'story/*': [allow.guest.to(['read', 'write', 'delete'])],
        'travel/*': [allow.guest.to(['read', 'write', 'delete'])],
        'registry/*': [allow.guest.to(['read', 'write', 'delete'])],
        'schedule/*': [allow.guest.to(['read', 'write', 'delete'])],
        'wedding-party/*': [allow.guest.to(['read', 'write', 'delete'])],
    }),
});
