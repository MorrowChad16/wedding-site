import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { useQuery } from '@tanstack/react-query';

const getClient = () => generateClient<Schema>();

export type RegistryItemType = Schema['RegistryItems']['type'];

/**
 * Get all registry items ordered by creation time (oldest to newest) within each section
 * @returns all registry items from the database grouped by section
 */
export const getRegistryItems = () => {
    const {
        isLoading,
        error,
        data: registryItems,
    } = useQuery<RegistryItemType[] | undefined>({
        queryKey: ['getRegistryItems'],
        queryFn: async () => {
            const response = await getClient().models.RegistryItems.list();
            const allItems = response.data || [];

            // Sort by createdAt (oldest to newest)
            return allItems.sort((a, b) => {
                // First sort by section to group them
                if (a.section !== b.section) {
                    return a.section.localeCompare(b.section);
                }
                // Then sort by createdAt within each section (oldest to newest)
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
        registryItems,
    };
};

/**
 * Create a new registry item
 */
export const createRegistryItem = async (
    name: string,
    description: string | undefined,
    image: string,
    externalUrl: string | undefined,
    currentAmount: number | undefined,
    targetAmount: number | undefined,
    section: 'FUNDS' | 'REGISTRIES'
) => {
    return await getClient().models.RegistryItems.create({
        name,
        description,
        image,
        externalUrl,
        currentAmount,
        targetAmount,
        section,
    });
};

/**
 * Update an existing registry item
 */
export const updateRegistryItem = async (
    id: string,
    name: string,
    description: string | undefined,
    image: string,
    externalUrl: string | undefined,
    currentAmount: number | undefined,
    targetAmount: number | undefined,
    section: 'FUNDS' | 'REGISTRIES'
) => {
    return await getClient().models.RegistryItems.update({
        id,
        name,
        description,
        image,
        externalUrl,
        currentAmount,
        targetAmount,
        section,
    });
};

/**
 * Delete a registry item
 */
export const deleteRegistryItem = async (id: string) => {
    return await getClient().models.RegistryItems.delete({
        id,
    });
};
