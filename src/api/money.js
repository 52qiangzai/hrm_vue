import request from "@/utils/request";

// 获取五险一金列表
export const reqInsurance = (current, size, ...args) => {
  const [name] = args;
  return request.get("/insurance", {
    params: {
      current,
      size,
      name,
    },
  });
};

// 根据id获取五险一金详情
export const reqInsuranceDetailById = (id) => {
  return request(`/insurance/${id}`);
};

export const reqSetInsurance = (data) => {
  return request.post("/insurance/set", data);
};

// 获取搜所有参保城市
export const reqAllCity = () => {
  return request.get("/city/all");
};

//根据id获取当前参保城市信息
export const reqCityDetailById = (cityId) => {
  return request.get(`/city/${cityId}`);
};
