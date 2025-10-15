import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { useQuery } from '@tanstack/react-query';

const getClient = () => generateClient<Schema>();

export type WeddingGuestType = Schema['WeddingGuests']['type'];
export type BridalPartyRole = Schema['BridalPartyRole']['type'];

/**
 * Get all wedding party members (guests with bridalPartyRole assigned)
 * @returns all wedding party members from the database
 */
export const getWeddingPartyMembers = () => {
    const {
        isLoading,
        error,
        data: weddingPartyMembers,
    } = useQuery<WeddingGuestType[] | undefined>({
        queryKey: ['getWeddingPartyMembers'],
        queryFn: async () => {
            const response = await getClient().models.WeddingGuests.list();
            const allGuests = response.data || [];

            // Filter to only include guests with a bridal party role
            const partyMembers = allGuests.filter((guest) => guest.bridalPartyRole !== null);

            // Sort by role hierarchy: GROOM, BRIDGE, BEST_MAN, MAID_OF_HONOR, then alphabetically
            const roleOrder: Record<string, number> = {
                GROOM: 1,
                BRIDE: 2,
                BEST_MAN: 3,
                MAID_OF_HONOR: 4,
                BRIDESMAID: 5,
                GROOMSMAN: 6,
            };

            return partyMembers.sort((a, b) => {
                const aOrder = roleOrder[a.bridalPartyRole || ''] || 999;
                const bOrder = roleOrder[b.bridalPartyRole || ''] || 999;

                if (aOrder !== bOrder) {
                    return aOrder - bOrder;
                }

                // If same role order, sort alphabetically by name
                return a.fullName.localeCompare(b.fullName);
            });
        },
        retry: 3,
        retryDelay: 200,
        staleTime: 300_000, // 5 minutes
    });

    return {
        isLoading,
        error,
        weddingPartyMembers,
    };
};

/**
 * Update a wedding guest's bridal party role
 */
export const updateBridalPartyRole = async (
    guestId: string,
    bridalPartyRole: BridalPartyRole | null
) => {
    return await getClient().models.WeddingGuests.update({
        guestId,
        bridalPartyRole,
    });
};

/**
 * Update a wedding guest's profile image
 */
export const updateGuestImage = async (guestId: string, imageUrl: string) => {
    return await getClient().models.WeddingGuests.update({
        guestId,
        image: imageUrl,
    });
};

/**
 * Update a wedding guest's description
 */
export const updateGuestDescription = async (guestId: string, description: string) => {
    return await getClient().models.WeddingGuests.update({
        guestId,
        description,
    });
};

/**
 * Helper function to get display name for bridal party roles
 */
export const getBridalPartyRoleDisplayName = (role: BridalPartyRole | null): string => {
    if (!role) return '';

    const roleNames: Record<string, string> = {
        GROOM: 'Groom',
        BRIDGE: 'Bride',
        BEST_MAN: 'Best Man',
        MAID_OF_HONOR: 'Maid of Honor',
        BRIDESMAID: 'Bridesmaid',
        GROOMSMAN: 'Groomsman',
        FLOWER_GIRL: 'Flower Girl',
        RING_BEARER: 'Ring Bearer',
        USHER: 'Usher',
        OFFICIANT: 'Officiant',
    };

    return roleNames[role] || role;
};
