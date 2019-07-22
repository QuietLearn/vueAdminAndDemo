<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" :min="0" controls-position="right"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <el-form-item label="讲师头像">
        <!-- 头像预览 -->
        <pan-thumb :image="teacher.avatar"/>

        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>

        <!--
v-show：是否显示上传组件
:key：类似于id，如果一个页面多个图片上传控件，可以做区分
:url：后台上传的url地址
:max-size：文件大小限制，单位kb
@close：关闭上传组件
@crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/admin/oss/file/upload'"
          :max-size="2048"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>

      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import teacher from '@/api/edu/teacher'
// 引入头像上传相关模块
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

const defaultTeacher = {
  name: '',
  sort: 0,
  level: 1,
  career: '',
  intro: '',
  avatar: process.env.OSS_PATH + '/avatar/default.jpg'// 阿里云oss bucket地址
}

export default {
  // 注册头像上传相关自定义组件
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: defaultTeacher,
      saveBtnDisabled: false, // 保存按钮是否禁用,
      BASE_API: process.env.BASE_API, // 接口API地址
      imagecropperShow: false,
      imagecropperKey: 0 // ????
    }
  },
  watch: {
    $route(to, from) { // to新路径
      console.log('监听路由的变化.....进行表单初始化')
      this.init()
    }
  },

  created() {
    this.init()
  },
  methods: {

    // vue-router导航切换 时，如果两个路由都渲染同个组件，组件会重（chong）用,
    // 组件的生命周期钩子（created）不会再被调用, 使得组件的一些数据无法根据 path的改变得到更新
    // 只有当两个路由不渲染相同组件时才调用 created
    // 在init方法中我们判断路由的变化，如果是修改路由，则从api获取表单数据，
    // 如果是新增路由，则重新初始化表单数据
    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.fetchDataById(id)
      } else {
        // 使用对象拓展运算符，拷贝对象，而不是引用，
        // 否则新增一条记录后，defaultForm就变成了之前新增的teacher的值
        // 路由跳转页面组件还是重新申请组件，还是会调用created初始化vue组件，所以路由跳转的组件变量数据模型不会销毁
        // { ...defaultTeacher }
        this.teacher = { ...defaultTeacher }
      }
    },

    saveOrUpdate() {
      this.saveBtnDisabled = true
      if (!this.teacher.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },

    // 保存
    saveData() {
      teacher.save(this.teacher).then(response => {
        return this.$message({
          type: 'success',
          message: '保存成功!'
        })
      }).then(resposne => {
        this.$router.push({ path: '/edu/teacher' })
      })
    },
    // 根据id查询记录
    fetchDataById(id) {
      teacher.getById(id).then(response => {
        console.log(response)
        this.teacher = response.data
      })
    },

    // 根据id更新记录
    updateData() {
      teacher.updateById(this.teacher).then(response => {
        return this.$message({
          type: 'success',
          message: '修改成功!'
        })
      }).then(resposne => {
        this.$router.push({ path: '/edu/teacher' })
      })
    },
    cropSuccess(data) {
      this.imagecropperShow = false
      // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1

      this.teacher.avatar = data.url
    },
    close() {
      this.imagecropperShow = false
      // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1
    }

  }
}
</script>
