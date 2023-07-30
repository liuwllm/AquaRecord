export interface UserInfo {
    user: {
        id: number;
        firstname: string;
        lastname: string;
        username: string;
        weight: number;
    }
}

export interface UserCredentials {
    user: {
        username: string;
        pwd: string;
    }
}

export interface UserRegistration {
    user: {
        firstname: string;
        lastname: string;
        username: string;
        pwd: string;
        weight: number;
    }
}

