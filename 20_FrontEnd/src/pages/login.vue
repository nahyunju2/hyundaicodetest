<template>
    <q-header elevated class="bg-primary text-white" height-hint="98">
        <q-toolbar>
            <q-toolbar-title>
                <strong>프로젝트명</strong>
            </q-toolbar-title>
            <label-button :button-txt="t('regst-user')" @click.prevent="moveRegstUser" />
            <select-lang />
        </q-toolbar>
    </q-header>
    <q-page-container>
        <q-page padding class="row justify-center items-center">
            <q-card square bordered class="q-pa-lg shadow-1" style="width:450px;">
                <q-card-section>
                    <q-form @submit="doLogin" class="q-gutter-md">
                        <q-input tabindex="1" filled v-model="email" :label="t('id')" />
                        <q-input tabindex="2" filled :type="isPwd ? 'password' : 'text'" v-model="password"
                            :label="t('password')" @keydown.enter="doLogin">
                            <template v-slot:append>
                                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                    @click="isPwd = !isPwd" />
                            </template>
                        </q-input>
                    </q-form>
                </q-card-section>
                <q-card-actions class="q-px-md">
                    <q-btn tabindex="3" color="primary" :label="t('login')" type="submit" size="lg" class="full-width"
                        @click.prevent="doLogin" />
                </q-card-actions>
            </q-card>
        </q-page>
    </q-page-container>
    <common-footer />
</template>
  
<script setup lang="ts">
import selectLang from "@/components/select/select-lang.vue";
import labelButton from "@/components/button/label-button.vue";
import commonFooter from "@/components/footer/Footer.vue";
import { useToast } from "@/components/toast/Toast";
import { useI18n } from "vue-i18n";

import * as AuthApi from "@/api/auth";
import { useAuthStore } from '@/stores/auth';


const toast = useToast();
const { t } = useI18n();
const router = useRouter();

const email = ref('');
const password = ref('');
const isPwd = ref(true);
let isLoginProgress = false;
const authStore = useAuthStore();

const doLogin = (async () => {
    if (isLoginProgress === true) {
        return;
    }

    if (email.value.length <= 2 || password.value.length <= 2) {
        toast.info('2글자 이상 입력하시기 바랍니다.');
        return;
    }

    isLoginProgress = true;

    const response = await AuthApi.loginAsync(email.value, password.value);

    if (response.success) {
        // update pinia state
        authStore.token = response.token;
        authStore.folderId = response.folderId;
        authStore.shareId = response.shareId;
        authStore.trashId = response.trashId;

        // store user details and jwt in local storage to keep user logged in between page refreshes
        localStorage.setItem('token', authStore.token);
        localStorage.setItem('folderId', authStore.folderId);
        localStorage.setItem('shareId', authStore.shareId);
        localStorage.setItem('trashId', authStore.trashId);

        // redirect to previous url or default to home page
        //router.push(this.returnUrl || '/Main');
        router.push(authStore.returnUrl || '/Main');
    }
    else {
        toast.warning(response.message);
    }

    isLoginProgress = false;

});

const moveRegstUser = (() => {
    router.push('/RegstUser');
})

</script>