<template>
  <div class="app-container">
    <el-alert
      title="文件管理"
      style="margin: 10px 0"
      type="success"
      description="对系统的文件进行统一管理，我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的我是凑字数的。"
    >
    </el-alert>
    <div style="margin: 10px 0">
      <el-button type="primary" @click="handleAdd" size="mini"
        >上传 <i class="el-icon-circle-plus-outline"></i>
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
    <CommonTable
      :tableData="table.tableData"
      :tableLabel="table.tableLabel"
      :pageConfig="table.pageConfig"
    >
      <template v-slot:slot1="{ obj }">
        <el-button type="warning" @click="download(obj)" size="mini"
          >下载 <i class="el-icon-download" /></el-button></template
    ></CommonTable>
    <!-- 编辑弹窗 -->
    <el-dialog
      :title="dialogForm.type === 'edit' ? '编辑文件' : '上传文件'"
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
  </div>
</template>

<script>
import {
  reqFileInfo,
  reqAddFileInfo,
  reqDeleteFileInfo,
  reqBatchDeleteFileInfo,
} from "@/api/system";
import { reqUploadFile, reqDownloadApi } from "@/api/upload";
import CommonTable from "@/components/CommonTable";
import CommonForm from "@/components/CommonForm";
export default {
  name: "docs",
  components: { CommonTable, CommonForm },
  data() {
    return {
      table: {
        tableData: [],
        tableLabel: [
          {
            name: "name",
            label: "文件名称",
            type: "column",
            width: 200,
          },
          {
            name: "type",
            label: "文件类型",
            type: "column",
          },
          {
            name: "oldName",
            label: "文件原名称",
            type: "column",
          },
          {
            name: "size",
            label: "文件大小（KB）",
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
      searchForm: {
        formItemList: [
          {
            name: "name",
            label: "文件名",
            type: "input",
            icon: "el-icon-search",
          },
        ],
        formData: {},
        inline: true,
      },
      dialogForm: {
        type: "edit",
        isShow: false,
        formItemList: [
          {
            name: "remark",
            type: "textarea",
            label: "备注",
          },
        ],
        formData: {},
      },
      ids: [],
    };
  },

  mounted() {
    this.getFileInfo();
    this.$bus.$on("sizeChange", (size) => {
      this.table.pageConfig.size = size;
      this.getFileInfo();
    });
    this.$bus.$on("currentChange", (current) => {
      this.table.pageConfig.current = current;
      this.getFileInfo();
    });
    this.$bus.$on("edit", (row) => {
      this.dialogForm.type = "edit";
      this.dialogForm.formData = JSON.parse(JSON.stringify(row));
      this.dialogForm.isShow = true;
    });
    this.$bus.$on("uploadSuccess", (docs) => {
      this.dialogForm.formData = docs;
    });
    this.$bus.$on("del", (row) => {
      this.deleteFileInfo(row.id);
    });
    this.$bus.$on("selectionChange", (val) => {
      this.ids = val.map((item) => item.id);
    });
  },
  methods: {
    // 获取文件信息
    async getFileInfo() {
      try {
        let res = await reqFileInfo(
          this.table.pageConfig.current,
          this.table.pageConfig.size
        );
        if (res.code === 200) {
          const { total, list } = res.data;
          this.table.pageConfig.total = total;
          this.table.tableData = list;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 上传文件
    handleAdd() {
      this.dialogForm.type = "add";
      this.dialogForm.isShow = true;
      this.dialogForm.formItemList = [
        {
          name: "name",
          type: "upload",
          label: "头像",
          uploadUrl: reqUploadFile(),
        },
        {
          name: "remark",
          type: "textarea",
          label: "备注",
        },
      ];
    },
    // 批量删除文件
    async handleDeleteBatch() {
      try {
        let res = await reqBatchDeleteFileInfo(this.ids.toString());
        if (res.code === 200) {
          this.$message.success(res.message);
          this.getFileInfo();
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 搜索文件
    async search() {
      try {
        let res = await reqFileInfo(
          this.table.pageConfig.current,
          this.table.pageConfig.size,
          this.searchForm.formData.name
        );
        if (res.code === 200) {
          const { total, list } = res.data;
          this.table.pageConfig.total = total;
          this.table.tableData = list;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 重置文件信息
    reset() {
      this.searchForm.formData.name = "";
      this.getFileInfo();
    },
    // 更新或添加用户信息
    async confirm() {
      try {
        let res;
        if (this.dialogForm.type === "edit") {
          res = await reqAddFileInfo(this.dialogForm.formData);
        } else {
          const { id, remark } = this.dialogForm.formData;
          res = await reqAddFileInfo({ id, remark });
        }
        if (res.code === 200) {
          this.$message.success(res.message);
          this.dialogForm.isShow = false;
          this.getFileInfo();
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 删除文件信息
    async deleteFileInfo(id) {
      try {
        let res = await reqDeleteFileInfo(id);
        if (res.code === 200) {
          this.$message.success(res.message);
          this.getFileInfo();
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 下载文件
    download(data) {
      const a = document.createElement("a");
      a.setAttribute("style", "display:none;");
      a.setAttribute("href", reqDownloadApi() + data.name);
      a.click()
    },
  },
  beforeDestroy() {
    this.$bus.$off("sizeChange");
    this.$bus.$off("currentChange");
    this.$bus.$off("del");
    this.$bus.$off("edit");
    this.$bus.$off("selectionChange");
    this.$bus.$off("uploadSuccess");
  },
};
</script>
