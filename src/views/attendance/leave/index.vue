<template>
  <div class="app-container">
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
    <!--    数据表格-->
    <div class="common-table">
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
        <el-table-column prop="phone" label="电话" min-width="125" />
        <el-table-column prop="typeName" label="类型" min-width="125" />
        <el-table-column prop="startDate" label="开始日期" min-width="125" />
        <el-table-column prop="days" label="天数" min-width="125" />
        <el-table-column prop="createTime" label="申请时间" min-width="150" />
        <el-table-column label="审核状态" min-width="80">
          <template slot-scope="scope">
            <el-tag :type="table.tagType[scope.row.status]">{{
              scope.row.status
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="200" prop="remark" />
        <el-table-column label="操作" width="190" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="approve(scope.row)"
              :disabled="scope.row.status !== '未审核'"
              >批准 <i class="el-icon-check"></i
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              @click="reject(scope.row)"
              :disabled="scope.row.status !== '未审核'"
              >驳回 <i class="el-icon-close"></i
            ></el-button>
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
    </div>
  </div>
</template>

<script>
import CommonForm from "@/components/CommonForm";
import { reqStaffLeaveDetail, reqEditLeaveDetail } from "@/api/attendance";
export default {
  name: "leave",
  components: { CommonForm },
  data() {
    return {
      searchForm: {
        formItemList: [
          {
            name: "name",
            label: "姓名",
            type: "input",
            icon: "el-icon-search",
          },
        ],
        formData: {},
        inline: true,
      },
      table: {
        tagType: {
          未审核: "info",
          审核通过: "success",
          驳回: "danger",
        },
        tableData: [],
        pageConfig: {
          total: 10, // 记录总数
          current: 1, // 起始页
          size: 10, // 每页展示的记录数
        },
      },
      status: {
        approve: "审核通过",
        reject: "驳回",
      },
    };
  },
  mounted() {
    this.getStaffLeaveList();
  },
  methods: {
    // 获取信息
    async getStaffLeaveList() {
      try {
        let res = await reqStaffLeaveDetail(
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
    handleSizeChange(size) {
      this.table.pageConfig.size = size;
      this.getStaffLeaveList();
    },
    handleCurrentChange(current) {
      this.table.pageConfig.current = current;
      this.getStaffLeaveList();
    },
    // 搜索
    async search() {
      try {
        let res = await reqStaffLeaveDetail(
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
    // 重置
    reset() {
      this.searchForm.formData.name = "";
      this.getStaffLeaveList();
    },
    // 批准
    async approve(row) {
      row.status = this.status.approve;
      try {
        let res = reqEditLeaveDetail(row);
        if (res.code === 200) {
          this.$message.success(res.message);
          this.getStaffLeaveList();
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 驳回
    reject(row) {
      row.status = this.status.reject;
      try {
        let res = reqEditLeaveDetail(row);
        if (res.code === 200) {
          this.$message.success(res.message);
          this.getStaffLeaveList();
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
