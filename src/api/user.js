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

// 增加staff信息
export const reqAddStaffInfo = (info) => {
  return request.post("/staff", info);
};

// 删除员工信息
export const reqDeleteStaffInfo = (id) => {
  return request.delete(`/staff/${id}`);
};

// 更新密码
export const reqUpdatePassword = (data) => {
  return request.put("/staff/pwd", data);
};

// 批量删除员工信息
export const reqBatchStaffInfo = (idStr) => {
  return request.delete(`/staff/batch/${idStr}`);
};

// 根据id获取员工角色
export const reqStaffRoleById = (id) => {
  return request.get(`/staff/role/${id}`);
};

// 修改角色信息
export const reqEditRoleInfo = (id, data) => {
  return request.post(`/staff/role/${id}`, data);
};

// 检查密码正确
export const reqCheckPassword = (pwd, id) => {
  return request.get(`/staff/check/${pwd}/${id}`);
};
