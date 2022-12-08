// 上传文件
export const reqUploadFile = () => {
  return window.location.origin + "/api/docs/upload";
};

// 文件下载
export const reqDownloadApi = () => {
  return (
    window.location.protocol +
    "//" +
    window.location.hostname +
    ":8888" +
    "/docs/download/"
  );
};
