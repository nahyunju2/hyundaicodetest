export default interface FolderResponse {
    folder_id: string;
    folder_name: string;
    folder_type: string;
    hierarchyLevel: number;
    owner: string;
    createdAt: string;
    updatedAt: string;
    ancestors: FolderResponse;
}