import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        token: localStorage.getItem('token'),
        folderId: localStorage.getItem('folderId'),
        shareId: localStorage.getItem('shareId'),
        trashId: localStorage.getItem('trashId'),
        langCode: localStorage.getItem('langCode'),
        returnUrl: null
    }),
    actions: {
        logout() {
            this.token = null;
            this.folderId = null;
            this.shareId = null;
            this.trashId = null;

            localStorage.removeItem('token');
            localStorage.removeItem('folderId');
            localStorage.removeItem('shareId');
            localStorage.removeItem('trashId');
            localStorage.removeItem('langCode');
            //router.push('/login');
            return '/login';
        }
    }
});