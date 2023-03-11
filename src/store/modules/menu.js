import { getStaffMenu } from "@/api/menu";
import router, { myRoutes, constantRoutes, resetRouter } from "@/router";
import { getStorage, setStorage } from "@/utils/storage";
const state = {
  menuList: [],
};
const mutations = {
  GET_MENU_LIST(state, menuList) {
    state.menuList = menuList;
    router.options.routes = constantRoutes.concat(myRoutes(state.menuList));
    myRoutes(state.menuList).forEach((route) => {
      router.addRoute(route);
    });
  },
  RESET_MENU(state) {
    state.menuList.splice(0, state.menuList.length);
  },
};

const actions = {
  async getMenuList({ commit }, id) {
    return new Promise(async (resolve, reject) => {
      if (getStorage("menuList")) {
        commit("GET_MENU_LIST", getStorage("menuList"));
        resolve(getStorage("menuList"));
        // setStorage("menuList", res.data);
      } else {
        let res = await getStaffMenu(id);
        if (res.code === 200) {
          commit("GET_MENU_LIST", res.data);
          setStorage("menuList", res.data);
          resolve(res.data);
        } else {
          reject();
        }
      }
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
