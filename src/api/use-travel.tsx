import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { useQuery } from '@tanstack/react-query';

const getClient = () => generateClient<Schema>();

export type TravelItemType = Schema['TravelItems']['type'];

/**
 * Get all travel items ordered by creation time (oldest to newest) within each category
 * @returns all travel items from the database grouped by category
 */
export const getTravelItems = () => {
    const {
        isLoading,
        error,
        data: travelItems,
    } = useQuery<TravelItemType[] | undefined>({
        queryKey: ['getTravelItems'],
        queryFn: async () => {
            const response = await getClient().models.TravelItems.list();
            const allItems = response.data || [];

            // Sort by createdAt (oldest to newest)
            return allItems.sort((a, b) => {
                // First sort by category to group them
                if (a.category !== b.category) {
                    return a.category.localeCompare(b.category);
                }
                // Then sort by createdAt within each category (oldest to newest)
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });
        },
        retry: 3,
        retryDelay: 200,
        staleTime: 300_000, // 5 minutes
    });

    return {
        isLoading,
        error,
        travelItems,
    };
};

/**
 * Create a new travel item
 */
export const createTravelItem = async (
    name: string,
    category:
        | 'HOTEL'
        | 'AIRBNB'
        | 'AIRPORT'
        | 'TRANSPORTATION'
        | 'RESTAURANT'
        | 'BAR'
        | 'BREWERY'
        | 'PARK'
        | 'GOLF'
        | 'CEREMONY_VENUE',
    image: string | undefined,
    address: string | undefined,
    phone: string | undefined,
    description: string | undefined,
    websiteUrl: string | undefined,
    coordinatesLat: number | undefined,
    coordinatesLng: number | undefined
) => {
    return await getClient().models.TravelItems.create({
        name,
        category,
        image,
        address,
        phone,
        description,
        websiteUrl,
        coordinatesLat,
        coordinatesLng,
    });
};

/**
 * Update an existing travel item
 */
export const updateTravelItem = async (
    id: string,
    name: string,
    category:
        | 'HOTEL'
        | 'AIRBNB'
        | 'AIRPORT'
        | 'TRANSPORTATION'
        | 'RESTAURANT'
        | 'BAR'
        | 'BREWERY'
        | 'PARK'
        | 'GOLF'
        | 'CEREMONY_VENUE',
    image: string | undefined,
    address: string | undefined,
    phone: string | undefined,
    description: string | undefined,
    websiteUrl: string | undefined,
    coordinatesLat: number | undefined,
    coordinatesLng: number | undefined
) => {
    return await getClient().models.TravelItems.update({
        id,
        name,
        category,
        image,
        address,
        phone,
        description,
        websiteUrl,
        coordinatesLat,
        coordinatesLng,
    });
};

/**
 * Delete a travel item
 */
export const deleteTravelItem = async (id: string) => {
    return await getClient().models.TravelItems.delete({
        id,
    });
};
