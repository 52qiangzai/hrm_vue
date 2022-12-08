<template>
  <div class="app-container">
    <el-alert
      title="角色管理"
      style="margin: 10px 0"
      type="success"
      description="对系统角色进行统一管理，我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的。"
    >
    </el-alert>
    <div style="margin: 10px 0">
      <el-button type="primary" @click="handleAdd" size="mini"
        >新增 <i class="el-icon-circle-plus-outline"></i>
      </el-button>
      <el-popconfirm
        style="margin-left: 10px"
        confirm-button-text="确定"
        cancel-button-text="我再想想"
        icon="el-icon-info"
        icon-color="red"
        title="你确定删除吗？"
        @onConfirm="handleDeleteBatch"
      >
        <el-button type="danger" size="mini" slot="reference"
          >批量删除 <i class="el-icon-remove-outline"></i>
        </el-button>
      </el-popconfirm>
    </div>
    <div style="margin: 10px 0">
      <CommonForm
        :formItemList="searchForm.formItemList"
        :formData="searchForm.formData"
        :inline="searchForm.inline"
      >
        <el-button type="primary" @click="search" size="mini"
          >搜索 <i class="el-icon-search"
        /></el-button>
        <el-button type="danger" @click="reset" size="mini"
          >重置 <i class="el-icon-refresh-left"
        /></el-button>
      </CommonForm>
    </div>
    <CommonTable
      :tableData="table.tableData"
      :tableLabel="table.tableLabel"
      :pageConfig="table.pageConfig"
    >
      <template v-slot:slot1="{ obj }">
        <el-button size="mini" type="warning" @click="handlePermission(obj)"
          >分配权限 <i class="el-icon-menu"></i
        ></el-button> </template
    ></CommonTable>
    <!-- 角色编辑 -->
    <el-dialog
      :title="dialogForm.type === 'add' ? '新增角色' : '更新角色'"
      :visible.sync="dialogForm.isShow"
    >
      <CommonForm
        :formItemList="dialogForm.formItemList"
        :formData="dialogForm.formData"
        :inline="dialogForm.inline"
      ></CommonForm>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm.isShow = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog :title="'分配权限'" :visible.sync="permissionForm.isShow">
      <el-tree
        :data="permissionForm.treeData"
        show-checkbox
        default-expand-all
        @check="checkChange"
        node-key="id"
        :default-checked-keys="permissionForm.checked"
        :props="permissionForm.defaultProps"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionForm.isShow = false">取消</el-button>
        <el-button type="primary" @click="confirmPermission">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CommonTable from "@/components/CommonTable";
import CommonForm from "@/components/CommonForm";
import {
  reqSystemRoleList,
  reqUpdateRoleInfo,
  reqAddRoleInfo,
  reqDeleteRoleInfo,
  reqBatchDeleteRoleInfo,
  reqAllMenu,
  reqMenuListById,
  reqRolePermission,
} from "@/api/permission";
export default {
  name: "role",
  components: { CommonTable, CommonForm },
  data() {
    return {
      dialogForm: {
        type: "edit",
        isShow: false,
        formItemList: [
          {
            type: "input",
            name: "code",
            label: "编号",
          },
          {
            type: "input",
            name: "name",
            label: "职称",
          },
          {
            type: "textarea",
            name: "remake",
            label: "备注",
          },
        ],
        formData: {},
      },
      searchForm: {
        formItemList: [
          {
            name: "name",
            label: "职称",
            type: "input",
            icon: "el-icon-search",
          },
        ],
        formData: {},
        inline: true,
      },
      permissionForm: {
        isShow: false,
        treeData: [],
        defaultProps: {
          children: "children",
          label: "name",
        },
        checked: [],
      },
      table: {
        tableData: [],
        tableLabel: [
          {
            name: "code",
            label: "编号",
            type: "column",
          },
          {
            name: "name",
            label: "职称",
            type: "column",
          },
          {
            name: "remark",
            label: "备注",
            type: "column",
            width: 200,
          },
        ],
        pageConfig: {
          total: 10, // 记录总数
          current: 1, // 起始页
          size: 10, // 每页展示的记录数
        },
      },
      ids: [],
      id: 0,
    };
  },
  mounted() {
    this.getSystemRoleList();

    this.$bus.$on("sizeChange", (size) => {
      this.table.pageConfig.size = size;
      this.getSystemRoleList();
    });

    this.$bus.$on("currentChange", (current) => {
      this.table.pageConfig.current = current;
      this.getSystemRoleList();
    });

    this.$bus.$on("edit", (row) => {
      this.dialogForm.type = "edit";
      this.dialogForm.formData = JSON.parse(JSON.stringify(row));
      this.dialogForm.isShow = true;
    });

    this.$bus.$on("del", (row) => {
      this.deleteRoleInfo(row.id);
    });

    this.$bus.$on("selectionChange", (data) => {
      this.ids = data.map((item) => item.id);
    });
  },
  methods: {
    // 获取系统角色列表
    async getSystemRoleList() {
      try {
        let res = await reqSystemRoleList(
          this.table.pageConfig.current,
          this.table.pageConfig.size
        );
        if (res.code === 200) {
          const { list, total } = res.data;
          this.table.pageConfig.total = total;
          this.table.tableData = list;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 确定角色信息
    async confirm() {
      try {
        let res;
        if (this.dialogForm.type === "edit") {
          res = await reqUpdateRoleInfo(this.dialogForm.formData);
        } else {
          res = await reqAddRoleInfo(this.dialogForm.formData);
        }
        if (res.code === 200) {
          this.$message.success(res.message);
          this.dialogForm.isShow = false;
          this.getSystemRoleList();
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 删除用户角色
    async deleteRoleInfo(id) {
      try {
        let res = await reqDeleteRoleInfo(id);
        if (res.code === 200) {
          this.$message.success(res.message);
          this.getSystemRoleList();
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 增加角色
    handleAdd() {
      this.dialogForm.formData = {};
      this.dialogForm.type = "add";
      this.dialogForm.isShow = true;
    },
    //批量删除
    async handleDeleteBatch() {
      try {
        let res = await reqBatchDeleteRoleInfo(this.ids.toString());
        if (res.code === 200) {
          this.$message.success(res.message);
          this.getSystemRoleList();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async search() {
      try {
        let res = await reqSystemRoleList(
          this.table.pageConfig.current,
          this.table.pageConfig.size,
          this.searchForm.formData.name
        );
        if (res.code === 200) {
          const { list, total } = res.data;
          this.table.pageConfig.total = total;
          this.table.tableData = list;
        }
      } catch (error) {
        console.log(error);
      }
    },
    reset() {
      this.searchForm.formData.name = "";
      this.getSystemRoleList();
    },
    async handlePermission({ id }) {
      this.permissionForm.isShow = true;
      this.id = id;
      try {
        let res1 = await reqMenuListById(id);
        let res = await reqAllMenu();
        if (res.code === 200 && res1.code === 200) {
          this.permissionForm.checked = res1.data.map((item) => item.menuId);
          this.permissionForm.treeData = res.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 确定权限
    async confirmPermission() {
      try {
        let res = await reqRolePermission(this.id, this.permissionForm.checked);
        if (res.code === 200) {
          this.$message.success(res.message);
          this.permissionForm.isShow = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    checkChange(a, { checkedKeys }) {
      this.permissionForm.checked = checkedKeys;
    },
  },
  beforeDestroy() {
    this.$bus.$off("sizeChange");
    this.$bus.$off("currentChange");
    this.$bus.$off("edit");
    this.$bus.$off("del");
    this.$bus.$off("selectionChange");
  },
};
</script>
