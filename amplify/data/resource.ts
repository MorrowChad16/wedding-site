import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
    Relationship: a.enum(['PRIMARY_GUEST', 'SECONDARY_GUEST', 'PLUS_ONE', 'CHILD']),
    Status: a.enum(['NOT_ATTENDING', 'ATTENDING', 'COMING']),
    Food: a.enum(['MEAT', 'FISH', 'VEGETARIAN']),

    Guest: a
        .model({
            email: a.email().required(),
            partyId: a.id(),
            party: a.belongsTo('Party', 'partyId'),
            relationship: a.ref('Relationship'),
            phoneNumber: a.phone(),
            firstName: a.string(),
            lastName: a.string(),
            status: a.ref('Status'),
            foodChoice: a.ref('Food'),
            foodAllergies: a.string(),
            songRequests: a.string(),
        })
        .identifier(['email'])
        .authorization((allow) => [allow.guest()]),

    Party: a
        .model({
            guests: a.hasMany('Guest', 'partyId'),
        })
        .authorization((allow) => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'iam',
    },
});
