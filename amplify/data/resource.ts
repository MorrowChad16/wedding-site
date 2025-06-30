import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { anthropicFunction } from '../anthropic-function/resource';

const schema = a.schema({
    GuestType: a.enum(['PRIMARY', 'PLUS_ONE', 'CHILD']),
    AttendanceStatus: a.enum(['DECLINED', 'PENDING', 'ATTENDING']),
    FoodChoice: a.enum(['BEEF', 'CHICKEN', 'VEGETARIAN']),

    WeddingGuests: a
        .model({
            // UUID
            guestId: a.id().required(),
            // Shared party email
            email: a.email().required(),
            guestType: a.ref('GuestType').required(),
            // GSI used for logging in to view details
            fullName: a.string().required(),
            address: a.string().required(),
            attendanceStatus: a.ref('AttendanceStatus').required(),
            foodChoice: a.ref('FoodChoice'),
            dietaryRestrictions: a.string(),
            songRequests: a.string(),
            isBridalParty: a.boolean().default(false),
            isOfDrinkingAge: a.boolean().default(false),
        })
        .identifier(['guestId'])
        .secondaryIndexes((index) => [
            index('email'), // GSI for party lookup
            index('fullName'), // GSI for login lookup
        ])
        .authorization((allow) => [allow.guest()]),

    FrequentlyAskedQuestions: a
        .model({
            id: a.id().required(),
            question: a.string().required(),
            answer: a.string().required(),
            isVisible: a.boolean().default(false),
        })
        .identifier(['id'])
        .authorization((allow) => [allow.guest()]),

    askWeddingQuestion: a
        .query()
        .arguments({
            context: a.string(),
            question: a.string(),
        })
        .returns(a.string())
        .handler(a.handler.function(anthropicFunction))
        .authorization((allow) => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'identityPool',
    },
});
