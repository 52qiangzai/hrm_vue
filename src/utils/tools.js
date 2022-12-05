// 时间格式化
export const currentDateInfo = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let currentDate = date.getDate();
  let day = date.getDay();
  const dayOfWeek = [
    "星期天",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  return year + "年" + month + "月" + currentDate + "日" + " " + dayOfWeek[day];
};

// 返回格式化时间 202201
export const nowDateInfo = (date) => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  if (month <= 9) {
    month = "0" + month;
  }
  return `${year}${month}`;
};


// 路由格式化
export const setDiyRoute = (menuList) => {
  const menuRes = [];
  menuList.forEach((menu) => {
    const route = {
      name: menu.code,
      path: menu.path,
      component: () => import("../views/" + menu.code),
      children: [],
      meta: {
        title: menu.name,
        icon: menu.icon,
      },
    };
    // 判断是否有子菜单
    if (menu.children.length > 0) {
      menu.children.forEach((subMenu) => {
        route.children.push({
          name: subMenu.code,
          path: subMenu.path,
          component: () => import("../views/" + menu.code + "/" + subMenu.code),
          children: [],
          meta: {
            title: menu.name,
            icon: menu.icon,
          },
        });
      });
    }
    menuRes.push(route);
  });
  return menuRes;
};