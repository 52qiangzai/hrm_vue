import request from '@/utils/request';

// 统计信息
const url = "/home"

// 获取每季度人员个数
export const reqStaffData = () => {
  return request({
    url: url + "/staff"
  })
}

// 获取每日统计数据
export const reqCountData = () => {
  return request({
    url: url + '/count'
  })
}

// 统计各部门员工人数分布情况
export const reqDepartmentData = () => {
    return request({
      url: url + '/department'
    })
  }

// 获取城市社保数据
export const reqCityData = () => {
  return request({
    url: url + '/city'
  })
}

// 获取员工考勤数据
export const reqAttendanceData = (params) => {
  return request({
    url: url + '/attendance',
    params
  })
}
