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
        <q-card-section class="q-qt-none" horizontal style="height:130px;">
            <q-card-section class="col-4 flex flex-center q-pa-none">
                <q-icon class="q-pb-md" size="4rem" name="folder_open" />
            </q-card-section>
            <q-card-section class="col-8 q-pl-none">
                <div @click.prevent="emit('on-enter-folder', item.folder_id)" class="text-h5 q-pt-lg q-pb-md ellipsis cursor-pointer" :title="item.folder_name">{{ item.folder_name }}</div>
            </q-card-section>
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import FolderResponse from '@/model/response/folder';

const emit = defineEmits<{
  (e: 'on-enter-folder', folderId: string): void
}>()

const props = defineProps({
    item: { type: Object, required: true, default: {} as FolderResponse },
    isShare: { type: Boolean, default: false }
})

const isCheck = ref(false);


</script>