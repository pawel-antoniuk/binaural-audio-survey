export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

export interface CreateUserDTO {
    name: string;
    email: string;
    role: 'admin' | 'user';
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
}