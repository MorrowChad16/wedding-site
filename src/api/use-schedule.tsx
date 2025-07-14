import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { useQuery } from '@tanstack/react-query';

const getClient = () => generateClient<Schema>();

export type ScheduleItemType = Schema['ScheduleItems']['type'];

/**
 * Get all visible schedule items ordered by startTime
 * @returns all visible schedule items from the database
 */
export const getVisibleScheduleItems = () => {
    const {
        isLoading,
        error,
        data: scheduleItems,
    } = useQuery<ScheduleItemType[] | undefined>({
        queryKey: ['getVisibleScheduleItems'],
        queryFn: async () => {
            const response = await getClient().models.ScheduleItems.list();
            const visibleItems = response.data?.filter((item) => item.isVisible === true) || [];

            // Sort by startTime
            return visibleItems.sort((a, b) => {
                return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
            });
        },
        retry: 3,
        retryDelay: 200,
        staleTime: 300_000, // 5 minutes
    });

    return {
        isLoading,
        error,
        scheduleItems,
    };
};

/**
 * Get all schedule items for admin purposes (including non-visible ones)
 * @returns all schedule items in the database
 */
export const getAllScheduleItems = () => {
    const {
        isLoading,
        error,
        data: scheduleItems,
    } = useQuery<ScheduleItemType[] | undefined>({
        queryKey: ['getAllScheduleItems'],
        queryFn: async () => {
            const response = await getClient().models.ScheduleItems.list();
            const allItems = response.data || [];

            // Sort by startTime
            return allItems.sort((a, b) => {
                return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
            });
        },
        retry: 3,
        retryDelay: 200,
        staleTime: 300_000, // 5 minutes
    });

    return {
        isLoading,
        error,
        scheduleItems,
    };
};

/**
 * Create a new schedule item
 */
export const createScheduleItem = async (
    uid: string,
    startTime: Date,
    endTime: Date,
    title: string,
    locationName: string,
    location: string,
    coordinates: google.maps.LatLng | google.maps.LatLngLiteral,
    type: 'EVENT' | 'CEREMONY' | 'RECEPTION' | 'ACTIVITY',
    iconAsset: string,
    formality: 'CASUAL' | 'SEMI_FORMAL' | 'FORMAL',
    description?: string,
    isPrivate: boolean = false,
    isVisible: boolean = true
) => {
    const lat = typeof coordinates.lat === 'function' ? coordinates.lat() : coordinates.lat;
    const lng = typeof coordinates.lng === 'function' ? coordinates.lng() : coordinates.lng;

    return await getClient().models.ScheduleItems.create({
        uid,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        title,
        description,
        locationName,
        location,
        coordinatesLat: lat,
        coordinatesLng: lng,
        type,
        iconAsset,
        formality,
        isPrivate,
        isVisible,
    });
};

/**
 * Update an existing schedule item
 */
export const updateScheduleItem = async (
    id: string,
    uid: string,
    startTime: Date,
    endTime: Date,
    title: string,
    locationName: string,
    location: string,
    coordinates: google.maps.LatLng | google.maps.LatLngLiteral,
    type: 'EVENT' | 'CEREMONY' | 'RECEPTION' | 'ACTIVITY',
    iconAsset: string,
    formality: 'CASUAL' | 'SEMI_FORMAL' | 'FORMAL',
    description?: string,
    isPrivate: boolean = false,
    isVisible: boolean = true
) => {
    const lat = typeof coordinates.lat === 'function' ? coordinates.lat() : coordinates.lat;
    const lng = typeof coordinates.lng === 'function' ? coordinates.lng() : coordinates.lng;

    return await getClient().models.ScheduleItems.update({
        id,
        uid,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        title,
        description,
        locationName,
        location,
        coordinatesLat: lat,
        coordinatesLng: lng,
        type,
        iconAsset,
        formality,
        isPrivate,
        isVisible,
    });
};

/**
 * Delete a schedule item
 */
export const deleteScheduleItem = async (id: string) => {
    return await getClient().models.ScheduleItems.delete({
        id,
    });
};
