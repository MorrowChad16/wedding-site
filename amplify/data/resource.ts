import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { anthropicFunction } from '../anthropic-function/resource';
import { adminAuthFunction } from '../admin-auth-function/resource';

const schema = a.schema({
    GuestType: a.enum(['PRIMARY', 'PLUS_ONE', 'CHILD']),
    AttendanceStatus: a.enum(['DECLINED', 'PENDING', 'ATTENDING']),
    FoodChoice: a.enum(['BEEF', 'CHICKEN', 'VEGETARIAN']),
    LocationType: a.enum(['EVENT', 'CEREMONY', 'RECEPTION', 'ACTIVITY']),
    Attire: a.enum(['CASUAL', 'SEMI_FORMAL', 'FORMAL']),
    RegistrySection: a.enum(['FUNDS', 'REGISTRIES']),
    TravelCategory: a.enum([
        'HOTEL',
        'AIRBNB',
        'AIRPORT',
        'TRANSPORTATION',
        'RESTAURANT',
        'BAR',
        'BREWERY',
        'PARK',
        'GOLF',
        'CEREMONY_VENUE',
    ]),

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
            isAdmin: a.boolean().default(false),
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

    ScheduleItems: a
        .model({
            id: a.id().required(),
            uid: a.string().required(),
            startTime: a.datetime().required(),
            endTime: a.datetime().required(),
            title: a.string().required(),
            description: a.string(),
            locationName: a.string().required(),
            location: a.string().required(),
            coordinatesLat: a.float().required(),
            coordinatesLng: a.float().required(),
            type: a.ref('LocationType').required(),
            iconAsset: a.string().required(),
            formality: a.ref('Attire').required(),
            isPrivate: a.boolean().default(false),
            isVisible: a.boolean().default(true),
        })
        .identifier(['id'])
        .secondaryIndexes((index) => [
            index('uid'), // GSI for unique identifier lookup
        ])
        .authorization((allow) => [allow.guest()]),

    StoryItems: a
        .model({
            id: a.id().required(),
            title: a.string().required(),
            body: a.string().required(),
            month: a.integer().required(),
            year: a.integer().required(),
            picture: a.string().required(),
        })
        .identifier(['id'])
        .secondaryIndexes((index) => [
            index('year').sortKeys(['month']), // GSI for chronological ordering
        ])
        .authorization((allow) => [allow.guest()]),

    RegistryItems: a
        .model({
            id: a.id().required(),
            name: a.string().required(),
            description: a.string(),
            image: a.string().required(),
            externalUrl: a.string(),
            currentAmount: a.integer(),
            targetAmount: a.integer(),
            section: a.ref('RegistrySection').required(),
        })
        .identifier(['id'])
        .secondaryIndexes((index) => [
            index('section'), // GSI for section-based queries
        ])
        .authorization((allow) => [allow.guest()]),

    TravelItems: a
        .model({
            id: a.id().required(),
            name: a.string().required(),
            category: a.ref('TravelCategory').required(),
            image: a.string(),
            address: a.string(),
            phone: a.string(),
            description: a.string(),
            websiteUrl: a.string(),
            coordinatesLat: a.float(),
            coordinatesLng: a.float(),
        })
        .identifier(['id'])
        .secondaryIndexes((index) => [
            index('category'), // GSI for category-based queries
        ])
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

    validateAdminPassword: a
        .query()
        .arguments({
            password: a.string().required(),
        })
        .returns(a.boolean())
        .handler(a.handler.function(adminAuthFunction))
        .authorization((allow) => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'identityPool',
    },
});
