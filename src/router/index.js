import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    name: "login",
    hidden: true,
    meta: {
      title: "用户登录",
    },
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
    meta: {
      title: "当且页面不存在",
    },
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "主页", icon: "dashboard" },
      },
    ],
  },

  {
    name: "money",
    path: "/money",
    component: Layout,
    children: [
      {
        name: "insurance",
        path: "insurance",
        meta: { title: "五险一金", icon: "s-finance-1" },
        component: () => import("@/views/money/insurance"),
      },
      {
        name: "city",
        path: "city",
        meta: { title: "参保城市", icon: "s-finance-2" },
        component: () => import("@/views/money/city"),
      },
      {
        name: "salary",
        path: "salary",
        meta: { title: "工资管理", icon: "s-finance-3" },
        component: () => import("@/views/money/salary"),
      },
    ],
    meta: { title: "薪资管理", icon: "s-finance" },
  },
  {
    name: "permission",
    path: "/permission",
    component: Layout,
    children: [
      {
        name: "role",
        path: "role",
        meta: { title: "角色管理", icon: "s-cooperation-1" },
        component: () => import("@/views/permission/role"),
      },
      {
        name: "menu",
        path: "menu",
        component: () => import("@/views/permission/menu"),
        meta: { title: "菜单管理", icon: "s-cooperation-2" },
      },
    ],
    meta: { title: "权限管理", icon: "s-cooperation" },
  },
  {
    name: "system",
    path: "/system",
    component: Layout,
    children: [
      {
        name: "docs",
        path: "docs",
        meta: { title: "文件管理", icon: "s-management-1" },
        component: () => import("@/views/system/docs"),
      },
      {
        name: "staff",
        path: "staff",
        meta: { title: "员工管理", icon: "s-management-2" },
        component: () => import("@/views/system/staff"),
      },
      {
        name: "department",
        path: "department",
        meta: { title: "部门管理", icon: "s-management-3" },
        component: () => import("@/views/system/department"),
      },
    ],
    meta: { title: "系统管理", icon: "s-management" },
  },
  {
    name: "attendance",
    path: "/attendance",
    component: Layout,
    children: [
      {
        name: "leave",
        path: "leave",
        meta: { title: "请假审批", icon: "edit-2" },
        component: () => import("@/views/attendance/leave"),
      },
      {
        name: "performance",
        path: "performance",
        meta: { title: "考勤表现", icon: "edit-1" },
        component: () => import("@/views/attendance/performance"),
      },
    ],
    meta: { title: "考勤管理", icon: "edit" },
  },

  // {
  //   path: "/example",
  //   component: Layout,
  //   redirect: "/example/table",
  //   name: "Example",
  //   meta: { title: "Example", icon: "el-icon-s-help" },
  //   children: [
  //     {
  //       path: "table",
  //       name: "Table",
  //       component: () => import("@/views/table/index"),
  //       meta: { title: "Table", icon: "table" },
  //     },
  //     {
  //       path: "tree",
  //       name: "Tree",
  //       component: () => import("@/views/tree/index"),
  //       meta: { title: "Tree", icon: "tree" },
  //     },
  //   ],
  // },

  // {
  //   path: "/form",
  //   component: Layout,
  //   children: [
  //     {
  //       path: "index",
  //       name: "Form",
  //       component: () => import("@/views/form/index"),
  //       meta: { title: "Form", icon: "form" },
  //     },
  //   ],
  // },

  // {
  //   path: "/nested",
  //   component: Layout,
  //   redirect: "/nested/menu1",
  //   name: "Nested",
  //   meta: {
  //     title: "Nested",
  //     icon: "nested",
  //   },
  //   children: [
  //     {
  //       path: "menu1",
  //       component: () => import("@/views/nested/menu1/index"), // Parent router-view
  //       name: "Menu1",
  //       meta: { title: "Menu1" },
  //       children: [
  //         {
  //           path: "menu1-1",
  //           component: () => import("@/views/nested/menu1/menu1-1"),
  //           name: "Menu1-1",
  //           meta: { title: "Menu1-1" },
  //         },
  //         {
  //           path: "menu1-2",
  //           component: () => import("@/views/nested/menu1/menu1-2"),
  //           name: "Menu1-2",
  //           meta: { title: "Menu1-2" },
  //           children: [
  //             {
  //               path: "menu1-2-1",
  //               component: () =>
  //                 import("@/views/nested/menu1/menu1-2/menu1-2-1"),
  //               name: "Menu1-2-1",
  //               meta: { title: "Menu1-2-1" },
  //             },
  //             {
  //               path: "menu1-2-2",
  //               component: () =>
  //                 import("@/views/nested/menu1/menu1-2/menu1-2-2"),
  //               name: "Menu1-2-2",
  //               meta: { title: "Menu1-2-2" },
  //             },
  //           ],
  //         },
  //         {
  //           path: "menu1-3",
  //           component: () => import("@/views/nested/menu1/menu1-3"),
  //           name: "Menu1-3",
  //           meta: { title: "Menu1-3" },
  //         },
  //       ],
  //     },
  //     {
  //       path: "menu2",
  //       component: () => import("@/views/nested/menu2/index"),
  //       name: "Menu2",
  //       meta: { title: "menu2" },
  //     },
  //   ],
  // },

  // {
  //   path: "external-link",
  //   component: Layout,
  //   children: [
  //     {
  //       path: "https://panjiachen.github.io/vue-element-admin-site/#/",
  //       meta: { title: "External Link", icon: "link" },
  //     },
  //   ],
  // },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
