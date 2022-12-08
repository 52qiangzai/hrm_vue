import request from "@/utils/request";

// 员工请假详情
export const reqStaffLeaveDetail = (current, size, ...args) => {
  const [name] = args;
  return request.get("/staff-leave", {
    params: {
      current,
      size,
      name,
    },
  });
};

export const reqEditLeaveDetail = (data) => {
  return request({
    url: "/staff-leave",
    method: "put",
    data,
  });
};
