<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="OSS_PATH + '/excel/课程分类列表模板.xls'">点击下载模版</a>
        </el-tag>

      </el-form-item>

      <!-- 回调函数在组件内部进行调用，会用回调参数，不要自己写参数进去 -->
      <!-- auto-upload不用点击按钮，自动向action地址上传 -->
      <!-- 所以改为在按钮注册上传事件 -->
      <!-- 某些情况还是要把节点取出来做一些事情 ref引用=id，有脚本去调用 -->

      <!-- 事件直接在属性上写on:xxx即可，fileUploadSuccess事件函数已注册 -->
      <!-- 另外组件还有自带的方法，需要取到组件值才能调用方法 auto-upload=false需要主动做提交动作-->
      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"

          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API+'/admin/edu/subject/category/import'"
          name="file"
          accept="application/vnd.ms-excel">
          <!--  trigger与跳出选择文件对话框绑定-->
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">{{ fileUploadBtnText }}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {

  data() {
    return {
      BASE_API: process.env.BASE_API, // 接口API地址
      OSS_PATH: process.env.OSS_PATH, // 阿里云OSS地址
      fileUploadBtnText: '上传到服务器', // 按钮文字
      importBtnDisabled: false, // 按钮是否禁用,
      loading: false
    }
  },
  methods: {
    submitUpload() {
      this.fileUploadBtnText = '正在上传'
      this.importBtnDisabled = true
      this.loading = true
      // this.$refs.upload 这样就把组件取出来了，实际是想调用它的方法，而不是dom
      this.$refs.upload.submit()
    },

    // :on-success="fileUploadSuccess"动态绑定  回调函数，会自动传入参数
    fileUploadSuccess(response) {
      console.log(response)
      if (response.success === true) {
        this.fileUploadBtnText = '导入成功'
        this.loading = false
        this.importBtnDisabled = false
        this.$message({
          type: 'success',
          message: response.msg
        })
      } else {
        this.fileUploadBtnText = '导入失败'
        this.loading = false
        this.importBtnDisabled = false
        // .errorMsgList
        const messages = response.data
        let msgString = '<ul>'
        messages.forEach(msg => {
          msgString += `<li>${msg}</li>`
        })
        msgString += '</ul>'
        this.$alert(msgString, response.message, {
          // 可以在alert弹窗中做许多配置，这里只做一个，因为弹窗不支持html
          // 支持html字符串，通过浏览器解析的方式渲染出来，而不是原样输出
          dangerouslyUseHTMLString: true // 渲染返回值中的html
        })
      }
    },

    fileUploadError(response) {
      this.fileUploadBtnText = '导入失败'
      this.loading = false
      this.importBtnDisabled = false
      this.$message({
        type: 'error',
        message: '导入失败'
      })
    }
  }
}
</script>
