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

// 更新密码
export const reqUpdatePassword = (data) => {
  return request.put("/staff/pwd", data);
};

// 检查密码正确
export const reqCheckPassword = (pwd, id) => {
  return request.get(`/staff/check/${pwd}/${id}`)
}
