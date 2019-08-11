<template>
  <!-- 添加和修改课时表单 -->
  <el-dialog :visible.sync="dialogVisible" title="添加课时" @close="close">

    <el-form :model="video" label-width="120px">
      <el-form-item label="课时标题">
        <el-input v-model="video.title"/>
      </el-form-item>

      <el-form-item label="课时排序">
        <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
      </el-form-item>

      <el-form-item label="是否免费">
        <el-radio-group v-model="video.free">
          <el-radio :label="true">免费</el-radio>
          <el-radio :label="false">默认</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- :on-success="handleVodUploadSuccess"
       :action="BASE_API+'/admin/vod/video/upload'" -->
      <el-form-item label="上传视频" label-width="120px" >
        <el-upload
          ref="upload"
          :on-change="fileChange"

          :on-exceed="handleUploadExceed"
          :before-remove="beforeVodRemove"
          :on-remove="handleVodRemove"
          :file-list="fileList"

          :limit="1"
          :auto-upload="false"
          class="upload-demo">
          <el-button slot="trigger" size="small" type="primary">上传视频</el-button>
          <el-tooltip placement="right-end">
            <div slot="content">最大支持1G，<br>
              支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
              GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
              MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
              SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
            <i class="el-icon-question"/>
          </el-tooltip>
          <el-button
            :disabled="uploadDisabled"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="authUpload">开始上传</el-button>

          <label class="status"><span>{{ statusText }}</span></label>
          <span class="progress"><i id="auth-progress">{{ authProgress }}</i></span>
        </el-upload>
      </el-form-item>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import video from '@/api/edu/video'
import vod from '@/api/edu/vod'
export default {

  // 父组件向子组件传值
  props: {
    courseId: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      timeout: '',
      // 分片大小默认1M，不能小于100K
      partSize: '',
      // 并行上传分片个数，默认5
      parallel: '',
      // 网络原因失败时，重新上传次数，默认为3
      retryCount: '',
      // 网络原因失败时，重新上传间隔时间，默认为2秒
      retryDuration: '',
      // 阿里账号ID，必须有值 ，值的来源https://help.aliyun.com/knowledge_detail/37196.html
      userId: '1549560786075615',
      // 上传到点播的地域， 默认值为'cn-shanghai',//eu-central-1,ap-southeast-1
      region: 'cn-shanghai',
      //
      file: null,
      // 文件上传进度条
      authProgress: null,
      //
      uploadDisabled: true,
      // 核心文件上传对象
      uploader: null,
      // 文件上传状态
      statusText: '',

      dialogVisible: false,
      video: {// 课时对象
        chapterId: '',
        title: '',
        sort: 0,
        free: false,
        videoSourceId: '', // 阿里云视频id
        videoOriginalName: '' // 视频名称
      },
      fileList: [], // 上传文件列表
      BASE_API: process.env.BASE_API // 接口API地址
    }
  },

  methods: {

    open(chapterId, videoId) {
      this.dialogVisible = true
      this.video.chapterId = chapterId
      if (videoId) {
        video.getById(videoId).then(response => {
          //
          this.video = response.data.item
          // 如果数据库有 阿里云上传的视频信息那么就回显，不然fileList还是有值不过是[{'name':''}]，还是会显示出来
          if (this.video.videoSourceId && this.video.videoOriginalName) {
            this.fileList = [{ 'name': this.video.videoOriginalName }]
          }
        })
      }
    },

    close() {
      this.dialogVisible = false
      // 重置表单
      this.resetForm()
    },

    resetForm() {
      this.video.id = null
      this.video.title = ''
      this.video.sort = 0
      this.video.chapterId = ''
      this.video.free = false
      this.video.videoSourceId = ''
      this.video.videoOriginalName = ''

      this.fileList = []

      this.file = null
      this.authProgress = null
      this.uploadDisabled = true

      // 核心文件上传对象
      this.uploader = null
      this.statusText = ''
    },

    saveOrUpdate() {
      if (!this.video.id) {
        this.save()
      } else {
        this.update()
      }
    },

    save() {
      this.video.courseId = this.courseId
      console.log(this.video)
      video.save(this.video).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        // 关闭组件
        this.close()
        // 调用父组件监听函数
        this.$emit('onSaveSuccess')
      })
    },

    update() {
      video.updateById(this.video).then(response => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        // 关闭组件
        this.close()
        // 调用父组件监听函数
        this.$emit('onSaveSuccess')
      })
    },

    /**
     * 选择文件
     */
    fileChange(file, fileList) {
      console.log('fileChange')
      // 选取文件的元(基本)信息赋值
      this.file = file.raw
      // 兼容一些低版本浏览器，以免空选文件的情况，谷歌没选文件是不行的
      if (!this.file) {
        // this.$message({
        //   type: 'warning',
        //   message: '请选择要上传的文件'
        // })
        alert('请先选择需要上传的文件!')
        return
      }
      // 用户数据的初始化数据结构 STS的需要构建，不是STS创建置空即可
      var userData = '{"Vod":{}}'
      if (this.uploader) {
        this.uploader.stopUpload()
        this.authProgress = 0
        this.statusText = ''
      }
      // 初始化文件上传组件
      this.uploader = this.createUploader()
      console.log(userData)
      //   this.uploader在添加完文件会触发回调它里面的方法
      // 赋值完不为null可以用方法，成功才会回调
      this.uploader.addFile(this.file, null, null, null, userData)
      this.uploadDisabled = false
    },
    /**
     * 开始上传
     */
    authUpload() {
    // 然后调用 startUpload 方法, 开始上传
      if (this.uploader !== null) {
        // 会调用onUploadstarted，上传失败或者成功都有回调
        this.uploader.startUpload()
        this.uploadDisabled = true
      }
    },

    // 视频上传成功的回调,与删除的按钮有所不同，删除前会有弹窗用于确认，那说明是真的删除了
    // 而这里不仅有保存(不能直接修改数据库的视频信息)和更新的区别，而且可能用户会点取消不保存该状态
    handleVodUploadSuccess(response, file, fileList) {
      this.video.videoSourceId = response.data
      this.video.videoOriginalName = file.name
    },
    // 上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },

    // this.$confirm是组件的默认方法调用吗
    // 点击确定return会返回true

    // 当写这个回调方法时，会看这个方法返回true还是false，如果没有就直接删除了
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },

    // 删除时回调，除了默认有对dom对象做删除，还会调用这个回调方法做方法处理
    handleVodRemove(file, fileList) {
      console.log(file)
      vod.removeById(this.video.videoSourceId).then(response => {
        this.video.videoSourceId = ''
        this.video.videoOriginalName = ''
        this.fileList = []
        // 及时更新，以免删除完用户没有点保存表单，就调用其他页面再回来查看该视频回显时，
        // 其实数据库还是原来的数据，又回显出来了，其实可以直接在后端进行数据更新，传的参数多一点而已，需要videoId
        video.updateById(this.video)
        this.$message({
          type: 'success',
          message: response.message
        })
      })
    },

    /**
     * 创建AliyunUpload播放器组件
     */
    createUploader(type) {
      console.log('createUploader')
      const self = this

      /* eslint-disable no-undef */
      // 该js对象有属性设置
      //  模块化编程式必须在上下文中找到该对象，有模块引入才行
      const uploader = new AliyunUpload.Vod({
        // this也有作用域的，这里的this代表new AliyunUpload.Vod的uploader this对象
        // 属性没有硬编码，而是在数据绑定那设置
        userId: self.userId, // 阿里账号ID ，值的来源https://help.aliyun.com/knowledge_detail/37196.html
        region: self.region, // 上传到点播的地域， 默认值为'cn-shanghai',//eu-central-1,ap-southeast-1
        // 如果定义了用定义的，如果没有定义用60000
        timeout: self.timeout || 60000, // 超时时间
        partSize: self.partSize || 1048576, // 分片大小默认1M，不能小于100K
        parallel: self.parallel || 5, // 并行上传分片个数，默认5
        retryCount: self.retryCount || 3, // 网络原因失败时，重新上传次数，默认为3
        retryDuration: self.retryDuration || 2, // 网络原因失败时，重新上传间隔时间，默认为2秒
        // 添加文件成功
        addFileSuccess: function(uploadInfo) {
          console.log('添加文件成功')
          console.log(uploadInfo)
          self.uploadDisabled = false
          self.statusText = '添加文件成功, 等待上传...'
          console.log('addFileSuccess: ' + uploadInfo.file.name)
        },
        // 开始上传
        onUploadstarted: function(uploadInfo) {
          console.log('开始上传')
          console.log(uploadInfo)
          console.log('获取上传地址和凭证')
          const fileName = uploadInfo.file.name
          const title = fileName.substring(0, fileName.lastIndexOf('.'))
          // 调用 获取视频上传地址和凭证接口
          // 调用 uploader.setUploadAuthAndAddress 方法
          vod.getUploadAuthAndAddress(title, fileName).then(response => {
            console.log(response)
            const uploadAuth = response.data.uploadAuth
            const uploadAddress = response.data.uploadAddress
            const videoId = response.data.videoId
            uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
          })
          self.statusText = '文件开始上传...'
        },
        // 文件上传成功
        onUploadSucceed: function(uploadInfo) {
          console.log('onUploadSucceed')
          console.log(uploadInfo.file)
          self.statusText = '文件上传成功!'
          const fileName = uploadInfo.file.name
          const title = fileName.substring(0, fileName.lastIndexOf('.'))
          self.video.videoOriginalName = title
          self.video.videoSourceId = uploadInfo.videoId
          console.log(self.video)
        },
        // 文件上传失败
        onUploadFailed: function(uploadInfo, code, message) {
          console.log('onUploadFailed: file:' + uploadInfo.file.name + ',code:' + code + ', message:' + message)
          self.statusText = '文件上传失败!'
        },
        // 在上传的过程中会自动回调调用该方法
        // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
        // 上传文件的基本信息uploadInfo
        onUploadProgress: function(uploadInfo, totalSize, progress) {
          console.log('onUploadProgress:file:' + uploadInfo.file.name + ', fileSize:' + totalSize + ', percent:' + Math.ceil(progress * 100) + '%')
          const progressPercent = Math.ceil(progress * 100)
          self.authProgress = progressPercent + '%'
          self.statusText = '文件上传中...'
        },
        // 上传凭证超时
        onUploadTokenExpired: function(uploadInfo) {
          // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
          // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
          // 然后调用 resumeUploadWithAuth 方法
          vod.refreshUploadAuthAndAddress(uploadInfo.videoId).then(response => {
            console.log(response)
            const uploadAuth = response.data.uploadAuth
            // 上传凭证失效后恢复上传
            // 重置上传凭证或者是上传对象
            uploader.resumeUploadWithAuth(uploadAuth)
            console.log('upload expired and resume upload with uploadauth ' + uploadAuth)
          })
          self.statusText = '文件超时...'
        },
        // 全部文件上传结束
        onUploadEnd: function(uploadInfo) {
          console.log('onUploadEnd: uploaded all the files')
          self.statusText = '文件上传完毕'
          // 可以上传完成后的收尾工作
        }
      })
      return uploader
    }
  }
}
</script>
