<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <!-- 三个组件都有这个step步骤条，当路由到对应组件时，根据当前组件的active数据模型 取值 让该step点亮到对应步骤节点 -->
    <el-steps :active="active" finish-status="success" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布课程"/>
    </el-steps>

    <!-- 课程信息表单 -->
    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类：级联下拉列表 -->
      <el-form-item label="课程类别">
        <!-- 一级分类 -->
        <!-- 保证在迭代遍历的过程中,key是唯一值, vue在遍历的过程中会分配索引,即id
        id是会动态变化的(如果其他列表项被删除),没办法唯一标识，在CRUD的过程中很可能会出现问题
        例如要删除0，原来的0索引已经删除了，那么1变成0，现在1被删除了-->
        <!-- 没有固定标识，在整个数据集合中元素发生变化时索引就篡了，所以每个元素没有固定标识-->

        <!-- 需要给元素唯一标识key，会一直伴随元素的 -->
        <!-- 例如如果1堆复选框，选了0,1,2索引的框，这时删除了2，那么3会变成2，此时内存记录了用户选取0,1,2的状态
        那么3会被选上，错误的数据被选上了 -->
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择"
          @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectNestedList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>

        <!-- 二级分类 -->
        <!-- subSubjectList -->
        <el-select
          v-model="courseInfo.subjectId"
          placeholder="请选择"
        >
          <el-option
            v-for="subject in subSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleCoverSuccess"
          :before-upload="beforeCoverUpload"
          :action="BASE_API+'/admin/oss/file/upload?host=cover'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>
    </el-form>

    <div style="text-align:center">
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next()">保存并下一步</el-button>
    </div>
  </div>
</template>

<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import teacher from '@/api/edu/teacher'
import Tinymce from '@/components/Tinymce'
const defaultForm = {
  title: '',
  subjectId: '',
  subjectParentId: '',
  teacherId: '',
  lessonNum: 0,
  description: '',
  cover: process.env.OSS_PATH + '/cover/default.gif',
  price: 0
}
export default {
  components: { Tinymce },
  data() {
    return {
      BASE_API: process.env.BASE_API, // 接口API地址
      active: 0,
      courseInfo: defaultForm,
      saveBtnDisabled: false, // 保存按钮是否禁用
      subjectNestedList: [], // 一级分类列表
      subSubjectList: [], // 二级分类列表
      teacherList: []// 教師列表
    }
  },

  // 一般监听用于组件重用，因为组件重用不会引起created方法
  // 当监听到该相同组件路由变化时，该监听器就会执行init方法获取路由参数来回显更新需要的数据
  watch: {
    $route(to, from) {
      console.log('watch $route')
      this.init()
    }
  },
  created() {
    this.init()
  },

  methods: {
    init() {
      // 初始化分类列表
      // this.initSubjectList()
      // this.initTeacherList()

      // 如果路由中带有params参数对象，且参数对象有id属性且不为空
      // 健壮性校验，默认情况下路由中params 在当前版本是一直存在的，是{}，之前可能是未定义，空的情况
      if (this.$route.params && this.$route.params.id) {
        // 取出id，并用一个变量名指示代表，便于使用，且不可修改
        const id = this.$route.params.id
        console.log(id)
        // 根据id获取课程基本信息
        this.fetchCourseInfoById(id)
      } else {
        // 为了解决：保存数据后，再次新建课程，会出现显示上一次保存的数据信息的问题
        // 因为courseinfo保存了defaultForm的引用，courseinfo修改，引起defaultForm修改
        // 然后页面加载courseInfo: defaultForm, courseInfo还是被赋值了上次的结果
        this.courseInfo = { ...defaultForm }
        // 初始化分类列表
        this.initSubjectList()
      }
      // 获取讲师列表
      this.initTeacherList()
    },

    fetchCourseInfoById(id) {
      // 获取表单回填数据                               //1 java       2  后端开发
      course.getCourseInfoById(id).then(response => { // subject_id  subject_parent_id
        this.courseInfo = response.data.item

        // 初始化分类列表
        // this.initSubjectList()
        subject.getNestedTreeList().then(response => {
          console.log(response)
          this.subjectNestedList = response.data

          // 填充二级菜单：遍历一级菜单列表，
          for (let i = 0; i < this.subjectNestedList.length; i++) {
            // 找到和courseInfo.subjectParentId一致的父类别记录
            if (this.subjectNestedList[i].id === this.courseInfo.subjectParentId) {
              // 拿到当前类别下的子类别列表，将子类别列表填入二级下拉菜单列表
              this.subSubjectList = this.subjectNestedList[i].children
            }
          }
        })
      })
    },

    initSubjectList() {
      subject.getNestedTreeList().then(response => {
        this.subjectNestedList = response.data
      })
    },

    initTeacherList() {
      teacher.getList().then(response => {
        this.teacherList = response.data
      })
    },

    // 1次请求 请求所有数据交给前端进行整理嵌套展示,select的change回调函数，默认将select的value传入进来
    subjectLevelOneChanged(value) {
      console.log(value)
      for (let i = 0; i < this.subjectNestedList.length; i++) {
        // this.subjectNestedList[i].id
        const subjectNest = this.subjectNestedList[i]
        if (subjectNest.id === value) {
          this.subSubjectList = this.subjectNestedList[i].children
          // 当点击一级分类后情况二级分类，进行重新选择，不然还是显示上次的内容
          this.courseInfo.subjectId = ''
        }
      }
    },

    // 根据ajax获取二级类别
    subjectLevelOneChanged2(value) { // value 点击1级类别 change方法传过来的回调参数1级类别的id
      console.log(value)
      // 根据value调用后端api获取 parentId=value的二级类别 数据
      subject.getChildNestedTreeList(value).then(response => {
        this.subSubjectList = response.data.items
        this.courseInfo.subjectId = ''
      })
    },

    next() {
      this.saveBtnDisabled = true
      if (!this.courseInfo.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },
    // 保存
    saveData() {
      course.saveCourseInfo(this.courseInfo).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        // return是因为上下两个操作是异步的，而我想等弹框加载完成点确定才跳转下个页面，不然很快直接跳到下个页面了
        return response// 将响应结果传递给then
      }).then(response => {
        this.$router.push({ path: '/edu/course/chapter/' + response.data.courseId })
      })
    },

    // updateData() {
    //   this.$router.push({ path: '/edu/course/chapter/1' })
    // },

    updateData() {
      this.saveBtnDisabled = true
      course.updateCourseInfoById(this.courseInfo).then(response => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      }).then(() => {
        this.$router.push({ path: '/edu/course/chapter/' + this.courseInfo.id })
      })
    },

    // 当点击上传图片组件进行图片上传服务接口调用
    // 且上到阿里云且成功后回调函数
    handleCoverSuccess(res, file) {
      // 上传响应
      console.log(URL.createObjectURL(file.raw))// base64编码
      // res-->response
      this.courseInfo.cover = res.data.url
    },

    beforeCoverUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传课程封面只能是 JPG或者PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传课程封面大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }

  }
}
</script>
<style scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}
</style>
