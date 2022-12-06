import request from "@/utils/request";

export const reqUploadFile = () => {
  return window.location.origin + "/api/docs/upload";
  //   return request.post("/docs/upload", file);
};
