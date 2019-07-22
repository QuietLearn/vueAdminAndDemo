<template>
  <div class="app-container">
    <!-- 查询功能，可以把对应的节点过滤出来 -->
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />
    <!-- @node-click="handleNodeClick"
    适用于延迟加载，当点击父节点可以进行后台ajax查询
    会回调传入当前节点，可以拿到当前节点的id然后查询-->
    <el-tree
      ref="subjectTree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"

      default-expand-all
    />

  </div>
</template>

<script>
import subject from '@/api/edu/subject'
export default {

// js属性即方法，如果属性：后面跟方法(方法引用)那么该属性就是方法
  data() {
    return {
      filterText: '', // 过滤文本
      subjectList: [], // 数据列表
      // 指定1个节点的子节点和文本是什么
      defaultProps: {// 属性列表数据属性的key
        children: 'children',
        label: 'title'
      }
    }
  },

  // 监听 filterText的变化
  watch: {
    filterText(val) {
      // 调用tree dom对象的filter方法
      this.$refs.subjectTree.filter(val)
    }
  },

  created() {
    this.fetchNodeList()
  },

  methods: {
    // 获取远程数据
    fetchNodeList() {
      subject.getNestedTreeList().then(response => {
        console.log(response)
        if (response.success === true) {
          this.subjectList = response.data
        }
      })
    },

    // 过滤节点
    // 执行遍历树下面的所有节点
    // data--》当前被遍历的节点数据
    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1// 忽略大小写
    }
  }
}
</script>
