import ListResult from "@/model/response/list-result";
import axios from "axios";

export async function getFileList(folderId: string): Promise<ListResult> {
    const response = await axios.get<ListResult>(`/api/folder/list?folderId=${folderId}`,
        {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        });
    return response.data;
}

export async function addFolder(folderId: string, folderType:string, folderName: string): Promise<void> {
    const response = await axios.post<void>(`/api/folder/add`, {
        folderId: folderId,
        folderType: folderType,
        folderName: folderName
    },
        {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        });
    return response.data;
}

export async function renameFolder(folderId: string, folderName: string): Promise<void> {
    const response = await axios.post<void>(`/api/folder/rename`, {
        folderId: folderId,
        folderName: folderName
    },
        {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        });
    return response.data;
}

export async function deleteFolder(folderId: string): Promise<void> {
    const response = await axios.post<void>(`/api/folder/rename`, {
        folderId: folderId
    },
        {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        });
    return response.data;
}