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

// 更新五险一金
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
export const reqDeleteCity = (id) => {
  return request.delete(`/city/${id}`);
};

// 添加参保城市
export const reqAddCity = (data) => {
  return request.post("/city", data);
};

// 批量删除参保城市
export const reqBatchCity = (strId) => {
  return request.delete(`/city/batch/${strId}`);
};

// 获取员工薪资
export const reqSalaryList = (current, size,...args) => {
  console.log(args);
  if(args.length){
    return request.get("/salary", {
      params: {
        current,
        size,
        ...args[0]
      },
    });
  }else{
    return request.get("/salary", {
      params: {
        current,
        size,
      },
    });
  }
  
};

// 设置工资
export const reqSetSalary = (data) => {
  return request.post("/salary/set", data);
};

// 根据id查询员工工资情况
export const reqSearchStaffSalaryById = (id) => {
  return request.get(`/insurance/staff/${id}`);
};
