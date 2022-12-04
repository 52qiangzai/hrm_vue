import { loginUser } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";
import { setStorage, getStorage,removeStorage } from "@/utils/storage";
const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: {},
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  // SET_NAME: (state, name) => {
  //   state.name = name;
  // },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_USER_INFO: (state, userInfo) => {
    setStorage("userInfo", userInfo);
    state.userInfo = userInfo;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      loginUser({ username: username.trim(), password: password })
        .then((res) => {
          commit("SET_TOKEN", res.token);
          commit("SET_USER_INFO", res.data);
          setToken(res.token);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getInfo(state.token)
      //   .then((response) => {
      //     const { data } = response;

      //     if (!data) {
      //       return reject("Verification failed, please Login again.");
      //     }

      //     const { name, avatar } = data;

      //     commit("SET_NAME", name);
      //     commit("SET_AVATAR", avatar);
      //     resolve(data);
      //   })
      //   .catch((error) => {
      //     reject(error);
      //   });
      if (getStorage("userInfo")) {
        commit("SET_USER_INFO", getStorage("userInfo"));
        resolve("success");
      } else {
        reject("err");
      }
    });
  },

  // 退出登录
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken(); // must remove  token  first
      resetRouter();
      removeStorage('userInfo')
      commit("RESET_STATE");
      resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
