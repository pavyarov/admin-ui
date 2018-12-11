export const email = (emailValue) =>
  !!/^[a-z0-9.+_-]+@[a-z0-9_.-]+?\.[a-z0-9]{2,}$/i.exec(emailValue);
export const password = (passwordValue) => passwordValue && !!/^(.){4,64}$/.exec(passwordValue);
export const login = (loginValue) => loginValue && !!/^[0-9a-zA-Z-_.]{1,128}$/.exec(loginValue);
export const search = (value) => value.length >= 3 && value.length <= 128;
export const name = (value) => value && value.length >= 3 && value.length <= 128;
export const description = (value) => value.length <= 1024;
