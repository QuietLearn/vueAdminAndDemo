<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <!-- 三个组件都有这个step步骤条，当路由到对应组件时，根据当前组件的active数据模型 取值 让该step点亮到对应步骤节点 -->
    <el-steps :active="active" finish-status="success" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布课程"/>
    </el-steps>

    <!--课程章节列表-->
    <!-- 子組件中的属性传值 -->
    <ChapterList :course-id="courseId" />

    <div style="text-align:center">
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>
  </div>
</template>

<script>
import ChapterList from '@/views/edu/course/components/ChapterList'

export default {
  // 注册组件
  components: { ChapterList },
  data() {
    return {
      courseId: '', // 所属的课程id
      active: 1,
      saveBtnDisabled: false // 保存按钮是否禁用
    }
  },

  created() {
    this.init()
  },

  methods: {
    init() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
      }
    },

    previous() {
      this.$router.push({ path: '/edu/course/info/' + this.courseId })
    },

    next() {
      this.$router.push({ path: '/edu/course/publish/' + this.courseId })
    }
  }
}
</script>
