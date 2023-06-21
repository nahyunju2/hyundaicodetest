import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from '@/stores/auth';

import Login from "./login.vue";
import RegstUser from "./regst-user.vue";
import Main from "./main.vue";

const router = createRouter({
    history: createWebHistory('/'),
    routes: [
        {
            name: "Login",
            path: "/Login",
            component: Login,
        },
        {
            name: "RegstUser",
            path: "/RegstUser",
            component: RegstUser,
        },
        {
            name: "Main",
            path: "/Main",
            component: Main,
        },
        {
            name: "Main2",
            path: "",
            component: Main,
        }
    ],
})

router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login', '/regstuser'];
    const authRequired = !publicPages.includes(to.path.toLocaleLowerCase());
    const auth = useAuthStore();

    if(auth.token && !authRequired){
        return '/Main';
    }

    if (authRequired && !auth.token) {
        auth.returnUrl = to.fullPath;
        return '/Login';
    }
});

export default router;
