import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { FoodChoice, Status } from '../utils/types';

const getClient = () => generateClient<Schema>();

export const addFakeGuests = async () => {
    getClient().models.Guest.create({
        email: 'morrowchad1@proton.me',
        guestId: '1',
        relationship: 'PRIMARY_GUEST',
        phoneNumber: '8157084489',
        firstName: 'Chad',
        lastName: 'Morrow',
        status: 'ATTENDING',
        songRequests: 'song1, song2',
    });

    getClient().models.Guest.create({
        email: 'morrowchad1@proton.me',
        guestId: '2',
        relationship: 'PLUS_ONE',
        phoneNumber: '8157084489',
        firstName: 'Ciara',
        lastName: 'McNeley',
        status: 'ATTENDING',
    });

    getClient().models.Guest.create({
        email: 'morrowchad1@proton.me',
        guestId: '3',
        relationship: 'CHILD',
        phoneNumber: '8157084489',
        firstName: 'Ciara',
        lastName: 'Morrow',
        status: 'ATTENDING',
    });

    getClient().models.Guest.create({
        email: 'morrowchad1@proton.me',
        guestId: '4',
        relationship: 'CHILD',
        phoneNumber: '8157084489',
        firstName: 'Yohan',
        lastName: 'Morrow',
        status: 'ATTENDING',
    });
};

export const resetTable = () => {
    getClient().models.Guest.delete({
        email: 'morrowchad1@proton.me',
        guestId: '1',
    });

    getClient().models.Guest.delete({
        email: 'morrowchad1@proton.me',
        guestId: '2',
    });

    getClient().models.Guest.delete({
        email: 'morrowchad1@proton.me',
        guestId: '3',
    });

    getClient().models.Guest.delete({
        email: 'morrowchad1@proton.me',
        guestId: '4',
    });
};

/**
 * If we get a non-empty value back from the email submitted on login, then we know it's a valid guest.
 * Otherwise, it's an inalid guest, so we shouldn't permit them.
 * @param email is the user-submitted login email
 * @returns true if email is in database, false otherwise
 */
export const isValidEmail = async (email: string) => {
    const response = await getClient().models.Guest.list({
        filter: {
            email: {
                eq: email,
            },
        },
    });
    return response.data.length > 0;
};

/**
 * Get all guests under the party's email id
 * @param email is the party's email
 * @returns all guests under the party's email
 */
export const getGuests = async (email: string) => {
    const response = await getClient().models.Guest.list({
        filter: {
            email: {
                eq: email,
            },
        },
    });
    return response.data;
};

/**
 * Checks if the user has submitted RSVP details
 * @param email is the party's email
 * @returns true if the guest has submitted they are coming or not. false if in the default state.
 */
export const hasSubmittedRsvp = async (email: string) => {
    const response = await getClient().models.Guest.list({
        filter: {
            email: {
                eq: email,
            },
        },
    });
    return response.data.some((guest) => guest.status !== Status.ATTENDING);
};

export const updateGuest = async (
    email: string,
    guestId: string,
    foodAllergies: string,
    status: Status,
    foodChoice: FoodChoice,
    songRequests?: string
) => {
    return await getClient().models.Guest.update({
        email: email,
        guestId: guestId,
        status: status,
        foodChoice: foodChoice,
        foodAllergies: foodAllergies,
        songRequests: songRequests,
    });
};
