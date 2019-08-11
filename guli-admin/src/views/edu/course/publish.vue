<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="active" finish-status="success" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布课程"/>
    </el-steps>

    <!--课程预览-->
    <div class="ccInfo">
      <img :src="coursePublish.cover">
      <div class="main">
        <h2>{{ coursePublish.title }}</h2>
        <p class="gray"><span>共{{ coursePublish.lessonNum }}课时</span></p>
        <p><span>所属分类：{{ coursePublish.subjectLevelOne }} — {{ coursePublish.subjectLevelTwo }}</span></p>

        <p>课程讲师：{{ coursePublish.teacherName }}</p>
        <h3 class="red">￥{{ coursePublish.price }}</h3>
      </div>

    </div>
    <div>
      <!-- 章节列表 -->
      <ul class="chapterList">
        <li
          v-for="chapter in chapterNestedList"
          :key="chapter.id">
          <p>
            {{ chapter.title }}
          </p>

          <!-- 视频 -->
          <ul class="chapterList videoList">
            <li
              v-for="video in chapter.videoVoList"
              :key="video.id">
              <p>
                {{ video.title }}
                <span class="acts">
                  <el-tag v-if="video.videoSourceId === ''" size="mini" type="danger">
                    {{ '尚未上传视频' }}
                  </el-tag>
                  <el-tag v-if="video.free" size="mini" type="success">{{ '免费观看' }}</el-tag>

                </span>
              </p>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <div style="text-align:center">
      <el-button @click="previous">返回修改</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="publish">发布课程</el-button>
    </div>
  </div>
</template>

<script>
import course from '@/api/edu/course'
import chapter from '@/api/edu/chapter'

export default {
  data() {
    return {
      active: 2,
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId: '', // 所属课程
      coursePublish: {},
      chapterNestedList: []
    }
  },

  created() {
    console.log('publish created')
    this.init()
  },

  methods: {
    init() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        // 根据id获取课程基本信息
        this.fetchCoursePublishInfoById()
        this.fetchChapterNestedListByCourseId()
      }
    },

    fetchChapterNestedListByCourseId() {
      chapter.getNestedTreeList(this.courseId).then(response => {
        this.chapterNestedList = response.data
      })
    },

    fetchCoursePublishInfoById() {
      course.getCoursePublishInfoById(this.courseId).then(response => {
        this.coursePublish = response.data.item
      })
    },

    previous() {
      console.log('previous')
      this.$router.push({ path: '/edu/course/chapter/' + this.courseId })
    },

    publish() {
      console.log('publish')
      course.publishCourse(this.courseId).then(response => {
        this.$router.push({ path: '/edu/course/list' })
        this.active = 3
      })
    }
  }
}
</script>

<style scoped>
.chapterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chapterList li{
  position: relative;
}
.chapterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chapterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dashed #DDD;
}

.ccInfo {
    background: #f5f5f5;
    padding: 20px;
    overflow: hidden;
    border: 1px dashed #DDD;
    margin-bottom: 40px;
    position: relative;
}
.ccInfo img {
    background: #d6d6d6;
    width: 500px;
    height: 278px;
    display: block;
    float: left;
    border: none;
}
.ccInfo .main {
    margin-left: 520px;
}

.ccInfo .main h2 {
    font-size: 28px;
    margin-bottom: 30px;
    line-height: 1;
    font-weight: normal;
}
.ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}

.ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}
.ccInfo .main h3 {
    left: 540px;
    bottom: 20px;
    line-height: 1;
    font-size: 28px;
    color: #d32f24;
    font-weight: normal;
    position: absolute;
}
</style>
