import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const getClient = () => generateClient<Schema>();

export const addFakeGuest = async () =>
    getClient().models.Guest.create({
        email: 'morrowchad1@pm.me',
        relationship: 'CHILD',
        phoneNumber: '8157084489',
        firstName: 'Chad',
        lastName: 'Morrow',
        status: 'ATTENDING',
        foodChoice: 'FISH',
        foodAllergies: '',
        songRequests: 'song1, song2',
    });

export const getGuest = async (email: string) =>
    getClient().models.Guest.get(
        {
            email,
        },
        {
            authMode: 'identityPool',
        }
    );

/**
 * If we get a non-null value back from the email submitted on login, then we know it's a valid guest.
 * Otherwise, it's an inalid guest, so we shouldn't permit them.
 * @param email is the user-submitted login email
 * @returns true if email is in database, false otherwise
 */
export const isValidEmail = async (email: string) => {
    const response = await getGuest(email);
    return response.data !== null;
};
