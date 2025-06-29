import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { FoodChoice, AttendanceStatus } from '../utils/types';
import { useQuery } from '@tanstack/react-query';

const getClient = () => generateClient<Schema>();

export const addFakeGuests = async () => {
    const guestEmail = 'morrowchad1@proton.me';
    const address = '123 Main St, Boise, ID 83706';

    await getClient().models.WeddingGuests.create({
        guestId: crypto.randomUUID(),
        email: guestEmail,
        guestType: 'PRIMARY',
        fullName: 'Chad Morrow',
        address: address,
        attendanceStatus: 'ATTENDING',
        songRequests: 'song1, song2',
        isBridalParty: true,
        isOfDrinkingAge: true,
    });

    await getClient().models.WeddingGuests.create({
        guestId: crypto.randomUUID(),
        email: guestEmail,
        guestType: 'PLUS_ONE',
        fullName: 'Ciara McNeley',
        address: address,
        attendanceStatus: 'ATTENDING',
        isBridalParty: true,
        isOfDrinkingAge: true,
    });

    await getClient().models.WeddingGuests.create({
        guestId: crypto.randomUUID(),
        email: guestEmail,
        guestType: 'CHILD',
        fullName: 'Ciara Morrow',
        address: address,
        attendanceStatus: 'ATTENDING',
        isBridalParty: true,
        isOfDrinkingAge: false,
    });

    await getClient().models.WeddingGuests.create({
        guestId: crypto.randomUUID(),
        email: guestEmail,
        guestType: 'CHILD',
        fullName: 'Yohan Morrow',
        address: address,
        attendanceStatus: 'ATTENDING',
        isBridalParty: true,
        isOfDrinkingAge: false,
    });
};

export const resetTable = async () => {
    try {
        const response = await getClient().models.WeddingGuests.listWeddingGuestsByEmail({
            email: 'morrowchad1@proton.me',
        });

        if (response.data) {
            for (const guest of response.data) {
                await getClient().models.WeddingGuests.delete({
                    guestId: guest.guestId,
                });
            }
        }
    } catch (error) {
        console.error('Error resetting table:', error);
    }
};

/**
 * If we get a non-empty value back from the email submitted on login, then we know it's a valid guest.
 * Otherwise, it's an invalid guest, so we shouldn't permit them.
 * @param email is the user-submitted login email
 * @returns true if email is in database, false otherwise
 */
export const isValidEmail = async (email: string) => {
    try {
        const response = await getClient().models.WeddingGuests.listWeddingGuestsByEmail({
            email: email.toLowerCase().trim(),
        });
        return response.data && response.data.length > 0;
    } catch (error) {
        console.error('Error validating email:', error);
        return false;
    }
};

/**
 * Validates if a full name exists in the WeddingGuests table using the fullName GSI
 * @param fullName is the user-submitted full name for login
 * @returns true if fullName is in database, false otherwise
 */
export const isValidFullName = async (fullName: string) => {
    try {
        const response = await getClient().models.WeddingGuests.listWeddingGuestsByFullName({
            fullName: fullName.toLowerCase().trim(),
        });
        return response.data && response.data.length > 0;
    } catch (error) {
        console.error('Error validating full name:', error);
        return false;
    }
};

/**
 * Checks if the user has submitted RSVP details
 * @param email is the party's email
 * @returns true if the guest has submitted they are coming or not. false if in the default state.
 */
export const hasSubmittedRsvp = (email: string) => {
    const { data: hasSubmitted } = useQuery<boolean>({
        queryKey: ['getRsvpStatus', email],
        queryFn: async () => {
            const response = await getClient().models.WeddingGuests.listWeddingGuestsByEmail({
                email: email.toLowerCase(),
            });

            if (!response.data || response.data.length === 0) return false;

            // Check if primary guest has submitted RSVP (not in PENDING status)
            const primaryGuest = response.data.find((guest) => guest.guestType === 'PRIMARY');
            return primaryGuest?.attendanceStatus !== 'PENDING';
        },
        retry: 3,
        retryDelay: 200,
    });

    return {
        hasSubmitted,
    };
};

/**
 * Updates a wedding guest's RSVP info
 * @param guestId guest id
 * @param dietaryRestrictions guest dietary restrictions
 * @param attendanceStatus guest attendance status
 * @param foodChoice guest food choice
 * @param songRequests guest song requests
 * @returns
 */
export const updateWeddingGuest = async (
    guestId: string,
    dietaryRestrictions: string,
    attendanceStatus: AttendanceStatus,
    foodChoice: FoodChoice | null,
    songRequests?: string
) => {
    return await getClient().models.WeddingGuests.update({
        guestId: guestId,
        attendanceStatus: attendanceStatus,
        foodChoice: foodChoice,
        dietaryRestrictions: dietaryRestrictions,
        songRequests: songRequests,
    });
};

/**
 * Remove a wedding guest
 * @param guestId guest id
 * @returns
 */
export const removeWeddingGuest = async (guestId: string) => {
    return await getClient().models.WeddingGuests.delete({
        guestId: guestId,
    });
};

/**
 * Get all wedding guests associated with a full name using the fullName GSI
 * @param fullName is the guest's full name
 * @returns all wedding guests associated with the full name
 */
export const getWeddingGuestsByFullName = (fullName: string) => {
    const {
        isLoading,
        error,
        data: guests,
    } = useQuery<any[] | undefined>({
        queryKey: ['getWeddingGuestsByFullName', fullName],
        queryFn: async () => {
            const response = await getClient().models.WeddingGuests.listWeddingGuestsByFullName({
                fullName: fullName.trim(),
            });

            return response.data || [];
        },
        retry: 3,
        retryDelay: 200,
        staleTime: 86_400_000,
        enabled: fullName !== '' && fullName !== undefined,
    });

    return {
        isLoading,
        error,
        guests,
    };
};

/**
 * Get all wedding guests under the same email (party guests)
 * @param email is the party's email
 * @returns all wedding guests under the party's email
 */
export const getWeddingGuestsByEmail = (email: string) => {
    const {
        isLoading,
        error,
        data: guests,
    } = useQuery<any[] | undefined>({
        queryKey: ['getWeddingGuestsByEmail', email],
        queryFn: async () => {
            const response = await getClient().models.WeddingGuests.listWeddingGuestsByEmail({
                email: email.toLowerCase(),
            });

            return response.data || [];
        },
        retry: 3,
        retryDelay: 200,
        staleTime: 86_400_000,
        enabled: email !== '' && email !== undefined,
    });

    return {
        isLoading,
        error,
        guests,
    };
};
