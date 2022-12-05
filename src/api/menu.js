import request from "@/utils/request";

const url = "/menu";

//获取菜单列表
export const getStaffMenu = (id) => {
  return request({
    url: url + "/staff/" + id,
  });
};
