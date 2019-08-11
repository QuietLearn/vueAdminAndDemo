<template>
  <!-- 添加和修改章节表单 -->
  <!-- 组件和组件有嵌套，有父子关系，子组件和父组件通信的话，要做到数据信息的同步，加上sync的修饰符
  保证能够关闭掉子组件窗口 -->
  <el-dialog :visible.sync="dialogVisible" title="添加章节" @close="close">

    <el-form :model="chapter" label-width="120px">
      <el-form-item label="章节标题">
        <el-input v-model="chapter.title"/>
      </el-form-item>

      <el-form-item label="章节排序">
        <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import chapter from '@/api/edu/chapter'

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
      dialogVisible: false,
      chapter: {// 章节对象
        courseId: '',
        title: '',
        sort: 0
      }
    }
  },

  methods: {
    open(chapterId) {
      this.dialogVisible = true
      if (chapterId) {
        chapter.getById(chapterId).then(response => {
          this.chapter = response.data.item
        })
      }
    },

    // 虽然el-dialog是有自带的close方法，但也只是保证弹窗隐藏而已
    // 无法确保表单数据清空重置
    close() {
      this.dialogVisible = false
      // 重置表单
      this.resetForm()
    },

    saveOrUpdate() {
      if (!this.chapter.id) {
        this.save()
      } else {
        this.update()
      }
    },

    save() {
      console.log(this.chapter)
      this.chapter.courseId = this.courseId
      chapter.save(this.chapter).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        // 关闭组件
        this.close()
        // 触发父组件的onSaveSuccess事件，此时父组件会指向后面的引用方法
        // 函数注册给onSaveSuccess事件，事件一触发便会调用该函数
        // 调用父组件中在onSaveSuccess中注册的回调函数

        // 调用父组件监听函数
        this.$emit('onSaveSuccess')
      })
    },

    update() {
      chapter.updateById(this.chapter).then(response => {
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

    resetForm() {
      this.chapter.id = null
      this.chapter.title = ''
      this.chapter.sort = 0
    }
  }
}
</script>
