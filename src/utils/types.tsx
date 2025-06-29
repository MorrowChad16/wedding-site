export enum FoodChoice {
    Beef = 'BEEF',
    Chicken = 'CHICKEN',
    Vegetarian = 'VEGETARIAN',
}

export enum AttendanceStatus {
    DECLINED = 'DECLINED',
    PENDING = 'PENDING',
    ATTENDING = 'ATTENDING',
}

export enum GuestType {
    PRIMARY = 'PRIMARY',
    PLUS_ONE = 'PLUS_ONE',
    CHILD = 'CHILD',
}

export type WeddingGuest = {
    guestId: string;
    email: string;
    guestType: GuestType;
    fullName: string;
    address: string;
    attendanceStatus: AttendanceStatus;
    foodChoice: FoodChoice | null;
    dietaryRestrictions: string | null;
    songRequests: string | null;
    isBridalParty: boolean;
    isOfDrinkingAge: boolean;
};
