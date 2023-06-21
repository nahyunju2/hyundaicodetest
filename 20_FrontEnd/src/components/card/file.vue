<template>
    <q-card class="file-card" bordered style="width:345px;">
        <q-card-section horizontal style="height:50px;">
            <q-card-section class="col-8 flex flex-left q-pa-none">
                <q-checkbox v-model="isCheck" />
            </q-card-section>
            <q-card-section class="col-2 flex flex-right q-pt-sm">
                <q-icon v-show="isShare" size="md" name="groups" />
            </q-card-section>
            <q-card-section class="col-2 flex flex-right q-pt-sm">
                <q-icon size="md" name="more_horiz" class="cursor-pointer" />
            </q-card-section>
        </q-card-section>

        <q-card-section class="q-pa-none">
            <q-card-section class="q-pt-none" horizontal style="height:80px;">
                <q-card-section class="col-4 flex flex-center q-pt-none">
                    <q-icon size="2rem" name="folder_open" class="row" />
                    <div class="text-h8 ellipsis" :title="item.file_name">{{ item.file_name }}</div>
                </q-card-section>
                <q-card-section class="col-2 q-pt-none">
                    <div class="text-h7 q-mt-none q-mb-none">Date.</div>
                    <div class="text-h7 q-mt-none q-mb-none">Size.</div>
                    <div class="text-h7 q-mt-none q-mb-none" v-show="isShare">Share.</div>
                </q-card-section>
                <q-card-section class="col-6 q-pt-none">
                    <div class="text-h7 q-mt-none q-mb-none text-right">{{ item.createdAt.replace('T', ' ').replace('.000Z','') }}</div>
                    <div class="text-h7 q-mt-none q-mb-none text-right">{{ humanFileSize(item.file_size) }}</div>
                    <div class="text-h7 q-mt-none q-mb-none text-right" v-show="isShare"></div>
                </q-card-section>
            </q-card-section>

            <q-separator />

            <q-card-actions class="justify-end" style="height:40px;">
                <q-btn flat icon="delete" v-show="!isShare" @click.prevent="deleteFile"/>
                <q-btn flat icon="person_add" @click.prevent="shareFile"/>
                <q-btn flat icon="file_download" @click.prevent="downloadFile" />
            </q-card-actions>
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import FileResponse from '@/model/response/file';
import * as FileApi from "@/api/file";


const props = defineProps({
    item: { type: Object, required: true, default: {} as FileResponse },
    isShare: { type: Boolean, default: false }
})

const isCheck = ref(false);


// 다운로드 파일
const downloadFile = (() => {
    FileApi.download(props.item.file_id);
});

// 파일 공유
const shareFile = (() => {

});

// 파일 삭제
const deleteFile = (() => {

});

/**
 * Format bytes as human-readable text.
 * 
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use 
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 * 
 * @return Formatted string.
 */
 const humanFileSize = ((bytes:number, si=true, dp=1) => {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si 
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10**dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


  return bytes.toFixed(dp) + ' ' + units[u];
});
</script>