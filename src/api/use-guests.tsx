import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const getClient = () => generateClient<Schema>();

export const addFakeGuest = async () =>
    getClient().models.Guest.create({
        email: 'morrowchad1@protonmail.com',
        relationship: 'CHILD',
        phoneNumber: '8157084489',
        firstName: 'Chad',
        lastName: 'Morrow',
        status: 'ATTENDING',
        foodAllergies: '',
        songRequests: 'song1, song2',
    });

// TODO: migrate to React Query
const getGuest = async (email: string) =>
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

/**
 * gets the guest's food choice
 * @param email is the guest's email
 * @returns the guest's food choice
 */
export const getFoodChoice = async (email: string) => {
    const response = await getClient().models.Guest.get(
        {
            email,
        },
        {
            selectionSet: ['foodChoice'],
            authMode: 'identityPool',
        }
    );
    return response.data?.foodChoice;
};
