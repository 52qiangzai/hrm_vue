<template>
  <div class="app-container">
    <el-alert
      title="部门管理"
      style="margin: 10px 0"
      type="success"
      description="对系统的所有部门进行统一得管理，我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的。"
    >
    </el-alert>
    <div style="margin: 0 0 10px 0">
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
    <!-- 搜索 -->
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
    <CommonTable
      :tableData="table.tableData"
      :tableLabel="table.tableLabel"
      :pageConfig="table.pageConfig"
    >
      <template v-slot:slot1="{ obj }">
        <el-button
          type="warning"
          size="mini"
          v-if="obj.parentId === 0"
          @click="handleSubAdd(obj)"
          >新增部门 <i class="el-icon-circle-plus-outline"
        /></el-button>
        <el-button
          type="info"
          size="mini"
          v-if="obj.parentId !== 0"
          @click="handleSetting(obj)"
          >考勤设置 <i class="el-icon-setting"
        /></el-button>
      </template>
    </CommonTable>
    <!-- 新增部门或者更新部门 -->
    <el-dialog
      :title="dialogForm.type === 'add' ? '新增部门' : '更新部门'"
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
    <!-- 出勤弹窗 -->
    <el-dialog
      :title="settingDialog.activeTabLabel"
      :visible.sync="settingDialog.isShow"
      fullscreen
    >
      <el-tabs
        type="border-card"
        @tab-click="clickTab"
        v-model="settingDialog.activeTabName"
      >
        <el-tab-pane label="出勤设置" name="workTime">
          <el-form
            ref="workTimeForm"
            label-width="100px"
            size="mini"
            :model="settingDialog.workTimeForm.formData"
            :rules="settingDialog.workTimeForm.rules"
          >
            <el-form-item label="出勤时间" style="margin-top: 10px">
              <el-form-item
                label="早上"
                label-width="40px"
                style="margin-bottom: 5px"
              >
                <el-form-item style="display: inline-block" prop="morStartTime">
                  <el-time-select
                    placeholder="开始"
                    :editable="false"
                    :picker-options="
                      settingDialog.workTimeForm.morning.startOption
                    "
                    v-model="settingDialog.workTimeForm.formData.morStartTime"
                  />
                </el-form-item>
                <span> - </span>
                <el-form-item style="display: inline-block" prop="morEndTime">
                  <el-time-select
                    placeholder="结束"
                    :editable="false"
                    :picker-options="
                      settingDialog.workTimeForm.morning.endOption
                    "
                    v-model="settingDialog.workTimeForm.formData.morEndTime"
                  />
                </el-form-item>
              </el-form-item>
              <el-form-item label="下午" label-width="40px">
                <el-form-item style="display: inline-block" prop="aftStartTime">
                  <el-time-select
                    placeholder="开始"
                    :editable="false"
                    :picker-options="
                      settingDialog.workTimeForm.afternoon.startOption
                    "
                    v-model="settingDialog.workTimeForm.formData.aftStartTime"
                  />
                </el-form-item>
                <span> - </span>
                <el-form-item style="display: inline-block" prop="aftEndTime">
                  <el-time-select
                    placeholder="结束"
                    :editable="false"
                    :picker-options="
                      settingDialog.workTimeForm.afternoon.endOption
                    "
                    v-model="settingDialog.workTimeForm.formData.aftEndTime"
                  />
                </el-form-item>
              </el-form-item>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="请假设置" name="leave">
          <el-form
            ref="leaveForm"
            label-width="100px"
            size="mini"
            :model="settingDialog.leaveForm.formData"
            :rules="settingDialog.leaveForm.rules"
          >
            <el-form-item label="假期类型" prop="typeId">
              <el-select
                v-model="settingDialog.leaveForm.formData.typeId"
                style="width: 38%"
                @change="changeLeaveType"
              >
                <el-option
                  v-for="(item, index) in settingDialog.leaveForm.leaveTypeList"
                  :key="index"
                  :value="item.id"
                  :disabled="item.status === 0"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-switch
                v-model="settingDialog.leaveForm.formData.status"
                :disabled="settingDialog.leaveForm.disabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="禁用"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
            <el-form-item label="休假天数" prop="days">
              <el-input-number
                v-model="settingDialog.leaveForm.formData.days"
                :min="1"
                style="width: 38%"
                step-strictly
                :disabled="settingDialog.leaveForm.formData.status === 0"
              />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model.trim="settingDialog.leaveForm.formData.remark"
                :disabled="settingDialog.leaveForm.formData.status === 0"
                maxlength="100"
                show-word-limit
                style="width: 50%"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="settingDialog.isShow = false">取消</el-button>
        <el-button type="primary" @click="saveSetting">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqDeptList,
  reqUpdateDeptInfo,
  reqAddDeptInfo,
  reqDeleteDeptInfo,
  reqBatchDeleteDeptInfo,
  reqWorkTime,
  reqAllLeaveType,
  reqLeaveDetail,
  reqLeaveInfo,
} from "@/api/system";
import CommonTable from "@/components/CommonTable";
import CommonForm from "@/components/CommonForm";
export default {
  name: "department",
  components: { CommonTable, CommonForm },
  data() {
    return {
      table: {
        tableData: [],
        tableLabel: [
          {
            name: "name",
            label: "名称",
          },
          {
            name: "createTime",
            label: "成立时间",
          },
          {
            name: "morStartTime",
            label: "上午上班时间",
          },
          {
            name: "morEndTime",
            label: "上午下班时间",
          },
          {
            name: "aftStartTime",
            label: "下午上班时间",
          },
          {
            name: "aftEndTime",
            label: "下午下班时间",
          },
          {
            name: "totalWorkTime",
            label: "工作时长（h）",
          },
          {
            name: "remark",
            label: "备注",
            width: 200,
          },
        ],
        pageConfig: {
          total: 10, // 记录总数
          current: 1, // 起始页
          size: 10, // 每页展示的记录数
        },
      },
      dialogForm: {
        type: "add",
        isShow: false,
        formItemList: [
          {
            name: "name",
            label: "名称",
            type: "input",
          },
          {
            name: "remark",
            label: "备注",
            type: "textarea",
          },
        ],
        formData: {},
        inline: false,
      },
      ids: [],
      searchForm: {
        formItemList: [
          {
            name: "name",
            label: "名称",
            type: "input",
            icon: "el-icon-search",
          },
        ],
        formData: {},
        inline: true,
      },
      settingDialog: {
        isShow: false,
        workTimeForm: {
          morning: {
            startOption: {
              start: "06:00",
              step: "00:10",
              end: "09:30",
            },
            endOption: {
              start: "10:00",
              step: "00:10",
              end: "12:30",
            },
          },
          afternoon: {
            startOption: {
              start: "13:00",
              step: "00:10",
              end: "15:00",
            },
            endOption: {
              start: "16:30",
              step: "00:10",
              end: "23:59",
            },
          },
          formData: {},
          rules: {
            morStartTime: [
              {
                required: true,
                message: "请选择开始时间",
                trigger: "blur",
              },
            ],
            morEndTime: [
              {
                required: true,
                message: "请选择结束时间",
                trigger: "blur",
              },
            ],
            aftStartTime: [
              {
                required: true,
                message: "请选择开始时间",
                trigger: "blur",
              },
            ],
            aftEndTime: [
              {
                required: true,
                message: "请选择开始时间",
                trigger: "blur",
              },
            ],
          },
        },
        leaveForm: {
          disabled: true,
          formData: {},
          rules: {
            typeId: [
              {
                required: true,
                message: "请选择请假类型",
                trigger: "change",
              },
            ],
            days: [
              {
                required: true,
                message: "请选择休假天数",
                trigger: "blur",
              },
            ],
          },
          leaveTypeList: [],
        },
        activeTabName: "workTime",
        activeTabLabel: "出勤设置",
      },
    };
  },
  mounted() {
    this.getDeptList();
    this.$bus.$on("sizeChange", (size) => {
      this.table.pageConfig.size = size;
      this.getDeptList();
    });
    this.$bus.$on("currentChange", (current) => {
      this.table.pageConfig.current = current;
      this.getDeptList();
    });
    this.$bus.$on("edit", (row) => {
      this.dialogForm.type = "edit";
      this.dialogForm.isShow = true;
      this.dialogForm.formData = {
        id: row.id,
        name: row.name,
        remark: row.remark,
      };
    });
    this.$bus.$on("del", (row) => {
      this.deleteDept(row.id);
    });
    this.$bus.$on("selectionChange", (val) => {
      this.ids = val.map((item) => item.id);
    });
  },
  methods: {
    // 获取部门信息
    async getDeptList() {
      try {
        let res = await reqDeptList(
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
    // 新增子类部门信息
    handleSubAdd({ id }) {
      this.dialogForm.type = "add";
      this.dialogForm.isShow = true;
      this.dialogForm.formData = {
        parentId: id,
      };
    },
    // 考勤设置
    handleSetting(obj) {},
    async confirm() {
      try {
        let res;
        if (this.dialogForm.type === "edit") {
          res = await reqUpdateDeptInfo(this.dialogForm.formData);
        } else {
          res = await reqAddDeptInfo(this.dialogForm.formData);
        }
        if (res.code === 200) {
          this.$message.success(res.message);
          this.dialogForm.isShow = false;
          this.getDeptList();
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 新增部门
    handleAdd() {
      this.dialogForm.type = "add";
      this.dialogForm.isShow = true;
    },
    // 删除部门
    async deleteDept(id) {
      try {
        let res = await reqDeleteDeptInfo(id);
        if (res.code === 200) {
          this.$message.success(res.message);
          this.getDeptList();
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 批量删除
    async handleDeleteBatch() {
      try {
        let res = await reqBatchDeleteDeptInfo(this.ids.toString());
        if (res.code === 200) {
          this.$message.success(res.message);
          this.getDeptList();
        }
      } catch (error) {}
    },
    async search() {
      try {
        let res = await reqDeptList(
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
      this.searchForm.formData = {};
      this.getDeptList();
    },
    // 考勤设置
    async handleSetting({ workTimeId }) {
      this.settingDialog.isShow = true;
      try {
        let res = await reqWorkTime(workTimeId);
        if (res.code === 200) {
          this.settingDialog.workTimeForm.formData = res.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 点击请假栏目获取所有请假类型
    async clickTab({ name }) {
      if (name !== "leave") return;
      try {
        let res = await reqAllLeaveType();
        if (res.code === 200) {
          this.settingDialog.leaveForm.leaveTypeList = res.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 根据请假类型获取请假信息
    async changeLeaveType(typeId) {
      this.settingDialog.leaveForm.disabled = false;
      this.settingDialog.leaveForm.formData.status = 1;
      try {
        let res = await reqLeaveDetail(
          this.settingDialog.workTimeForm.formData.deptId,
          this.settingDialog.leaveForm.formData.typeId
        );
        if (res.code === 200) {
          this.settingDialog.leaveForm.formData = res.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 发送请假请求
    async saveSetting() {
      try {
        let res = await reqLeaveInfo(this.settingDialog.leaveForm.formData);
        if (res.code === 200) {
          this.$message.success(res.message);
          this.settingDialog.isShow = false;
          this.getDeptList();
        }
      } catch (error) {
        console.log(error);
      }
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
