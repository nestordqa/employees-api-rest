export interface ResponseObject<T> {
    success: boolean;
    data?: T | null;
    error?: string | null;
}
