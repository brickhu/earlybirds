import buyback from "../pages/buyback";

export const env = {
    artoken_pid : import.meta.env.VITE_ARTOKEN_PROCESS,
    checkin_pid : import.meta.env.VITE_CHECKIN_PROCESS,
    captcha_pid : import.meta.env.VITE_CAPTCHA_PROCESS,
    buyback_pid : import.meta.env.VITE_BUYBACK_PROCESS,
    wrom_pid : import.meta.env.VITE_WORM_PROCESS,
    app_name : import.meta.env.VITE_APP_NAME,
    app_version : import.meta.env.VITE_APP_VERSION,
    ao_browser : "https://www.ao.link/",
    hyperbeam_url : import.meta.env.VITE_HYPERBEAM_URL
  }