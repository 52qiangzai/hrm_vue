const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  userInfo: (state) => state.user.userInfo,
  menuList :(state)=> state.menu.menuList
};
export default getters;
