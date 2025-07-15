import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { useQuery } from '@tanstack/react-query';

const getClient = () => generateClient<Schema>();

export type StoryItemType = Schema['StoryItems']['type'];

/**
 * Get all story items ordered chronologically by year and month
 * @returns all story items from the database
 */
export const getStoryItems = () => {
    const {
        isLoading,
        error,
        data: storyItems,
    } = useQuery<StoryItemType[] | undefined>({
        queryKey: ['getStoryItems'],
        queryFn: async () => {
            const response = await getClient().models.StoryItems.list();
            const allItems = response.data || [];

            // Sort chronologically by year and then by month
            return allItems.sort((a, b) => {
                if (a.year !== b.year) {
                    return a.year - b.year;
                }
                return a.month - b.month;
            });
        },
        retry: 3,
        retryDelay: 200,
        staleTime: 300_000, // 5 minutes
    });

    return {
        isLoading,
        error,
        storyItems,
    };
};

/**
 * Create a new story item
 */
export const createStoryItem = async (
    title: string,
    body: string,
    month: number,
    year: number,
    picture: string
) => {
    return await getClient().models.StoryItems.create({
        title,
        body,
        month,
        year,
        picture,
    });
};

/**
 * Update an existing story item
 */
export const updateStoryItem = async (
    id: string,
    title: string,
    body: string,
    month: number,
    year: number,
    picture: string
) => {
    return await getClient().models.StoryItems.update({
        id,
        title,
        body,
        month,
        year,
        picture,
    });
};

/**
 * Delete a story item
 */
export const deleteStoryItem = async (id: string) => {
    return await getClient().models.StoryItems.delete({
        id,
    });
};
