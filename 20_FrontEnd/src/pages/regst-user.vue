<template>
    <q-header elevated class="bg-primary text-white" height-hint="98">
        <q-toolbar>
            <q-toolbar-title>
                <strong>프로젝트명</strong>
            </q-toolbar-title>
            <label-button button-txt="로그인" @click.prevent="moveLogin" />
            <select-lang />
        </q-toolbar>
    </q-header>
    <q-page-container>
        <q-page padding class="row justify-center items-center">
            <q-card square bordered class="q-pa-lg shadow-1" style="width:450px;">
                <q-card-section>
                    <q-form @submit="doRegst" class="q-gutter-md">
                        <q-input ref="textUserName" tabindex="1" filled v-model="userName" :label="t('user-name')" />
                        <q-input ref="textEmail" tabindex="2" filled v-model="email" :label="t('id')">
                            <template v-slot:append >
                                <q-icon :name="confirmEmail ? 'done' : ''"/>
                            </template>
                        </q-input>
                        <q-input ref="textPassword" tabindex="3" filled :type="isPwd ? 'password' : 'text'" v-model="password"
                            :label="t('password')">
                            <template v-slot:append>
                                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                    @click="isPwd = !isPwd" />
                            </template>
                        </q-input>
                        <q-list>
                            <q-item v-ripple :active="confirmLength">
                                <q-item-section avatar>
                                    <q-icon name="task_alt" />
                                </q-item-section>
                                <q-item-section>{{ t('confirm-length') }}</q-item-section>
                            </q-item>

                            <q-item v-ripple :active="confirmNumber">
                                <q-item-section avatar>
                                    <q-icon name="task_alt" />
                                </q-item-section>
                                <q-item-section>{{ t('confirm-number') }}</q-item-section>
                            </q-item>

                            <q-item v-ripple :active="confirmUppercase">
                                <q-item-section avatar>
                                    <q-icon name="task_alt" />
                                </q-item-section>
                                <q-item-section>{{ t('confirm-letter') }}</q-item-section>
                            </q-item>
                        </q-list>
                        <q-input ref="textPasswordConfirm" tabindex="4" filled type="password" v-model="passwordConfirm"
                            :label="t('password-confirm')" @keyup.enter="doRegst">
                            <template v-slot:append >
                                <q-icon :name="matchPassword ? 'done' : ''"/>
                            </template>
                        </q-input>
                    </q-form>
                </q-card-section>
                <q-card-actions class="q-px-md">
                    <q-btn tabindex="5" :label="t('regist')" type="submit" color="primary" size="lg" class="full-width" @click="doRegst" />
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


const userName = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const isPwd = ref(true);

const confirmEmail = ref(false);
const confirmLength = ref(false);
const confirmNumber = ref(false);
const confirmUppercase = ref(false);
const matchPassword = ref(false);

const textUserName = ref();
const textEmail = ref();
const textPassword = ref();
const textPasswordConfirm = ref();

const authStore = useAuthStore();

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

watch(() => email.value,
    (newValue, oldValue) => {
        confirmEmail.value = emailRegex.test(newValue);
    }
);

watch(() => password.value,
    (newValue, oldValue) => {
        // 8자 이상인지 확인
        confirmLength.value = newValue.length >= 8;

        // 1개 이상의 숫자 확인
        confirmNumber.value = /[0-9]/g.test(newValue);

        // 1개 이상의 대문자 확인
        confirmUppercase.value = /[A-Z]/g.test(newValue);

        // 패스워드 확인
        matchPassword.value = newValue == passwordConfirm.value;
    }
);

watch(() => passwordConfirm.value,
    (newValue, oldValue) => {
        matchPassword.value = newValue == password.value;
    }
);

const doRegst = (async() => {
    if(userName.value.length < 1){
        toast.warning('이름을 입력해주세요');
        textUserName.value.focus();
        return;
    }

    if(!confirmEmail.value){
        toast.warning('이메일 형식이 맞지 않습니다.');
        textEmail.value.focus();
        return;
    }

    if(!confirmLength.value || !confirmNumber.value || !confirmUppercase.value){
        toast.warning('패스워드 형식이 맞지 않습니다.');
        textPassword.value.focus();
        return;
    }

    if(!matchPassword.value){
        toast.warning('패스워드가 일치하지 않습니다.');
        textPasswordConfirm.value.focus();
        return;
    }

    const response = await AuthApi.registUserAsync(email.value, password.value, userName.value);

    if(response.success){
        authStore.token = response.token;
        authStore.folderId = response.folderId;
        authStore.shareId = response.shareId;
        authStore.trashId = response.trashId;

        localStorage.setItem('token', authStore.token);
        localStorage.setItem('folderId', authStore.folderId);
        localStorage.setItem('shareId', authStore.shareId);
        localStorage.setItem('trashId', authStore.trashId);

        router.push('/Main');
    }
    else{
        toast.error('등록에 실패하였습니다. 관리자에게 문의바랍니다.');
    }
});

const moveLogin = (() => {
    router.push('/Login');
})

</script>