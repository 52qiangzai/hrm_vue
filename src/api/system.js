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
