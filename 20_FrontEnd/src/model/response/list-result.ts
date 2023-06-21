import FileResponse from "./file";
import FolderResponse from "./folder";

export default interface ListResult {
    success: boolean;
    message: string;
    fileList: FileResponse[];
    folderList: FolderResponse[];
    folderPathList: FolderResponse[];
}