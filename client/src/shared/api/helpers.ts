const setCookie = (name: string, value: string, days = 1) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date?.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/`;
};

const getCookie = (name: string) => {
  const currentCookie = document.cookie.split(";");
  const cookieValue = currentCookie
    .find((cookie) => name === cookie.split("=")[0].trim())
    ?.split("=")[1];

  return cookieValue || null;
};

export { setCookie, getCookie };
