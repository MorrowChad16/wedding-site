export enum FoodChoice {
    Meat = 'MEAT',
    Fish = 'FISH',
    Vegetarian = 'VEGETARIAN',
}

export enum Status {
    NOT_ATTENDING = 'NOT_ATTENDING',
    ATTENDING = 'ATTENDING',
    COMING = 'COMING',
}

export enum Relationship {
    PRIMARY_GUEST = 'PRIMARY_GUEST',
    SECONDARY_GUEST = 'SECONDARY_GUEST',
    PLUS_ONE = 'PLUS_ONE',
    CHILD = 'CHILD',
}

export type Guest = {
    email: string;
    guestId: string;
    relationship: Relationship;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    status: Status;
    foodChoice: FoodChoice;
    foodAllergies: string | null;
    songRequests: string | null;
};
