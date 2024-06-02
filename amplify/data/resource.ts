import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
    Relationship: a.enum(['PRIMARY_GUEST', 'SECONDARY_GUEST', 'PLUS_ONE', 'CHILD']),
    Status: a.enum(['NOT_ATTENDING', 'ATTENDING', 'COMING']),
    Food: a.enum(['MEAT', 'FISH', 'VEGETARIAN']),

    Guest: a
        .model({
            email: a.email().required(),
            guestId: a.id().required(),
            relationship: a.ref('Relationship').required(),
            phoneNumber: a.phone().required(),
            firstName: a.string().required(),
            lastName: a.string().required(),
            status: a.ref('Status').required(),
            foodChoice: a.ref('Food'),
            foodAllergies: a.string(),
            songRequests: a.string(),
        })
        .identifier(['email', 'guestId'])
        .authorization((allow) => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'identityPool',
    },
});
