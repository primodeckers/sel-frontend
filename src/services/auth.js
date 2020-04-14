export const TOKEN_KEY = "@sel-token";
export const USER = "@sel-username";
export const PERFIL = "@sel-perfil";

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUsername = () => localStorage.getItem(USER);
export const getPerfil = () => localStorage.getItem(PERFIL);
export const hasPermission = (profile) => profile.includes(localStorage.getItem(PERFIL));

export const DATA_USER = {
  username: getUsername(),
  perfil: getPerfil()
}

export const login = token => {
  localStorage.setItem(TOKEN_KEY, token);
};
export const userSession = user => {
  localStorage.setItem(USER, user);
}  

export const userPerfil = perfil => {
  localStorage.setItem(PERFIL, perfil);
} 
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER);
  localStorage.removeItem(PERFIL);
  
};

