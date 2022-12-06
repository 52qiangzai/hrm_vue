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

//修改staff信息
export const reqUpdateStaffInfo = (info) => {
  return request.put("/staff", info);
};
