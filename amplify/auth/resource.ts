import { defineAuth } from '@aws-amplify/backend';

// Never actually used. Guest access is enabled by default, so this is here to make Amplify happy.
// Users will only need to enter their email to gain access to their data.
export const auth = defineAuth({
    loginWith: {
        email: true,
    },
});
