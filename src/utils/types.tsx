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

export enum BridalPartyRole {
    GROOM = 'GROOM',
    BRIDE = 'BRIDE',
    BEST_MAN = 'BEST_MAN',
    MAID_OF_HONOR = 'MAID_OF_HONOR',
    BRIDESMAID = 'BRIDESMAID',
    GROOMSMAN = 'GROOMSMAN',
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
    bridalPartyRole: BridalPartyRole | null;
    isOfDrinkingAge: boolean;
};
