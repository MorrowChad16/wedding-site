import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { useQuery } from '@tanstack/react-query';

const getClient = () => generateClient<Schema>();

type FAQType = Schema['FrequentlyAskedQuestions']['type'];

/**
 * Get all visible frequently asked questions
 * @returns all visible FAQs from the database
 */
export const getVisibleFAQs = () => {
    const {
        isLoading,
        error,
        data: faqs,
    } = useQuery<FAQType[] | undefined>({
        queryKey: ['getVisibleFAQs'],
        queryFn: async () => {
            const response = await getClient().models.FrequentlyAskedQuestions.list();
            // Filter to only show visible FAQs (explicitly check for true)
            return response.data?.filter((faq) => faq.isVisible === true) || [];
        },
        retry: 3,
        retryDelay: 200,
        staleTime: 300_000, // 5 minutes
    });

    return {
        isLoading,
        error,
        faqs,
    };
};

/**
 * Get all FAQs for admin purposes (including non-visible ones)
 * @returns all FAQs in the database
 */
export const getAllFAQs = () => {
    const {
        isLoading,
        error,
        data: faqs,
    } = useQuery<FAQType[] | undefined>({
        queryKey: ['getAllFAQs'],
        queryFn: async () => {
            const response = await getClient().models.FrequentlyAskedQuestions.list();
            return response.data || [];
        },
        retry: 3,
        retryDelay: 200,
        staleTime: 300_000, // 5 minutes
    });

    return {
        isLoading,
        error,
        faqs,
    };
};

/**
 * Create a new FAQ
 * @param question FAQ question
 * @param answer FAQ answer
 * @param isVisible whether the FAQ should be visible
 * @returns the created FAQ
 */
export const createFAQ = async (question: string, answer: string, isVisible: boolean = true) => {
    return await getClient().models.FrequentlyAskedQuestions.create({
        question: question,
        answer: answer,
        isVisible: isVisible,
    });
};

/**
 * Update an existing FAQ
 * @param id FAQ id
 * @param question FAQ question
 * @param answer FAQ answer
 * @param isVisible whether the FAQ should be visible
 * @returns the updated FAQ
 */
export const updateFAQ = async (
    id: string,
    question: string,
    answer: string,
    isVisible: boolean
) => {
    return await getClient().models.FrequentlyAskedQuestions.update({
        id: id,
        question: question,
        answer: answer,
        isVisible: isVisible,
    });
};

/**
 * Delete an FAQ
 * @param id FAQ id
 * @returns
 */
export const deleteFAQ = async (id: string) => {
    return await getClient().models.FrequentlyAskedQuestions.delete({
        id: id,
    });
};
