<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchObj.name" placeholder="讲师名"/>
      </el-form-item>

      <!-- v-model双向数据绑定 -->
      <el-form-item>
        <el-select v-model="searchObj.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="searchObj.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchObj.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- height="250" -->
    <el-table
      v-loading="listLoading"
      :data="list"
      :default-sort = "{prop: 'gmtCreate', order: 'descending'}"
      element-loading-text="数据加载中"

      border
      fit
      highlight-current-row
      style="width: 100%">
      <el-table-column
        label="序号"
        width="70"
        align="center">
        <!-- 自定义列的内容 -->
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column
        prop="name"
        label="姓名"
        width="180"/>
      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level===1?'高级讲师':'首席讲师' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="intro"
        label="讲师资历"/>
      <el-table-column sortable prop="gmtCreate" label="添加时间" width="160"/>
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <!-- 全局页面路由已经在main.js定义好了 -->
          <router-link :to="'/edu/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="page"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="fetchData"/>
  </div>
</template>

<script>
import teacher from '@/api/edu/teacher'
export default {

  data() { // 定义数据
    return {
      listLoading: true, // 是否显示loading信息
      list: null, // [] 数据列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 4, // 每页记录数
      searchObj: {}// 查询条件
    }
  },

  created() { // 当页面加载时获取数据
    this.fetchData()
  },

  methods: {
    resetData() {
      this.searchObj = {}
      this.fetchData()
    },
    fetchData(page = 1) { // 调用api层获取数据库中的数据
      this.page = page
      this.listLoading = true
      teacher.getPageList(this.page, this.limit, this.searchObj).then(response => {
        console.log(this.searchObj)
        // console.log(response)

        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
        // if(Response)
      })
      // console.log('加载列表')
    },

    handleSizeChange(limit = 4) { // 调用api层获取数据库中的数据
      this.limit = limit
      this.listLoading = true
      teacher.getPageList(this.page, this.limit, this.searchObj).then(response => {
        // console.log(response)

        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
        // if(Response)
      })
      // console.log('加载列表')
    },

    removeDataById(teacherId) {
      // debugger
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return teacher.deleteTeacherById(teacherId)
      }).then(response => { // 如果上一个then成功则执行此处的then回调
        this.fetchData()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(() => { // 失败
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  }
}
</script>
