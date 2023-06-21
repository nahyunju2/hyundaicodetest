<template>
    <q-btn-dropdown icon="language" class="q-ml-sm" bg-color="white" :label="textLang">
        <q-list>
            <q-item clickable v-close-popup @click.prevent="onItemClick('ko')">
                <q-item-section>
                    <q-item-label>{{ t('language-ko') }}</q-item-label>
                </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click.prevent="onItemClick('en')">
                <q-item-section>
                    <q-item-label>{{ t('language-en') }}</q-item-label>
                </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click.prevent="onItemClick('zh')">
                <q-item-section>
                    <q-item-label>{{ t('language-zh') }}</q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
    </q-btn-dropdown>
</template>
  
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import i18n from "@/lang/lang";
import { useAuthStore } from '@/stores/auth';

const { t } = useI18n();
const auth = useAuthStore();
const currentLangCode = ref(i18n.global.locale.value);

const onItemClick = ((langCode: string) => {
    currentLangCode.value = langCode as "ko" | "en" | "zh";
    i18n.global.locale.value = langCode as "ko" | "en" | "zh";
});

const textLang = computed(() => {
    switch (currentLangCode.value) {
        case "en":
            return t('language-en');
        case "zh":
            return t('language-zh');
        case "ko":
        default:
            return t('language-ko');
    }
})


</script>
  