import axios from "axios";

export async function download(fileId: string): Promise<void> {
    const response = await axios.get<void>(`/api/file/download?fileId=${fileId}`,
        {
            headers: {
                'authorization': localStorage.getItem('token')
            },
            responseType: 'blob'
        }).then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            const contentDisposition = res.headers['content-disposition']; // 파일 이름
            let fileName = null;
            if (contentDisposition) {
                // UTF-8
                const [fileNameMatch] = contentDisposition.split(';').filter(str => str.includes('filename*'));
                if (fileNameMatch){
                    [, fileName] = fileNameMatch.split('*=UTF-8\'\'');
                }
                
                if(!fileName){
                    const [fileNameMatch2] = contentDisposition.split(';').filter(str => str.includes('filename'));
                    if (fileNameMatch2){
                        [, fileName] = fileNameMatch2.split('=');
                        fileName = fileName.replace(/"/gi, '');
                    }
                }
            }
            
            link.href = url;
            link.setAttribute('download', `${decodeURI(fileName)}`);
            link.style.cssText = 'display:none';
            document.body.appendChild(link);
            link.click();
            link.remove();
        });
    return;
}

export async function renamefile(fileId: string, fileName: string): Promise<void> {
    const response = await axios.post<void>(`/api/file/rename`, {
        fileId: fileId,
        fileName: fileName
    },
        {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        });
    return response.data;
}

export async function deletefile(fileId: string): Promise<void> {
    const response = await axios.post<void>(`/api/file/rename`, {
        fileId: fileId
    },
        {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        });
    return response.data;
}