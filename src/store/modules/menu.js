import { getStaffMenu } from "@/api/menu";

const state = {
  menuList: [],
};
const mutations = {
  GET_MENU_LIST(state, menuList) {
    state.menuList = menuList;
  },
};

const actions = {
  async getMenuList({ commit }, id) {
    let res = await getStaffMenu(id);
    return new Promise((resolve, reject) => {
      if (res.code === 200) {
        commit("GET_MENU_LIST", res.data);
        console.log(res.data);
        resolve();
      } else {
        reject();
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
