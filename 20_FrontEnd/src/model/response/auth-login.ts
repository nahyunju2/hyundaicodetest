export default interface AuthLoginResponse {
    success: boolean;
    message: string;
    token: string;
    folderId: string;
    shareId: string;
    trashId: string;
}