<template>
  <div class="app-container">
    <el-alert
      title="考勤表现"
      type="success"
      description="记录员工的每月考勤情况，我是凑数的我是凑数的我是凑数的我是凑数的我是凑数的我是凑数的我是凑数的我是凑数的我是凑数的我是凑数的"
    >
    </el-alert>
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

    <el-table
      :data="table.tableData"
      border
      stripe
      row-key="id"
      :header-cell-style="{
        background: '#eef1f6',
        color: '#606266',
        textAlign: 'center',
        fontWeight: 'bold',
        borderWidth: '3px',
      }"
    >
      <el-table-column prop="code" label="工号" min-width="125" />
      <el-table-column prop="name" label="姓名" min-width="125" />
      <el-table-column prop="deptName" label="部门" min-width="125" />
      <el-table-column prop="phone" label="电话" min-width="125" />
      <el-table-column
        v-for="index in dayNum"
        :label="index + '日'"
        :key="index"
        min-width="60"
      >
        <template slot-scope="{ row }">
          <div @click="changeStatus(row, index)">
            <el-tag :type="table.tagType[row.attendanceList[index - 1].status]">
              {{ row.attendanceList[index - 1].status }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pager"
      layout="total,sizes,prev,pager,next,jumper"
      :page-size="table.pageConfig.size ? table.pageConfig.size : 10"
      :page-sizes="[5, 10, 15, 20]"
      :total="table.pageConfig.total"
      :current-page.sync="table.pageConfig.current"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
    <!-- 考勤修改 -->
    <el-dialog title="考勤状态" :visible.sync="dialog.isShow">
      <el-radio-group v-model="dialog.data.status" style="position: center">
        <el-radio
          v-for="(item, index) in dialog.statusList"
          :key="index"
          :label="item"
          border
        />
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.isShow = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reqAttendanceList, reqUpdateStaffAttendance } from "@/api/attendance";
import CommonForm from "@/components/CommonForm";
export default {
  name: "performance",
  components: { CommonForm },
  data() {
    return {
      dialog: {
        isShow: false,
        data: {},
        statusList: ["正常", "迟到", "早退", "旷工", "休假"],
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
            name: "month",
            label: "月份",
            type: "date",
            inputType: "month",
            valueFormat: "yyyyMM",
          },
        ],
        formData: {},
        inline: true,
      },
      table: {
        tagType: {
          正常: "success",
          迟到: "",
          早退: "warning",
          旷工: "danger",
          休假: "info",
        },
        tableData: [],
        pageConfig: {
          total: 10, // 记录总数
          current: 1, // 起始页
          size: 10, // 每页展示的记录数
        },
      },
      dayNum: 0,
      month: "",
    };
  },
  mounted() {
    this.getAttendanceList();
  },
  methods: {
    async getAttendanceList() {
      try {
        let res = await reqAttendanceList(
          this.table.pageConfig.current,
          this.table.pageConfig.size
        );
        if (res.code === 200) {
          const { total, list, dayNum } = res.data;
          this.table.pageConfig.total = total;
          this.table.tableData = list;
          this.dayNum = dayNum;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async search() {
      try {
        let res = await reqAttendanceList(
          this.table.pageConfig.current,
          this.table.pageConfig.size,
          this.searchForm.formData.name,
          this.searchForm.formData.month
        );
        if (res.code === 200) {
          const { list, total } = res.data;
          this.table.tableData = list;
          this.table.pageConfig.total = total;
        }
      } catch (error) {}
    },
    reset() {
      this.searchForm.formData.name = "";
      this.searchForm.formData.month = "";
      this.getAttendanceList();
    },
    changeStatus(row, index) {
      this.dialog.data = row.attendanceList[index - 1];
      this.dialog.isShow = true;
    },
    async confirm() {
      try {
        let res = await reqUpdateStaffAttendance(this.dialog.data);
        if (res.code === 200) {
          this.$message.success(res.message);
          this.getAttendanceList();
          this.dialog.isShow = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    handleSizeChange(size) {
      this.table.pageConfig.size = size;
      this.getAttendanceList();
    },
    handleCurrentChange(current) {
      this.table.pageConfig.current = current;
      this.getAttendanceList();
    },
  },
};
</script>
