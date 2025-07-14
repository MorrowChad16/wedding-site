import { Schema } from '../data/resource';

export const handler: Schema['validateAdminPassword']['functionHandler'] = async (event) => {
    try {
        const { password } = event.arguments;
        console.log('manual password: ', password);

        if (!password) {
            console.error('Password is required');
            return false;
        }

        // Retrieve secret from environment variable (injected by Amplify)
        const adminPassword = process.env.JACE_ALYSSA_WEDDING_2026_ADMIN;
        console.log('admin password:  ', adminPassword);

        if (!adminPassword) {
            console.error('Admin password not configured in environment');
            return false;
        }

        const isValid = password === adminPassword;
        console.log('Admin validation result:', isValid);

        return isValid;
    } catch (error) {
        console.error('Admin authentication error:', error);
        return false;
    }
};
