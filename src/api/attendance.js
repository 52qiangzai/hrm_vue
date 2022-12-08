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

// 获取人员考勤表现
export const reqAttendanceList = (current, size, ...args) => {
  const [name, month] = args;
  return request({
    url: "/attendance",
    method: "get",
    params: {
      current,
      size,
      name,
      month,
    },
  });
};

export const reqUpdateStaffAttendance = (data) => {
  return request.put("/attendance/set", data);
};
