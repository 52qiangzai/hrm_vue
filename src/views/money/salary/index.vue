<template>
  <div class="app-container">
    <el-alert
      title="工资管理"
      style="margin: 10px 0"
      type="success"
      description="对员工的工资进行统一管理，我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的。"
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
    <!-- 表格 -->
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
      <el-table-column label="扣款项目">
        <el-table-column
          prop="lateDeduct"
          label="迟到（50￥/次）"
          min-width="125"
        />
        <el-table-column
          prop="leaveEarlyDeduct"
          label="早退（50￥/次）"
          min-width="125"
        />
        <el-table-column
          prop="absenteeismDeduct"
          label="旷工（100￥/次）"
          min-width="125"
        />
        <el-table-column
          prop="leaveDeduct"
          label="请假（80￥/天）"
          min-width="125"
        />
      </el-table-column>
      <el-table-column label="缴纳项目">
        <el-table-column prop="housePay" label="公积金" min-width="125" />
        <el-table-column prop="socialPay" label="社保" min-width="125" />
      </el-table-column>
      <el-table-column label="实发工资">
        <el-table-column prop="baseSalary" label="基础工资" min-width="125" />
        <el-table-column prop="subsidy" label="生活补贴" min-width="125" />
        <el-table-column prop="bonus" label="奖金" min-width="125" />
      </el-table-column>
      <el-table-column prop="totalSalary" label="最终工资" min-width="125" />
      <el-table-column prop="remark" label="备注" min-width="200" />
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)"
            >明细 <i class="el-icon-edit"></i
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
    <!-- 明细弹窗 -->
    <el-dialog title="工资" :visible.sync="dialogForm.isShow">
      <el-form
        ref="dialogForm"
        label-width="150px"
        size="mini"
        :model="dialogForm.formData"
        :rules="dialogForm.rules"
      >
        <el-form-item label="基本工资" prop="baseSalary">
          <el-input-number
            v-model="dialogForm.formData.baseSalary"
            :min="0"
            style="width: 48%"
            :precision="3"
          />
        </el-form-item>
        <el-form-item label="生活补贴" prop="subsidy">
          <el-input-number
            v-model="dialogForm.formData.subsidy"
            :min="0"
            style="width: 48%"
            :precision="3"
          />
        </el-form-item>
        <el-form-item label="奖金" prop="bonus">
          <el-input-number
            v-model="dialogForm.formData.bonus"
            :min="0"
            style="width: 48%"
            :precision="3"
          />
        </el-form-item>
        <el-form-item label="扣款" style="height: 80px">
          <el-form-item style="height: 30px">
            <el-form-item
              label="迟到"
              label-width="60px"
              style="display: inline-block"
            >
              <el-input-number
                v-model="dialogForm.formData.lateDeduct"
                :disabled="true"
                :controls="false"
                :precision="3"
              />
            </el-form-item>
            <el-form-item
              label="早退"
              label-width="80px"
              style="display: inline-block"
            >
              <el-input-number
                v-model="dialogForm.formData.leaveEarlyDeduct"
                :disabled="true"
                :controls="false"
                :precision="3"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item style="height: 30px">
            <el-form-item
              label="旷工"
              label-width="60px"
              style="display: inline-block"
            >
              <el-input-number
                v-model="dialogForm.formData.absenteeismDeduct"
                :disabled="true"
                :controls="false"
                :precision="3"
              />
            </el-form-item>
            <el-form-item
              label="请假"
              label-width="80px"
              style="display: inline-block"
            >
              <el-input-number
                v-model="dialogForm.formData.leaveDeduct"
                :disabled="true"
                :controls="false"
                :precision="3"
              />
            </el-form-item>
          </el-form-item>
        </el-form-item>
        <el-form-item label="缴费" style="height: 30px">
          <el-form-item
            label="社保"
            label-width="60px"
            style="display: inline-block"
          >
            <el-input-number
              v-model="insurance.perSocialPay"
              :disabled="true"
              :controls="false"
              :precision="3"
            ></el-input-number>
          </el-form-item>
          <el-form-item
            label="公积金"
            label-width="80px"
            style="display: inline-block"
          >
            <el-input-number
              v-model="insurance.perHousePay"
              :disabled="true"
              :controls="false"
              :precision="3"
            ></el-input-number>
          </el-form-item>
        </el-form-item>
        <el-form-item label="最终工资" prop="totalSalary">
          <el-input-number
            v-model="dialogForm.formData.totalSalary"
            style="width: 48%"
            :disabled="true"
            :controls="false"
            :precision="3"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model.trim="dialogForm.formData.remark"
            maxlength="100"
            show-word-limit
            style="width: 48%"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm.isShow = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqSalaryList,
  reqSetSalary,
  reqSearchStaffSalaryById,
} from "@/api/money";
import CommonForm from "@/components/CommonForm";

export default {
  name: "salary",
  components: { CommonForm },
  data() {
    let checkSalary = (rule, value, callback) => {
      if (this.dialogForm.formData.totalSalary < 0) {
        callback(new Error("最终工资至少应该大于0"));
      } else {
        callback();
      }
    };
    return {
      dialogForm: {
        isShow: false,
        formData: {},
        inline: false,
        rules: {
          baseSalary: [
            { required: true, message: "请输入基础工资", trigger: "blur" },
            { validator: checkSalary, trigger: "blur" },
          ],
        },
      },
      table: {
        tableData: [],
        pageConfig: {
          total: 10, // 记录总数
          current: 1, // 起始页
          size: 10, // 每页展示的记录数
        },
      },
      month: "",
      insurance: {},
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
    };
  },
  mounted() {
    this.getSalaryList(
      this.table.pageConfig.current,
      this.table.pageConfig.size
    );
  },
  watch: {
    "dialogForm.formData.baseSalary": function () {
      this.calculateSalary();
    },
    "dialogForm.formData.subsidy": function () {
      this.calculateSalary();
    },
    "dialogForm.formData.bonus": function () {
      this.calculateSalary();
    },
  },
  methods: {
    calculateSalary() {
      this.dialogForm.formData.totalSalary =
        this.dialogForm.formData.baseSalary +
        this.dialogForm.formData.subsidy +
        this.dialogForm.formData.bonus -
        this.insurance.perHousePay -
        this.insurance.perSocialPay -
        this.dialogForm.formData.lateDeduct -
        this.dialogForm.formData.leaveEarlyDeduct -
        this.dialogForm.formData.leaveDeduct -
        this.dialogForm.formData.absenteeismDeduct;
    },
    // 获取员工列表
    async getSalaryList(current, size, ...args) {
      try {
        let res = await reqSalaryList(current, size, ...args);
        if (res.code === 200) {
          const { month, list, total } = res.data;
          this.table.tableData = list;
          this.month = month;
          this.table.pageConfig.total = total;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 处理页和条
    handleCurrentChange(current) {
      this.table.pageConfig.current = current;
      this.getSalaryList(
        this.table.pageConfig.current,
        this.table.pageConfig.size
      );
    },
    handleSizeChange(size) {
      this.table.pageConfig.size = size;
      console.log(size);
      this.getSalaryList(
        this.table.pageConfig.current,
        this.table.pageConfig.size
      );
    },
    // 明细
    async handleEdit(row) {
      const { staffId } = row;
      this.dialogForm.isShow = true;
      try {
        let res = await reqSearchStaffSalaryById(staffId);
        if (res.code === 200) {
          this.insurance = res.data;
          this.dialogForm.formData = {
            staffId: row.staffId,
            baseSalary: row.baseSalary,
            subsidy: row.subsidy,
            bonus: row.bonus,
            month: this.month,
            lateDeduct: row.lateDeduct,
            leaveDeduct: row.leaveDeduct,
            leaveEarlyDeduct: row.leaveEarlyDeduct,
            absenteeismDeduct: row.absenteeismDeduct,
            remark: row.remark,
          };
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 确定更改工资
    confirm() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          try {
            let res = await reqSetSalary(this.dialogForm.formData);
            if (res.code === 200) {
              this.$message.success(res.message);
              this.dialogForm.isShow = false;
              this.getSalaryList(
                this.table.pageConfig.current,
                this.table.pageConfig.size
              );
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          return false;
        }
      });
    },
    search() {
      this.getSalaryList(
        this.table.pageConfig.current,
        this.table.pageConfig.size,
        this.searchForm.formData
      );
    },
    reset() {
      this.searchForm.formData.name = "";
    },
  },
};
</script>
<style lang="less" scoped></style>
