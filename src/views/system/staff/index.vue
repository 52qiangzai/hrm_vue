<template>
  <div class="app-container">
    <el-alert
      title="员工管理"
      style="margin: 10px 0"
      type="success"
      description="对系统的员工统一管理，我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的。"
    >
    </el-alert>

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

    <!-- 表格 -->
    <CommonTable
      :tableData="table.tableData"
      :tableLabel="table.tableLabel"
      :pageConfig="table.pageConfig"
    >
      <template v-slot:slot1="{ obj }">
        <el-button type="warning" size="mini" @click="selectRole(obj)"
          >分配角色 <i class="el-icon-user-solid"
        /></el-button>
      </template>
    </CommonTable>
    <!-- 编辑新增 -->
    <el-dialog
      :title="dialogForm.type === 'add' ? '新增用户' : '更新用户'"
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
    <!-- 分配权限弹窗 -->
    <el-dialog title="角色分配" :visible.sync="roleDialog.isShow">
      <el-checkbox-group v-model="roleDialog.checkedData">
        <el-checkbox
          v-for="(item, index) in roleDialog.roleData"
          :key="index"
          :label="item.id"
          style="margin: 10px"
          border
          >{{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog.isShow = false">取消</el-button>
        <el-button type="primary" @click="handleSetRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CommonTable from "@/components/CommonTable";
import CommonForm from "@/components/CommonForm";
import { reqStaffInfo, reqAllDept, reqAllRole } from "@/api/system";
import {
  reqUpdateStaffInfo,
  reqAddStaffInfo,
  reqDeleteStaffInfo,
  reqBatchStaffInfo,
  reqStaffRoleById,
  reqEditRoleInfo,
} from "@/api/user";
export default {
  name: "staff",
  components: { CommonTable, CommonForm },
  data() {
    return {
      dialogForm: {
        type: "edit",
        isShow: false,
        formItemList: [
          {
            name: "name",
            label: "姓名",
            type: "input",
          },
          {
            name: "deptId",
            label: "部门",
            type: "select",
            optionList: [],
          },
          {
            name: "gender",
            label: "性别",
            type: "select",
            optionList: [
              {
                name: "男",
                id: 0,
              },
              {
                name: "女",
                id: 1,
              },
            ],
          },
          {
            name: "birthday",
            label: "生日",
            type: "date",
          },
          {
            name: "phone",
            label: "电话",
            type: "input",
          },
          {
            name: "address",
            label: "地址",
            type: "input",
          },
          {
            name: "remark",
            label: "备注",
            type: "textarea",
          },
        ],
        formData: {},
      },
      table: {
        tableData: [],
        tableLabel: [
          {
            name: "code",
            label: "工号",
            type: "column",
          },
          {
            name: "name",
            label: "姓名",
            type: "column",
          },
          {
            name: "age",
            label: "年龄",
            type: "column",
            width: 50,
          },

          {
            name: "deptName",
            label: "部门",
            type: "column",
          },
          {
            name: "gender",
            label: "性别",
            type: "gender",
            width: 50,
          },
          {
            name: "phone",
            label: "电话",
            type: "column",
          },
          {
            name: "birthday",
            label: "生日",
            type: "column",
          },
          {
            name: "status",
            label: "状态",
            type: "switch",
            width: 150,
          },
          {
            name: "address",
            label: "地址",
            width: 200,
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
      roleDialog: {
        isShow: false,
        roleData: [],
        checkedData: [],
      },
      searchForm: {
        formItemList: [
          {
            name: "name",
            label: "姓名",
            type: "input",
            icon: "el-icon-search",
          },
          {
            name: "birthday",
            label: "生日",
            type: "date",
            placeholder: "请选择起始日期",
          },
          {
            name: "deptId",
            label: "部门",
            type: "select",
            optionList: [],
          },
          {
            name: "status",
            label: "状态",
            type: "select",
            optionList: [
              {
                id: 1,
                name: "正常",
              },
              {
                id: 0,
                name: "异常",
              },
            ],
          },
        ],
        formData: {},
        inline: true,
      },
      tempId: 0,
    };
  },
  mounted() {
    this.getAllDept();
    this.getStaffInfo();
    this.$bus.$on("sizeChange", (size) => {
      this.table.pageConfig.size = size;
      this.getStaffInfo();
    });
    this.$bus.$on("currentChange", (current) => {
      this.table.pageConfig.current = current;
      this.getStaffInfo();
    });
    this.$bus.$on("edit", (row) => {
      this.dialogForm.type = "edit";
      this.dialogForm.isShow = true;
      this.dialogForm.formData = JSON.parse(JSON.stringify(row));
    });
    this.$bus.$on("statusChange", async (row) => {
      try {
        let res = await reqUpdateStaffInfo(row);
        if (res.code === 200) {
          this.$message.success(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    });
    this.$bus.$on("del", (row) => {
      this.deleteStaff(row.id);
    });
    this.$bus.$on("selectionChange", (val) => {
      this.ids = val.map((item) => item.id);
    });
  },
  methods: {
    handleAdd() {
      this.dialogForm.isShow = true;
      this.dialogForm.type = "add";
      this.getAllDept();
    },
    handleDeleteBatch() {
      this.batchDeleteStaffInfo(this.ids.toString());
    },
    async selectRole(obj) {
      this.roleDialog.isShow = true;
      try {
        this.tempId = obj.id;
        let res = await reqStaffRoleById(obj.id);
        let res1 = await reqAllRole();
        if (res.code === 200 && res1.code === 200) {
          this.roleDialog.checkedData = res.data.map((item) => item.roleId);
          this.roleDialog.roleData = res1.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 确定弹窗,修改角色信息
    async handleSetRole() {
      try {
        let res = await reqEditRoleInfo(
          this.tempId,
          this.roleDialog.checkedData
        );
        if (res.code === 200) {
          this.$message.success(res.message);
          this.roleDialog.isShow = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 获取员工信息
    async getStaffInfo() {
      try {
        let res = await reqStaffInfo(
          this.table.pageConfig.current,
          this.table.pageConfig.size,
          this.searchForm.formData
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
    // 获取所有部门信息
    async getAllDept() {
      try {
        let res = await reqAllDept();
        if (res.code === 200) {
          let list = [];
          res.data.map((dept) => {
            if (dept.children.length > 0) {
              dept.disabled = true;
              list.push(dept);
              dept.children.map((subDept) => {
                list.push(subDept);
              });
            }
          });
          this.dialogForm.formItemList[1].optionList = list;
          this.searchForm.formItemList[2].optionList = list;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async confirm() {
      try {
        let res;
        if (this.dialogForm.type === "edit") {
          res = await reqUpdateStaffInfo(this.dialogForm.formData);
        } else {
          res = await reqAddStaffInfo(this.dialogForm.formData);
        }
        if (res.code === 200) {
          this.$message.success(res.message);
          this.dialogForm.isShow = false;
          this.getStaffInfo();
        }
      } catch (error) {}
    },
    // 删除员工信息
    async deleteStaff(id) {
      try {
        let res = await reqDeleteStaffInfo(id);
        if (res.code === 200) {
          this.$message.success(res.message);
          this.getStaffInfo();
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 批量删除员工信息
    async batchDeleteStaffInfo(idStr) {
      try {
        let res = await reqBatchStaffInfo(idStr);
        if (res.code === 200) {
          this.$message.success(res.message);
          this.getStaffInfo();
        }
      } catch (error) {
        console.log(error);
      }
    },
    search() {
      this.getStaffInfo();
    },
    reset() {
      this.searchForm.formData = {};
      this.getStaffInfo();
    },
  },
};
</script>
