<template>
    <div class="q-pa-sm">
        <q-file :label-slot="false" :model-value="files" @update:model-value="updateFiles" multiple label="찾아보기">
            <template v-slot:file="{ index, file }"></template>
        </q-file>
    </div>
    <q-list v-for="(file, index) of files">
        <q-item v-ripple>
            <q-linear-progress class="absolute-full full-height" :value="uploadProgress[index].percent"
                :color="uploadProgress[index].color" track-color="grey-2" />
            <q-item-section avatar>
                <q-icon :name="uploadProgress[index].icon" />
            </q-item-section>

            <q-item-section class="ellipsis relative-position">{{ file.name }}</q-item-section>
        </q-item>
    </q-list>
</template>

<script setup lang="ts">
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

export interface AttachProgressInfo {
    key: string,
    error: boolean,
    color: 'green-1' | 'green-2',
    percent: number,
    icon: 'insert_drive_file' | 'movie' | 'photo' | 'audiotrack',
    name: string,
    isUploaded: boolean
}

const props = defineProps({
    folderId: { type: String, required: true }
})

const emit = defineEmits<{
  (e: 'on-upload-complate', folderId: string): void
}>()

const authStore = useAuthStore();

const files = reactive([])
const uploadProgress: AttachProgressInfo[] = reactive([])
const uploading = ref(null)


const cleanUp = (() => {
    clearTimeout(uploading.value)
});

const updateFiles = ((newFiles) => {
    (newFiles || []).forEach((file) => {
        files.push(file);
    });
    (newFiles || []).map(file => ({
        key: file.__key,
        error: false,
        color: 'green-2',
        percent: 0,
        isUploaded: false,
        icon: file.type.indexOf('video/') === 0
            ? 'movie'
            : (file.type.indexOf('image/') === 0
                ? 'photo'
                : (file.type.indexOf('audio/') === 0
                    ? 'audiotrack'
                    : 'insert_drive_file'
                )
            )
    })).forEach((file) => {
        uploadProgress.push(file);
    });

    upload();
});

const upload = (() => {
    // 첨부가 없으면 패스
    if (uploadProgress.length == 0) {
        return false;
    }

    cleanUp()

    let url = `/api/file/upload`;

    files.forEach(async (file) => {
        let folderId = props.folderId;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folderId", props.folderId);

        const progress = uploadProgress.filter(value => file.__key == value.key)[0];
        progress.error = false;
        progress.color = 'green-2';

        if (!progress.isUploaded) {
            const response = await axios.post(url, formData, {
                onUploadProgress: (progressEvent) => {
                    let percentage = (progressEvent.loaded * 100) / progressEvent.total;
                    progress.percent = percentage;

                    let percentComplete = Math.round(percentage);

                    if (percentComplete) {
                        progress.isUploaded = true;
                        emit("on-upload-complate", folderId);
                    }
                },
                headers: {
                    'authorization': authStore.token,
                    'Content-Type': 'multipart/form-data; charset=utf-8'
                }
            })
        }
    });
    return true;
});
</script>