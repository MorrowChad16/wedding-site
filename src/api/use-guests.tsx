import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { FoodChoice } from '../pages/Food';
import { Status } from '../pages/RSVP';
import { v4 as uuidv4 } from 'uuid';

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

/**
 * If we get a non-null value back from the email submitted on login, then we know it's a valid guest.
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
 * gets the guest's food choice
 * @param email is the guest's email
 * @returns the guest's food choice
 */
export const getFoodChoice = async (email: string) => {
    const response = await getClient().models.Guest.get(
        {
            email,
            guestId: uuidv4(),
        },
        {
            selectionSet: ['foodChoice'],
        }
    );
    return response.data?.foodChoice;
};

export const updateGuest = async (
    email: string,
    foodAllergies: string,
    songRequests: string,
    status?: Status,
    foodChoice?: FoodChoice
) => {
    return await getClient().models.Guest.update({
        email: email,
        guestId: uuidv4(),
        status: status,
        foodChoice: foodChoice,
        foodAllergies: foodAllergies,
        songRequests: songRequests,
    });
};
