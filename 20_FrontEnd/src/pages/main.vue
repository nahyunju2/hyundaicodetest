<template>
    <q-header elevated class="bg-primary text-white" height-hint="98">
        <q-toolbar>
            <q-toolbar-title>
                <strong>프로젝트명</strong>
            </q-toolbar-title>
            <label-button button-txt="로그아웃" @click.prevent="doLogout" />
            <common-button button-txt="휴지통" icon="delete" />
            <common-button button-txt="Folder" icon="folder" @click.prevent="createFolderLayerPopup = true" />
            <common-button button-txt="Upload" icon="upload" @click.prevent="showUploadFile" />
            <select-lang />
        </q-toolbar>
    </q-header>
    <q-drawer v-model="showUpload" side="right" overlay bordered>
        <file-upload :folder-id="currentFolderId" @on-upload-complate="callbackUpload" />
    </q-drawer>
    <q-page-container>
        <q-page padding>
            <q-tabs v-model="currentTab" class="text-grey" active-color="primary" indicator-color="primary" align="justify">
                <!-- <q-route-tab to="/page1" label="Page One" /> -->
                <q-tab name="my-folder" label="내 폴더" />
                <q-tab name="share-folder" label="공유 폴더" />
            </q-tabs>
            <q-tab-panels v-model="currentTab" animated class="shadow-2 rounded-borders">
                <q-tab-panel name="my-folder">
                    <q-breadcrumbs class="q-mb-md text-primary" separator=">" active-color="black">
                        <template v-for="(folder, index) of myfolderPathList.ancestors">
                            <q-breadcrumbs-el class="cursor-pointer" :label="folder.folder_name" :icon="index == 0 ? 'home' : 'folder'" @click.prevent="enterFolderId(folder.folder_id)" />
                        </template>
                        <q-breadcrumbs-el :label="myfolderPathList.folder_name" :icon="myfolderPathList.ancestors?.length == 0 ? 'home' : 'folder'" />
                    </q-breadcrumbs>
                    <div class="q-pa-sd row q-gutter-md">
                        <template v-for="folder of myFolderFolderList" :key="`my${folder.folder_id}`">
                            <folder :item="folder" @on-enter-folder="enterFolderId" />
                        </template>
                        <template v-for="file of myFolderFileList" :key="`my${folder.file_id}`">
                            <file :item="file" />
                        </template>
                    </div>
                </q-tab-panel>
                <q-tab-panel name="share-folder">
                    <q-breadcrumbs class="q-mb-md text-primary" separator=">" active-color="black">
                        <q-breadcrumbs-el label="내 폴더" icon="home" />
                        <q-breadcrumbs-el label="Components" icon="folder" />
                        <q-breadcrumbs-el label="Breadcrumbs" icon="folder" />
                    </q-breadcrumbs>
                    <div class="q-pa-sd row q-gutter-md">
                        <template v-for="folder of shareFolderList">
                            <folder :item="folder" @on-enter-folder="enterFolderId" />
                        </template>
                        <template v-for="file of shareFileList">
                            <file :item="file" />
                        </template>
                    </div>
                </q-tab-panel>
            </q-tab-panels>
        </q-page>
    </q-page-container>
    <common-footer />

    <q-dialog v-model="createFolderLayerPopup" persistent>
        <q-card style="min-width: 350px">
            <q-card-section>
                <div class="text-h6">새 폴더 생성</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-input dense v-model="textFolderName" autofocus @keyup.enter="createFolderLayerPopup = false" />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup />
                <q-btn flat label="Create" v-close-popup @click.prevent="createFolder" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
  
<script setup lang="ts">
import selectLang from "@/components/select/select-lang.vue";
import labelButton from "@/components/button/label-button.vue";
import commonButton from "@/components/button/button.vue";
import commonFooter from "@/components/footer/Footer.vue";
import fileUpload from "@/components/upload/file-upload.vue";
import file from "@/components/card/file.vue";
import folder from "@/components/card/folder.vue";

import { useAuthStore } from "@/stores/auth";
import router from "./routes";
import { useToast } from "@/components/toast/Toast";

import * as FolderApi from "@/api/folder";

import ListResult from "@/model/response/list-result";
import FileResponse from "@/model/response/file";
import FolderResponse from "@/model/response/folder";

const authStore = useAuthStore();
const toast = useToast();

const currentTab = ref('my-folder');
const currentFolderId = ref(authStore.folderId as string);

const createFolderLayerPopup = ref(false);
const textFolderName = ref('');

const showUpload = ref(false);
const showUploadFile = (() => {
    showUpload.value = !showUpload.value;
})

const myFolderFolderList: FolderResponse[] = reactive([]);
const myFolderFileList: FileResponse[] = reactive([]);
const myfolderPathList: FolderResponse = reactive({});

const shareFolderList: FolderResponse[] = reactive([]);
const shareFileList: FileResponse[] = reactive([]);

const trashFolderList: FolderResponse[] = reactive([]);
const trashFileList: FileResponse[] = reactive([]);


// 업로드 성공 후 후처리
const callbackUpload = (() => {
    refresh(currentFolderId.value);
});

const createFolder = (async () => {
    try {
        await FolderApi.addFolder(currentFolderId.value, currentTab.value, textFolderName.value);
        toast.success('폴더를 생성하였습니다.');

        textFolderName.value = '';
        refresh(currentFolderId.value);
    } catch (err) {
        toast.error('폴더 생성에 실패하였습니다.');
    }
});

// 해당 폴더 갱신
const refresh = (async (folderId: string) => {
    const response: ListResult = await FolderApi.getFileList(folderId);
    if (response.success) {
        switch (currentTab.value) {
            case "my-folder":
                myFolderFileList.splice(0);
                myFolderFolderList.splice(0);
                response.fileList.forEach((file) => {
                    myFolderFileList.push(file);
                });
                response.folderList.forEach((file) => {
                    myFolderFolderList.push(file);
                });
                Object.assign(myfolderPathList, response.folderPathList);
                
                break;
            case "share-folder":
                shareFileList.splice(0);
                shareFolderList.splice(0);
                response.fileList.forEach((file) => {
                    shareFileList.push(file);
                });
                response.folderList.forEach((file) => {
                    shareFolderList.push(file);
                });
                break;
        }
    }
});

const enterFolderId = ((folderId: string) => {
    currentFolderId.value = folderId;
    refresh(folderId);
})

watch(() => currentFolderId.value,
    (newValue, oldValue) => {
        refresh(newValue);
    }
);

watch(() => currentTab.value,
    (newValue, oldValue) => {
        switch (newValue) {
            case "my-folder":
                currentFolderId.value = authStore.folderId as string;
                break;
            case "share-folder":
                currentFolderId.value = authStore.shareId as string;
                break;
        }
    }
);

refresh(currentFolderId.value);

// 로그아웃
const doLogout = (() => {
    router.push(authStore.logout());
});
</script>