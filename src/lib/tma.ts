export function initTMA() {
  if (import.meta.env.VITE_DEV_MODE && !window.Telegram) {
    window.Telegram = {
      WebApp: {
        ready: () => {},
        expand: () => {},
        close: () => {},
        enableClosingConfirmation: () => {},
        themeParams: {},
        initDataUnsafe: {
          user: { id: 123, first_name: 'Test', username: 'testuser' },
        },
        HapticFeedback: {
          impactOccurred: () => {},
          notificationOccurred: () => {},
        },
        showAlert: (msg) => window.alert(msg),
        showConfirm: (msg, cb) => cb(window.confirm(msg)),
        BackButton: { show: () => {}, hide: () => {}, onClick: () => {} },
        MainButton: {
          text: '',
          show: () => {},
          hide: () => {},
          onClick: () => {},
          offClick: () => {},
          setParams: () => {},
        },
      },
    }
  }

  const tg = window.Telegram?.WebApp
  if (!tg) return

  tg.ready()
  tg.expand()
  tg.enableClosingConfirmation()

  document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#ffffff')
  document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color || '#f1f1f1')
  document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000')
  document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#999999')
  document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#1D9E75')
  document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#1D9E75')
  document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff')
}

export function haptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'error') {
  const tg = window.Telegram?.WebApp
  if (!tg?.HapticFeedback) return
  if (type === 'success') {
    tg.HapticFeedback.notificationOccurred('success')
  } else if (type === 'error') {
    tg.HapticFeedback.notificationOccurred('error')
  } else {
    tg.HapticFeedback.impactOccurred(type)
  }
}

export function showAlert(msg: string) {
  window.Telegram?.WebApp?.showAlert(msg)
}

export function showConfirm(msg: string, cb: (ok: boolean) => void) {
  window.Telegram?.WebApp?.showConfirm(msg, cb)
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        close: () => void
        enableClosingConfirmation: () => void
        themeParams: {
          bg_color?: string
          secondary_bg_color?: string
          text_color?: string
          hint_color?: string
          link_color?: string
          button_color?: string
          button_text_color?: string
        }
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            photo_url?: string
          }
        }
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy') => void
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void
        }
        showAlert: (msg: string, cb?: () => void) => void
        showConfirm: (msg: string, cb: (ok: boolean) => void) => void
        BackButton: {
          show: () => void
          hide: () => void
          onClick: (cb: () => void) => void
        }
        MainButton: {
          text: string
          show: () => void
          hide: () => void
          onClick: (cb: () => void) => void
          offClick: (cb: () => void) => void
          setParams: (params: { text?: string; color?: string; is_active?: boolean }) => void
        }
      }
    }
  }
}
