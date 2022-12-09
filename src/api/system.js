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

// 获取所有部门信息
export const reqDeptList = (current, size, ...args) => {
  const [name] = args;
  return request.get("/dept", {
    params: {
      current,
      size,
      name,
    },
  });
};

// 修改部门信息
export const reqUpdateDeptInfo = (data) => {
  return request.put("/dept", data);
};

// 添加部门信息
export const reqAddDeptInfo = (data) => {
  return request.post("/dept", data);
};

// 删除部门信息
export const reqDeleteDeptInfo = (id) => {
  return request.delete(`/dept/${id}`);
};

// 批量删除部门信息
export const reqBatchDeleteDeptInfo = (idStr) => {
  return request.delete(`/dept/batch/${idStr}`);
};

// 获取考勤信息
export const reqWorkTime = (workId) => {
  return request.get(`/work-time/${workId}`);
};

//修改出勤信息
export const reqUpdateWorkTime = (data) => {
  return request.post("/work-time/set", data);
};

// 获取所有请假类型
export const reqAllLeaveType = () => {
  return request.get("/leave-type/all");
};

// 根据请假类型获取请假详情
export const reqLeaveDetail = (deptId, typeId) => {
  return request.get(`/leave/${deptId}/${typeId}`);
};

// 发送请假请求
export const reqLeaveInfo = (data) => {
  return request.post("/leave/set", data);
};
