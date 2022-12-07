<template>
  <div class="app-container">
    <el-alert
      title="参保城市"
      type="success"
      description="参保地指的办理社保的地方，而社保一般指社会保险，是指一种为丧失劳动能力、暂时失去劳动岗位或因健康原因造成损失的人口提供收入或补偿的一种社会和经济制度。该计划由政府举办，强制某一群体将其收入的一部分作为社会保险税（费）形成社会保险基金，在满足一定条件的情况下，被保险人可从基金获得固定的收入或损失的补偿，它是一种再分配制度，它的目标是保证物质及劳动力的再生产和社会的稳定。需要注意的是，参保地不一定是户籍所在地。参保地可以是非户籍地的其他地方。"
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
    <!-- 表格显示组件 -->
    <CommonTable
      :tableData="table.tableData"
      :tableLabel="table.tableLabel"
      :pageConfig="table.pageConfig"
    />
    <!-- 新增或编辑弹窗 -->
    <el-dialog
      :title="
        dialogForm.type === 'add' ? '新增城市社保信息' : '更新城市社保信息'
      "
      :visible.sync="dialogForm.isShow"
    >
      <CommonForm
        ref="dialogForm"
        :formItemList="dialogForm.formItemList"
        :formData="dialogForm.formData"
        :inline="dialogForm.inline"
        :rules="dialogForm.rules"
      ></CommonForm>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm.isShow = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  reqCityList,
  reqUpdateCity,
  reqDeleteCity,
  reqAddCity,
  reqBatchCity,
} from "@/api/money";
import CommonTable from "@/components/CommonTable";
import CommonForm from "@/components/CommonForm";
export default {
  name: "city",
  components: { CommonTable, CommonForm },
  data() {
    let checkAverageSalary = (rule, value, callback) => {
      if (value < this.dialogForm.formData.lowerSalary) {
        callback(new Error("不低于职工上年度最低月工资！"));
      } else {
        callback();
      }
    };
    return {
      dialogForm: {
        type: "edit", // add为新增，edit为编辑
        isShow: false,
        inline: false,
        formItemList: [
          {
            name: "name",
            label: "城市名称",
            type: "input",
          },
          {
            name: "lowerSalary",
            label: "职工上年度最低月工资",
            type: "number",
          },
          {
            name: "averageSalary",
            label: "职工上年度平均月工资",
            type: "number",
          },
          {
            name: "socUpperLimit",
            label: "职工社保缴纳基数上限",
            type: "number",
            disabled: true,
          },
          {
            name: "socLowerLimit",
            label: "职工社保缴纳基数下限",
            type: "number",
            disabled: true,
          },
          {
            name: "houUpperLimit",
            label: "公积金缴纳基数上限",
            type: "number",
            disabled: true,
          },
          {
            name: "houLowerLimit",
            label: "公积金缴纳基数下限",
            type: "number",
            disabled: true,
          },
          {
            name: "perPensionRate",
            label: "养老保险个人缴费比例",
            type: "number",
            step: 0.001,
          },
          {
            name: "comPensionRate",
            label: "养老保险企业缴费比例",
            type: "number",
            step: 0.001,
          },
          {
            name: "perMedicalRate",
            label: "医疗保险个人缴费比例",
            type: "number",
            step: 0.001,
          },
          {
            name: "comMedicalRate",
            label: "医疗保险企业缴费比例",
            type: "number",
            step: 0.001,
          },
          {
            name: "perUnemploymentRate",
            label: "失业保险个人缴费比例",
            type: "number",
            step: 0.001,
          },
          {
            name: "comUnemploymentRate",
            label: "失业保险企业缴费比例",
            type: "number",
            step: 0.001,
          },
          {
            name: "comMaternityRate",
            label: "生育保险企业缴费比例",
            type: "number",
            step: 0.001,
          },
        ],
        formData: {},
        rules: {
          name: [
            { required: true, message: "请输入城市名称", trigger: "blur" },
          ],
          lowerSalary: [
            {
              required: true,
              message: "请输入职工上年度平均月工资",
              trigger: "blur",
            },
            {
              type: "number",
              min: 500,
              message: "不低于500元",
              trigger: "blur",
            },
          ],
          averageSalary: [
            {
              required: true,
              message: "请输入职工上年度最低月工资",
              trigger: "blur",
            },
            { validator: checkAverageSalary, trigger: "blur" },
          ],
          perPensionRate: [
            {
              required: true,
              message: "请输入养老保险个人缴纳比例",
              trigger: "blur",
            },
            {
              type: "number",
              min: 0,
              max: 1,
              message: "缴纳比例：0 ~ 1",
              trigger: "blur",
            },
          ],
          comPensionRate: [
            {
              required: true,
              message: "请输入养老保险企业缴纳比例",
              trigger: "blur",
            },
            {
              type: "number",
              min: 0,
              max: 1,
              message: "缴纳比例：0 ~ 1",
              trigger: "blur",
            },
          ],
          perMedicalRate: [
            {
              required: true,
              message: "请输入医疗保险个人缴纳比例",
              trigger: "blur",
            },
            {
              type: "number",
              min: 0,
              max: 1,
              message: "缴纳比例：0 ~ 1",
              trigger: "blur",
            },
          ],
          comMedicalRate: [
            {
              required: true,
              message: "请输入医疗保险企业缴纳比例",
              trigger: "blur",
            },
            {
              type: "number",
              min: 0,
              max: 1,
              message: "缴纳比例：0 ~ 1",
              trigger: "blur",
            },
          ],
          perUnemploymentRate: [
            {
              required: true,
              message: "请输入失业保险个人缴纳比例",
              trigger: "blur",
            },
            {
              type: "number",
              min: 0,
              max: 1,
              message: "缴纳比例：0 ~ 1",
              trigger: "blur",
            },
          ],
          comUnemploymentRate: [
            {
              required: true,
              message: "请输入失业保险企业缴纳比例",
              trigger: "blur",
            },
            {
              type: "number",
              min: 0,
              max: 1,
              message: "缴纳比例：0 ~ 1",
              trigger: "blur",
            },
          ],
          comMaternityRate: [
            {
              required: true,
              message: "请输入生育保险企业缴纳比例",
              trigger: "blur",
            },
            {
              type: "number",
              min: 0,
              max: 1,
              message: "缴纳比例：0 ~ 1",
              trigger: "blur",
            },
          ],
        },
      },
      table: {
        tableData: [],
        tableLabel: [
          {
            name: "name",
            label: "城市名称",
            type: "column",
          },
          {
            name: "socUpperLimit",
            label: "职工社保缴纳基数上限",
            type: "column",
            width: 150,
          },
          {
            name: "socLowerLimit",
            label: "职工社保缴纳基数下限",
            type: "column",
            width: 150,
          },
          {
            name: "houUpperLimit",
            label: "公积金缴纳基数上限",
            type: "column",
            width: 150,
          },
          {
            name: "houLowerLimit",
            label: "公积金缴纳基数下限",
            type: "column",
            width: 150,
          },
          {
            name: "perPensionRate",
            label: "养老保险个人缴费比例",
            type: "column",
            width: 150,
          },
          {
            name: "comPensionRate",
            label: "养老保险企业缴费比例",
            type: "column",
            width: 150,
          },
          {
            name: "perMedicalRate",
            label: "医疗保险个人缴费比例",
            type: "column",
            width: 150,
          },
          {
            name: "comMedicalRate",
            label: "医疗保险企业缴费比例",
            type: "column",
            width: 150,
          },
          {
            name: "perUnemploymentRate",
            label: "失业保险个人缴费比例",
            type: "column",
            width: 150,
          },
          {
            name: "comUnemploymentRate",
            label: "失业保险企业缴费比例",
            type: "column",
            width: 150,
          },
          {
            name: "comMaternityRate",
            label: "生育保险企业缴费比例",
            type: "column",
            width: 150,
          },
        ],
        pageConfig: {
          total: 10, // 记录总数
          current: 1, // 起始页
          size: 10, // 每页展示的记录数
        },
        ids: [],
      },
    };
  },
  mounted() {
    this.getCityList(this.table.pageConfig.current, this.table.pageConfig.size);
    this.$bus.$on("sizeChange", (size) => {
      this.table.pageConfig.size = size;
      this.getCityList(
        this.table.pageConfig.current,
        this.table.pageConfig.size
      );
    });
    this.$bus.$on("currentChange", (current) => {
      this.table.pageConfig.current = current;
      this.getCityList(
        this.table.pageConfig.current,
        this.table.pageConfig.size
      );
    });

    this.$bus.$on("edit", (row) => {
      this.dialogForm.isShow = true;
      this.$nextTick(() => {
        this.dialogForm.formData = JSON.parse(JSON.stringify(row));
      });
    });

    this.$bus.$on("del", (row) => {
      this.delCity(row.id);
    });

    this.$bus.$on("selectionChange", (data) => {
      const result = data.map((item) => item.id);
      this.table.ids = result;
    });
  },
  methods: {
    // 获取参保城市列表
    async getCityList(current, size) {
      try {
        let res = await reqCityList(current, size);
        if (res.code === 200) {
          const { total, list } = res.data;
          this.table.pageConfig.total = total;
          this.table.tableData = list;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 确定更新或新增
    confirm() {
      this.$refs.dialogForm.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            let res;
            if (this.dialogForm.type === "edit") {
              res = await reqUpdateCity(this.dialogForm.formData);
            } else {
              res = await reqAddCity(this.dialogForm.formData);
            }
            if (res.code === 200) {
              this.$message.success(res.message);
              this.getCityList(
                this.table.pageConfig.current,
                this.table.pageConfig.size
              );
              this.dialogForm.isShow = false;
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          return false;
        }
      });
    },
    // 删除信息
    async delCity(id) {
      try {
        let res = await reqDeleteCity(id);
        if (res.code === 200) {
          this.$message.success(res.message);
          this.getCityList(
            this.table.pageConfig.current,
            this.table.pageConfig.size
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 新增信息
    handleAdd() {
      this.dialogForm.type = "add";
      this.dialogForm.isShow = true;
      this.dialogForm.formData = {};
    },
    // 批量删除
    async handleDeleteBatch() {
      console.log("我响应了");
      if (!this.table.ids.length) return;
      try {
        let res = await reqBatchCity(this.table.ids.toString());
        if (res.code === 200) {
          this.$message.success(res.message);
          this.getCityList(
            this.table.pageConfig.current,
            this.table.pageConfig.size
          );
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
