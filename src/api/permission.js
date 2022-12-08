import request from "@/utils/request";

// 获取系统角色信息列表
export const reqSystemRoleList = (current, size, ...args) => {
  const [name] = args;
  return request.get("/role", {
    params: {
      current,
      size,
      name,
    },
  });
};

// 修改角色信息
export const reqUpdateRoleInfo = (data) => {
  return request.put("/role", data);
};

// 新增角色信息
export const reqAddRoleInfo = (data) => {
  return request.post("/role", data);
};

// 删除角色信息
export const reqDeleteRoleInfo = (id) => {
  return request.delete(`/role/${id}`);
};

// 批量删除角色信息
export const reqBatchDeleteRoleInfo = (idStr) => {
  return request.delete(`/role/batch/${idStr}`);
};

//获取全部菜单权限
export const reqAllMenu = () => {
  return request.get("/menu/all");
};

// 根据id获取权限列表
export const reqMenuListById = (id) => {
  return request.get(`/role/menu/${id}`);
};

// 改变用户权限列表

export const reqRolePermission = (id, data) => {
  return request.post(`/role/menu/${id}`, data);
};
