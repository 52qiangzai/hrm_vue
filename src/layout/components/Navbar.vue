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
          <el-dropdown-item @click.native="pwdForm.isShow = true"
            >修改密码</el-dropdown-item
          >
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
    <!-- 密码修改 -->
    <el-dialog title="修改密码" :visible.sync="pwdForm.isShow" width="80%">
      <CommonForm
        ref="pwdForm"
        :formItemList="pwdForm.formItemList"
        :formData="pwdForm.formData"
        :inline="pwdForm.inline"
        :rules="pwdForm.rules"
      ></CommonForm>

      <div slot="footer" class="dialog-footer">
        <el-button @click="pwdForm.isShow = false">取消</el-button>
        <el-button type="primary" @click="confirmPwd">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reqUploadFile } from "@/api/upload";
import {
  reqUpdateStaffInfo,
  reqUpdatePassword,
  reqCheckPassword,
} from "@/api/user";
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
    // 检查密码是否正确
    let checkPwd = async (rule, value, callback) => {
      try {
        let res = await reqCheckPassword(value, this.userInfo.id);
        if (res.code === 200) {
          callback();
        } else {
          callback(new Error("密码输入错误！"));
        }
      } catch (error) {
        callback(new Error("验证出错"));
      }
    };
    let checkNewPwd = (rule, value, callback) => {
      if (value === this.pwdForm.formData.password) {
        callback(new Error("不能使用近期的密码！"));
      } else {
        callback();
      }
    };
    // 检查密码是否一致
    let checkConfirmPwd = (rule, value, callback) => {
      if (value !== this.pwdForm.formData.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
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
      pwdForm: {
        isShow: false,
        inline: false,
        formData: {},
        formItemList: [
          {
            name: "password",
            label: "原密码",
            type: "password",
          },
          {
            name: "newPassword",
            label: "新密码",
            type: "password",
          },
          {
            name: "confirmPassword",
            label: "确认密码",
            type: "password",
          },
        ],
        rules: {
          password: [
            { required: true, message: "请输入原密码", trigger: "blur" },
            { min: 3, max: 10, message: "长度在3到10个字符", trigger: "blur" },
            { validator: checkPwd, trigger: "blur" },
          ],
          newPassword: [
            { required: true, message: "请输入新密码", trigger: "blur" },
            { min: 3, max: 10, message: "长度在3到10个字符", trigger: "blur" },
            { validator: checkNewPwd, trigger: "blur" },
          ],
          confirmPassword: [
            { required: true, message: "请输入确认密码", trigger: "blur" },
            { min: 3, max: 10, message: "长度在3到10个字符", trigger: "blur" },
            { validator: checkConfirmPwd, trigger: "blur" },
          ],
        },
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
    confirmPwd() {
      this.$refs.pwdForm.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            let res = await reqUpdatePassword({
              id: this.userInfo.id,
              password: this.pwdForm.formData.newPassword,
            });
            if (res.code === 200) {
              this.$message.success("密码修改成功，请重新登录！");
              this.$store.dispatch("user/logout");
              this.$router.push({ name: "login" });
            } else {
              this.$message.error("密码修改失败！");
            }
          } catch (error) {
            console.log(error);
          }
          this.pwdForm.isShow = false;
        } else {
          return false;
        }
      });
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
