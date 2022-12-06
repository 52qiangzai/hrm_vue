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

// 获取参保城市列表
export const reqCityList = (current, size) => {
  return request.get("/city", {
    params: {
      current,
      size,
    },
  });
};

// 修改参保城市信息
export const reqUpdateCity = (data) => {
  return request.put("/city", data);
};

// 删除参保城市信息
export const reqDeleteCity = (id)=>{
  return request.delete(`/id/${id}`)
}