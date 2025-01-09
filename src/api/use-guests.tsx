import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { FoodChoice, Guest, Relationship, Status } from '../utils/types';
import { useQuery } from '@tanstack/react-query';

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
        isBridalParty: true,
    });

    getClient().models.Guest.create({
        email: 'morrowchad1@proton.me',
        guestId: '2',
        relationship: 'PLUS_ONE',
        phoneNumber: '8157084489',
        firstName: 'Ciara',
        lastName: 'McNeley',
        status: 'ATTENDING',
        isBridalParty: true,
    });

    getClient().models.Guest.create({
        email: 'morrowchad1@proton.me',
        guestId: '3',
        relationship: 'CHILD',
        phoneNumber: '8157084489',
        firstName: 'Ciara',
        lastName: 'Morrow',
        status: 'ATTENDING',
        isBridalParty: true,
    });

    getClient().models.Guest.create({
        email: 'morrowchad1@proton.me',
        guestId: '4',
        relationship: 'CHILD',
        phoneNumber: '8157084489',
        firstName: 'Yohan',
        lastName: 'Morrow',
        status: 'ATTENDING',
        isBridalParty: true,
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
    const response = await getClient().models.Guest.get({
        email: email,
        guestId: '1',
    });
    return response.data !== undefined;
};

/**
 * Checks if the user has submitted RSVP details
 * @param email is the party's email
 * @returns true if the guest has submitted they are coming or not. false if in the default state.
 */
export const hasSubmittedRsvp = (email: string) => {
    const { data: hasSubmitted } = useQuery<boolean>({
        queryKey: ['getRsvpStatus'],
        queryFn: async () => {
            const response = await getClient().models.Guest.get({
                email: email,
                guestId: '1',
            });

            return response.data?.status !== Status.ATTENDING;
        },
        retry: 3,
        retryDelay: 200,
    });

    return {
        hasSubmitted,
    };
};

/**
 * updates a guests RSVP info
 * @param email guest email
 * @param guestId guest id
 * @param foodAllergies guest food allergies
 * @param status guest attendance status
 * @param foodChoice guest food choice
 * @param songRequests guest song requests
 * @returns
 */
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

/**
 * Get all guests under the party's email id
 * @param email is the party's email
 * @returns all guests under the party's email
 */
export const getGuests = (email: string) => {
    const {
        isLoading,
        error,
        data: guests,
    } = useQuery<Guest[]>({
        queryKey: ['getGuests'],
        queryFn: async () => {
            let allGuests: Guest[] = [];

            for(let i = 0; i < 10; i++) {
                const response = await getClient().models.Guest.get({
                    email: email,
                    guestId: `${i}`,
                });

                if (response.data === undefined) {
                    continue;
                }

                const guest = response.data!;
                const translatedValue: Guest = {
                    email: guest.email,
                    guestId: guest.guestId,
                    relationship: guest.relationship as Relationship,
                    phoneNumber: guest.phoneNumber,
                    firstName: guest.firstName,
                    lastName: guest.lastName,
                    status: guest.status as Status,
                    foodChoice: guest.foodChoice as FoodChoice,
                    foodAllergies: guest.foodAllergies,
                    songRequests: guest.songRequests,
                    isBridalParty: guest.isBridalParty,
                };

                allGuests.concat(translatedValue);
            }

            console.log(allGuests);
            return allGuests;
        },
        retry: 3,
        retryDelay: 200,
        staleTime: 86_400_000,
    });

    return {
        isLoading,
        error,
        guests,
    };
};
