<template>
  <div class="dashboard-container" v-loading="isLoading">
    <el-row class="home" :gutter="20">
      <el-col :span="8" :xs="24" style="margin-top: 20px">
        <!-- 个人资料 -->
        <el-card shadow="hover">
          <div class="user">
            <img
              :src="'http://localhost:8888/docs/download/' + userInfo.avatar"
            />
            <div class="userinfo">
              <p style="margin-bottom: 15px; font-weight: bold">
                {{ currentDate }}
              </p>
              <p class="name">{{ userInfo.name }}</p>
            </div>
          </div>
          <div class="login-info">
            <p>
              生日：<span>{{ userInfo.birthday }}</span>
            </p>
            <p>
              地址：<span>{{ userInfo.address }}</span>
            </p>
            <p>
              部门：<span>{{ userInfo.deptName }}</span>
            </p>
          </div>
        </el-card>

        <!-- 考勤记录 -->
        <el-card style="margin-top: 20px">
          <el-calendar v-model="attendanceData.date">
            <template slot="dateCell" slot-scope="{ date, data }">
              <span>{{ date.getDate() }}</span>
              <el-tag
                v-show="data.type === 'current-month'"
                :type="
                  attendanceData.tagType[
                    attendanceData.list[date.getDate() - 1]
                  ]
                "
              >
                {{
                  attendanceData.status[attendanceData.list[date.getDate() - 1]]
                }}
              </el-tag>
            </template>
          </el-calendar>
        </el-card>
      </el-col>

      <el-col :span="16" :xs="24" style="margin-top: 20px">
        <div class="num">
          <el-card
            v-for="(item, index) in countData"
            :key="index"
            :body-style="{ display: 'flex', padding: 0 }"
          >
            <i
              class="icon"
              :class="'el-icon-' + item.icon"
              :style="{ background: item.color }"
            />
            <div class="detail">
              <p class="txt" style="margin-bottom: 5px">{{ item.name }}</p>
              <p class="num">{{ item.value }}</p>
            </div>
          </el-card>
        </div>
        <el-card style="height: 300px">
          <div style="height: 300px" ref="city"></div>
        </el-card>
        <div class="graph">
          <el-card style="height: 300px">
            <div style="height: 300px" ref="staff"></div>
          </el-card>

          <el-card style="height: 300px">
            <div style="height: 300px" ref="department"></div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as echarts from "echarts";
import {
  reqStaffData,
  reqCountData,
  reqDepartmentData,
  reqCityData,
  reqAttendanceData,
} from "@/api/home";
import { currentDateInfo, nowDateInfo } from "@/utils/tools";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["userInfo"]),
    currentDate() {
      return currentDateInfo();
    },
  },
  data() {
    return {
      isLoading: true,
      // 每日员工统计
      countData: [
        {
          name: "员工总数",
          value: 0,
          icon: "user",
          color: "#409EFF",
          ps: "totalNum",
        },
        {
          name: "状态正常",
          value: 0,
          icon: "star-on",
          color: "#67C23A",
          ps: "normalNum",
        },
        {
          name: "状态异常",
          value: 0,
          icon: "s-goods",
          color: "#F56C6C",
          ps: "abnormalNum",
        },
        {
          name: "今日迟到",
          value: 0,
          icon: "timer",
          color: "#409EFF",
          ps: "lateNum",
        },
        {
          name: "今日早退",
          value: 0,
          icon: "watch",
          color: "#67C23A",
          ps: "leaveEarlyNum",
        },
        {
          name: "今日旷工",
          value: 0,
          icon: "lock",
          color: "#F56C6C",
          ps: "absenteeismNum",
        },
      ],
      // 年度入职情况
      staffOption: {
        title: {
          text: new Date().getFullYear() + "年员工入职情况",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}人",
          textStyle: {
            fontWeight: "bold",
          },
        },
        xAxis: {
          type: "category",
          data: ["一季度", "二季度", "三季度", "四季度"],
        },
        yAxis: {
          type: "value",
          name: "人数",
        },
        series: [
          {
            data: [],
            type: "line",
          },
          {
            data: [],
            type: "bar",
          },
        ],
      },
      // 员工分布情况
      departmentOption: {
        title: {
          text: "员工分布情况",
          left: "center",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}人",
          textStyle: {
            fontWeight: "bold",
          },
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            name: "Nightingale Chart",
            type: "pie",
            radius: [10, 120],
            center: ["50%", "55%"],
            roseType: "area",
            label: {
              //饼图图形上的文本标签
              normal: {
                show: true,
                position: "inner", //标签的位置
                textStyle: {
                  fontWeight: "bold",
                },
                formatter: "{d}%",
              },
            },
            itemStyle: {
              borderRadius: 3,
            },
            data: [],
          },
        ],
      },
      // 城市参保比例
      cityOption: {
        title: {
          text: "部分城市社保缴费比例",
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            return (
              "<a>" +
              params.name +
              "</a></a>" +
              "<br /><a>" +
              params.seriesName +
              ": " +
              params.data[params.seriesIndex + 1] * 100 +
              "%</a>"
            );
          },
          textStyle: {
            fontWeight: "bold",
          },
        },
        dataset: {
          source: [["product", "养老保险", "医疗保险", "失业保险", "生育保险"]],
        },
        xAxis: { type: "category" },
        yAxis: {
          type: "value",
          name: "百分比",
          axisLabel: {
            formatter: function (val) {
              return val * 100 + "%";
            },
          },
        },
        series: [
          { type: "line" },
          { type: "line" },
          { type: "line" },
          { type: "line" },
        ],
      },
      // 考勤情况
      attendanceData: {
        date: new Date(),
        list: [],
        status: ["正", "迟", "退", "旷", "休"],
        tagType: ["success", "", "warning", "danger", "info"],
      },
    };
  },
  mounted() {
    this.initData();
    window.onresize = () => {
      // echarts.init().resize()
      this.echartsChange(this.$refs.staff);
      this.echartsChange(this.$refs.city);
      this.echartsChange(this.$refs.department);
    };
  },
  watch: {
    "attendanceData.date": {
      handler(nv, ov) {
        this.getAttendanceData(nowDateInfo(nv));
      },
    },
  },
  methods: {
    // 获取每日统计
    async getCountData() {
      try {
        let res = await reqCountData();
        if (res.code === 200) {
          this.countData = this.countData.map((item) => {
            if (item.ps === "abnormalNum") {
              item.value = res.data["totalNum"] - res.data["normalNum"];
            } else {
              item.value = res.data[item.ps];
            }
            return item;
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 获取每季度人员情况
    async getStaffData() {
      try {
        let res = await reqStaffData();
        if (res.code === 200) {
          this.staffOption.series = this.staffOption.series.map((item) => {
            item.data = res.data;
            return item;
          });
          this.eInitialization(this.$refs.staff, this.staffOption);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 获取各部门人员分布情况
    async getDepartmentData() {
      try {
        let res = await reqDepartmentData();
        if (res.code === 200) {
          this.departmentOption.series[0].data = res.data;
          this.eInitialization(this.$refs.department, this.departmentOption);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 城市参保比例图表
    async getCityData() {
      try {
        let res = await reqCityData();
        if (res.code === 200) {
          this.cityOption.dataset.source.push(
            ...res.data.map((item) => [
              item.name,
              item.comPensionRate,
              item.comMedicalRate,
              item.comUnemploymentRate,
              item.comMaternityRate,
            ])
          );
          this.eInitialization(this.$refs.city, this.cityOption);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 获取考情情况
    async getAttendanceData(month) {
      try {
        let res = await reqAttendanceData({ id: 1, month });
        if (res.code === 200) {
          this.attendanceData.list = res.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 图表初始化
    eInitialization(dom, data) {
      // 检测是否已经存在echarts实例，如果不存在，则不再去初始化
      let myChart = echarts.getInstanceByDom(dom);
      if (myChart == null) {
        myChart = echarts.init(dom);
      }
      myChart.setOption(data);
    },
    // 图表随屏幕变化
    echartsChange(dom) {
      echarts.init(dom).resize();
    },
    initData() {
      Promise.all([
        this.getCountData(),
        this.getStaffData(),
        this.getDepartmentData(),
        this.getCityData(),
        this.getAttendanceData(nowDateInfo(this.attendanceData.date)),
      ]).then(() => {
        this.isLoading = false;
        console.log("图表数据加载完毕");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.home {
  .user {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 40px;
    }
    &info {
      .name {
        font-size: 32px;
        margin-bottom: 10px;
      }
      .access {
        color: #999999;
      }
    }
  }
  .login-info {
    p {
      line-height: 28px;
      font-size: 14px;
      color: #999999;
      span {
        color: #666666;
        margin-left: 60px;
      }
    }
  }
  .num {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-card {
      width: 32%;
      margin-bottom: 20px;
    }
    .icon {
      font-size: 30px;
      width: 80px;

      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      // flex:1
    }
    .detail {
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .num {
        font-size: 30px;
        margin-bottom: 10px;
      }
      .txt {
        font-size: 14px;
        text-align: center;
        color: #999999;
      }
    }
  }
  .graph {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .el-card {
      width: 48%;
    }
  }
}
</style>
