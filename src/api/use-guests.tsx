import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

export const getAllGuests = async () => {
    const client = generateClient<Schema>();

    return client.models.Guest.list();
};
