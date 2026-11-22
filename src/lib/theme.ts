/** The stored theme choice (footer switch). See ThemeSwitch and the privacy page. */
export const THEME_KEY = 'sistema-theme'

/** Runs in <head> before paint: applies a stored light or dark choice. */
export const THEME_SCRIPT = `try{var t=localStorage.getItem('${THEME_KEY}');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}`
