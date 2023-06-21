import { useQuasar } from "quasar";

export const useToast = () => {

  const $q = useQuasar()

  return {
    success(msg: string, caption?: string) {
      $q.notify({
        type: 'positive',
        message: msg,
        caption: caption
      })
    },

    error(msg: string, caption?: string) {
      $q.notify({
        type: 'negative',
        message: msg,
        caption: caption
      })
    },

    warning(msg: string, caption?: string) {
      $q.notify({
        type: 'warning',
        message: msg,
        caption: caption
      })
    },

    info(msg: string, caption?: string) {
      $q.notify({
        type: 'info',
        message: msg,
        caption: caption
      })
    },

  }

}