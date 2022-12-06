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
    <!-- 表格 -->
    <el-table
      :data="tableData"
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
      <el-table-column label="社保">
        <el-table-column prop="socialBase" label="缴纳基数" min-width="125" />
        <el-table-column label="个人">
          <el-table-column
            prop="perSocialPay"
            label="缴纳费用"
            min-width="125"
          />
        </el-table-column>
        <el-table-column label="企业">
          <el-table-column
            prop="comInjuryRate"
            label="工伤保险缴纳比例"
            min-width="125"
          />
          <el-table-column
            prop="comSocialPay"
            label="缴纳费用"
            min-width="125"
          />
        </el-table-column>
        <el-table-column prop="socialRemark" label="备注" min-width="200" />
      </el-table-column>
      <el-table-column label="公积金">
        <el-table-column prop="houseBase" label="缴纳基数" min-width="125" />
        <el-table-column label="个人">
          <el-table-column
            prop="perHouseRate"
            label="缴纳比例"
            min-width="125"
          />
          <el-table-column
            prop="perHousePay"
            label="缴纳费用"
            min-width="125"
          />
        </el-table-column>
        <el-table-column label="企业">
          <el-table-column
            prop="comHouseRate"
            label="缴纳比例"
            min-width="125"
          />
          <el-table-column
            prop="comHousePay"
            label="缴纳费用"
            min-width="125"
          />
        </el-table-column>
        <el-table-column prop="houseRemark" label="备注" min-width="200" />
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)"
            >明细 <i class="el-icon-edit"></i
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total,sizes,prev,pager,next"
      :page-size="size"
      :page-sizes="[5, 10, 15, 20]"
      :total="total"
      :current-page.sync="current"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
    <!-- 明细弹窗 -->
    <el-dialog
      title="五险一金"
      :visible.sync="dialogForm.isShow"
      fullscreen
      @close="closeDialog"
    >
      <div>
        <el-form
          label-width="100px"
          ref="form"
          :model="dialogForm.formData"
          size="mini"
          v-loading="isLoading"
          :rules="dialogForm.rules"
        >
          <el-form-item label="参保城市" prop="cityId">
            <el-select
              v-model="dialogForm.formData.cityId"
              placeholder="请选择参保城市"
              style="width: 38%"
            >
              <el-option
                v-for="item in dialogForm.cityList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="社保基数" prop="socialBase">
            <el-input-number
              v-model="dialogForm.formData.socialBase"
              style="width: 38%"
              :precision="3"
            />
            （基数范围： （基数范围：{{ cityDetail.socLowerLimit }}￥ ~
            {{ cityDetail.socUpperLimit }}￥）
          </el-form-item>

          <el-form-item label="工伤比例" prop="comInjuryRate">
            <el-input-number
              v-model="dialogForm.formData.comInjuryRate"
              style="width: 38%"
              :step="0.001"
              :precision="3"
            />
            （比例范围：0.002 ~ 0.019，推荐0.019）
          </el-form-item>

          <el-form-item label="社保缴纳">
            <el-form-item
              label="个人"
              prop="perSocialPay"
              label-width="50px"
              style="display: inline-block"
            >
              <el-input-number
                v-model="dialogForm.formData.perSocialPay"
                :disabled="true"
                :controls="false"
                :precision="3"
              ></el-input-number>
            </el-form-item>
            <el-form-item
              label="公司"
              prop="comSocialPay"
              label-width="50px"
              style="display: inline-block"
            >
              <el-input-number
                v-model="dialogForm.formData.comSocialPay"
                :disabled="true"
                :controls="false"
                :precision="3"
              ></el-input-number>
            </el-form-item>
            <el-table :data="[cityDetail]" border stripe>
              <el-table-column label="养老保险缴费比例">
                <el-table-column label="个人" prop="perPensionRate" />
                <el-table-column label="企业" prop="comPensionRate" />
              </el-table-column>
              <el-table-column label="医疗保险缴费比例">
                <el-table-column label="个人" prop="perMedicalRate" />
                <el-table-column label="企业" prop="comMedicalRate" />
              </el-table-column>
              <el-table-column label="失业保险缴费比例">
                <el-table-column label="个人" prop="perUnemploymentRate" />
                <el-table-column label="企业" prop="comUnemploymentRate" />
              </el-table-column>
              <el-table-column
                label="生育保险企业缴费比例"
                prop="comMaternityRate"
              />
            </el-table>
          </el-form-item>
          <el-form-item label="社保备注" prop="socialRemark">
            <el-input
              v-model.trim="dialogForm.formData.socialRemark"
              type="textarea"
              :rows="2"
              placeholder="1-300字符"
              maxlength="300"
              style="width: 38%"
              show-word-limit
            ></el-input>
          </el-form-item>

          <el-form-item label="公积金基数" prop="houseBase">
            <el-input-number
              v-model="dialogForm.formData.houseBase"
              style="width: 38%"
              :precision="3"
            />
            （基数范围： （基数范围：{{ cityDetail.houLowerLimit }}￥ ~
            {{ cityDetail.houUpperLimit }}￥）
          </el-form-item>
          <el-form-item label="企业比例" prop="comHouseRate">
            <el-input-number
              v-model="dialogForm.formData.comHouseRate"
              style="width: 38%"
              :precision="3"
              :step="0.001"
            />
            （比例范围：0.05 ~ 0.12，推荐0.12）
          </el-form-item>
          <el-form-item label="个人比例" prop="perHouseRate">
            <el-input-number
              v-model="dialogForm.formData.perHouseRate"
              style="width: 38%"
              :precision="3"
              :step="0.001"
            />
            （比例范围：0.05 ~ 0.12，推荐0.12）
          </el-form-item>
          <el-form-item label="公积金缴纳">
            <el-form-item
              label="个人"
              label-width="50px"
              style="display: inline-block"
              prop="perHousePay"
            >
              <el-input-number
                v-model="dialogForm.formData.perHousePay"
                :disabled="true"
                :controls="false"
                :precision="3"
              />
            </el-form-item>
            <el-form-item
              label="公司"
              label-width="50px"
              style="display: inline-block"
              prop="comHousePay"
            >
              <el-input-number
                v-model="dialogForm.formData.comHousePay"
                :disabled="true"
                :controls="false"
                :precision="3"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="公积金备注" prop="houseRemark">
            <el-input
              v-model.trim="dialogForm.formData.houseRemark"
              type="textarea"
              :rows="2"
              placeholder="1-300字符"
              style="width: 38%"
              maxlength="300"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="
            dialogForm.isShow = false;
            isLoading = true;
          "
          >取消</el-button
        >
        <el-button type="primary" @click="edit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CommonForm from "@/components/CommonForm";
import {
  reqAllCity,
  reqCityDetailById,
  reqInsurance,
  reqInsuranceDetailById,
  reqSetInsurance,
} from "@/api/money";
export default {
  name: "insurance",
  components: { CommonForm },
  data() {
    let checkSocialBase = (rule, value, callback) => {
      if (
        value < this.cityDetail.socLowerLimit ||
        value > this.cityDetail.socUpperLimit
      ) {
        callback(
          new Error(
            "社保基数应该在" +
              this.cityDetail.socLowerLimit +
              " ~ " +
              this.cityDetail.socUpperLimit +
              "之间"
          )
        );
      } else {
        callback();
      }
    };
    let checkComInjuryRate = (rule, value, callback) => {
      if (value < 0.002 || value > 0.019) {
        callback(new Error("工伤保险企业缴费比例应在0.002 ~ 0.019之间"));
      } else {
        callback();
      }
    };
    let checkHouseBase = (rule, value, callback) => {
      if (
        value < this.cityDetail.houLowerLimit ||
        value > this.cityDetail.houUpperLimit
      ) {
        callback(
          new Error(
            "公积金基数应该在" +
              this.cityDetail.houLowerLimit +
              " ~ " +
              this.cityDetail.houUpperLimit +
              "之间"
          )
        );
      } else {
        callback();
      }
    };
    let checkHouseRate = (rule, value, callback) => {
      if (value < 0.05 || value > 0.12) {
        callback(new Error("公积金缴费比例应在0.05 ~ 0.12之间"));
      } else {
        callback();
      }
    };

    return {
      tableData: [],
      current: 1,
      size: 10,
      total: 0,
      isLoading: true,
      dialogForm: {
        isShow: false,
        cityList: [],
        formData: {},
        rules: {
          cityId: [
            { required: true, message: "请选择参保地", trigger: "change" },
          ],
          socialBase: [
            { required: true, message: "请输入社保基数", trigger: "blur" },
            { validator: checkSocialBase, trigger: "blur" },
          ],
          comInjuryRate: [
            {
              required: true,
              message: "请输入工伤保险企业缴费比例",
              trigger: "blur",
            },
            { validator: checkComInjuryRate, trigger: "blur" },
          ],
          houseBase: [
            { required: true, message: "请输入公积金基数", trigger: "blur" },
            { validator: checkHouseBase, trigger: "blur" },
          ],
          comHouseRate: [
            {
              required: true,
              message: "请输入公积金企业缴费比例",
              trigger: "blur",
            },
            { validator: checkHouseRate, trigger: "blur" },
          ],
          perHouseRate: [
            {
              required: true,
              message: "请输入公积金个人缴费比例",
              trigger: "blur",
            },
            { validator: checkHouseRate, trigger: "blur" },
          ],
        },
      },
      cityDetail: {},
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
    };
  },
  mounted() {
    this.getInsurance(this.current, this.size);
  },
  methods: {
    // 获取五险一金列表
    async getInsurance(current, size) {
      try {
        let res = await reqInsurance(current, size);
        if (res.code === 200) {
          const { total, list } = res.data;
          this.tableData = list;
          this.total = total;
        }
      } catch (error) {}
    },
    // 明细弹窗
    async handleEdit(data) {
      this.dialogForm.isShow = !this.dialogForm.isShow;
      const { staffId, cityId } = data;
      try {
        let res = await reqInsuranceDetailById(staffId);
        let resCity = await reqCityDetailById(cityId);
        let resCityList = await reqAllCity();
        if (
          res.code === 200 &&
          resCity.code === 200 &&
          resCityList.code === 200
        ) {
          this.dialogForm.formData = res.data;
          this.cityDetail = resCity.data;
          this.dialogForm.cityList = resCityList.data;
          this.isLoading = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 确定编辑弹窗
    edit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            let res = await reqSetInsurance(this.dialogForm.formData);
            if (res.code === 200) {
              this.$message.success(res.message);
              this.dialogForm.formData = {};
              this.dialogForm.isShow = false;
              this.getInsurance(this.current, this.size);
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          return false;
        }
      });
    },
    // 关闭弹窗
    closeDialog() {
      this.isLoading = true;
      this.dialogForm.formData = {};
    },
    // 页数
    handleSizeChange(size) {
      this.size = size;
      this.getInsurance(this.current, this.size);
    },
    handleCurrentChange(current) {
      this.current = current;
      this.getInsurance(this.current, this.size);
    },
    // 搜索
    async search() {
      try {
        let name = this.searchForm.formData.name;
        let res = await reqInsurance(this.current,this.size,name);
        if(res.code===200){
          const {total,list} = res.data
          this.total = total
          this.tableData = list
        }
      } catch (error) {
        
      }
    },
    reset() {
      this.searchForm.formData.name = "";
      this.getInsurance(this.current, this.size);
    },
  },
};
</script>
