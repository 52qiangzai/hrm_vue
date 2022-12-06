<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img
            :src="'http://localhost:8888/docs/download/' + userInfo.avatar"
            class="user-avatar"
          />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> Home </el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="InfoForm.isShow = true"
            >个人中心</el-dropdown-item
          >
          <el-dropdown-item>修改密码</el-dropdown-item>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 个人信息 -->
    <el-dialog title="个人信息" :visible.sync="InfoForm.isShow" fullscreen>
      <CommonForm
        :formItemList="InfoForm.formItemList"
        :formData="InfoForm.formData"
        :inline="InfoForm.inline"
      ></CommonForm>

      <div slot="footer" class="dialog-footer">
        <el-button @click="InfoForm.isShow = false">取消</el-button>
        <el-button type="primary" @click="confirmInfo">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reqUploadFile } from "@/api/upload";
import { reqUpdateStaffInfo } from "@/api/user";
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import CommonForm from "@/components/CommonForm";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    CommonForm,
  },
  data() {
    return {
      InfoForm: {
        isShow: false,
        formData: JSON.parse(localStorage.getItem("userInfo")),
        formItemList: [
          {
            name: "avatar",
            label: "头像",
            type: "upload",
            uploadUrl: reqUploadFile(),
          },
          {
            name: "name",
            label: "姓名",
            type: "input",
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
      },
    };
  },
  mounted() {
    this.$bus.$on("uploadSuccess", (docs) => {
      this.InfoForm.formData.avatar = docs.name;
    });
  },
  beforeDestroy() {
    this.$bus.$off("uploadSuccess");
  },
  computed: {
    ...mapGetters(["sidebar", "userInfo", "token"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$message.success("退出成功");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    async confirmInfo() {
      try {
        let res = await reqUpdateStaffInfo(this.InfoForm.formData);
        if (res.code === 200) {
          this.$message.success(res.message);
          this.$store.dispatch("user/getInfo", this.InfoForm.formData);
          this.InfoForm.isShow = false;
        }
      } catch (error) {
        console.log("错误");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
