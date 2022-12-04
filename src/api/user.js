import request from "@/utils/request";

// 用户登录
export const loginUser = ({ username, password }) => {
  return request({
    url: "/login",
    method: "post",
    data: {
      code: username,
      password,
    },
  });
};
