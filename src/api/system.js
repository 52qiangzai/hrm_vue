import request from "@/utils/request";

// 查询文件信息
export const reqFileInfo = (current, size, ...args) => {
  const [name] = args;
  return request.get("/docs", {
    params: {
      current,
      size,
      name,
    },
  });
};

// 新增文件信息
export const reqAddFileInfo = (data) => {
  return request.put("/docs", data);
};

// 删除文件信息
export const reqDeleteFileInfo = (id) => {
  return request.delete(`/docs/${id}`);
};

// 批量删除文件
export const reqBatchDeleteFileInfo = (idStr) => {
  return request.delete(`/docs/batch/${idStr}`);
};

// 获取员工信息
export const reqStaffInfo = (current, size, data) => {
  return request({
    url: "/staff/page",
    method: "post",
    params: {
      current,
      size,
    },
    data,
  });
};

// 获取所有部门信息
export const reqAllDept = () => {
  return request.get("/dept/all");
};

// 获取所以角色信息
export const reqAllRole = () => {
  return request.get("/role/all");
};
