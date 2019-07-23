<template>
  <div class="app-container">
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item>
        <el-select v-model="searchObj.type" clearable placeholder="请选择">
          <!-- 有value便于传给后台区分到底选择了哪个 -->
          <!-- 现在是硬编码，以后可以放在数据字典中 通过查询获得 -->

          <!-- 可选，可设置多选，然后全都显示在图表中 -->
          <el-option label="学员登录数统计" value="login_num"/>
          <el-option label="学员注册数统计" value="register_num"/>
          <el-option label="课程播放数统计" value="video_view_num"/>
          <el-option label="每日课程数统计" value="course_num"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="searchObj.begin"
          type="date"
          placeholder="选择开始日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchObj.end"
          type="date"
          placeholder="选择截止日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <!-- :disabled来控制表单重复提交 -->
      <el-button
        :disabled="btnDisabled"
        type="primary"
        icon="el-icon-search"
        @click="showChart()">查询</el-button>
    </el-form>

    <div class="chart-container">
      <div id="chart" class="chart" style="height:500px;width:100%" />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import daily from '@/api/statistics/daily'

export default {
  data() {
    return {
      // searchObj: {}直接这样写也可以，那么对应的属性就是undefined
      // 下面这样写有默认值
      searchObj: {
        type: '',
        begin: '',
        end: ''
      },
      btnDisabled: false,
      // 后面有多个方法都想用chart对象，那么可以放在数据中，
      //   后面的方法都可以访问的到，相当于成员变量
      chart: null,
      title: '',
      xData: [],
      yData: []
    }
  },
  methods: {
    showChart() {
      this.initChartData()

      // this.setChart()//放在initChartData回调中执行
    },

    // 准备图表数据，通过调用api从后台获取数据
    initChartData() {
      daily.showChart(this.searchObj).then(response => {
        // 数据
        this.yData = response.data.dataList

        // 横轴时间
        this.xData = response.data.dateList

        // 当前统计类别
        switch (this.searchObj.type) {
          case 'register_num':
            this.title = '学员注册数统计'
            break
          case 'login_num':
            this.title = '学员登录数统计'
            break
          case 'video_view_num':
            this.title = '课程播放数统计'
            break
          case 'course_num':
            this.title = '每日课程数统计'
            break
        }

        // 当数据获取成功后在进行chart的显示
        this.setChart()
      })
    },

    // 设置图表参数
    setChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById('chart'))
      // console.log(this.chart)

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: this.title
        },
        // 鼠标悬浮在图表节点的提示信息，可以进行详细的额外配置
        // x坐标轴触发提示，放在空白处坐标轴也会有提示
        tooltip: {
          // xaxis yaxis 是直角坐标系中的概念
          trigger: 'axis'
        },
        // 说明；图例
        // 图表展示的类别
        // legend: {
        //   data: ['销量']
        // },
        // 区域缩放
        dataZoom: [{
          show: true,
          height: 30,
          // 如果是 number 表示控制一个轴，如果是 Array 表示控制多个轴。
          // 表示这个 dataZoom 组件控制 第一个 xAxis
          xAxisIndex: [
            0
          ],
          bottom: 30,
          start: 10,
          end: 80,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'

          },
          textStyle: {
            color: '#fff'
          },
          borderColor: '#90979c'
        },
        {
          type: 'inside',
          show: true,
          height: 15,
          // 数据窗口范围的起始百分比
          start: 1,
          // 数据窗口范围的结束百分比
          end: 35
        }],
        // 数据x轴标签
        // x轴是类目轴（离散数据）,必须通过data设置类目数据
        xAxis: {
          type: 'category',
          data: this.xData// -------绑定数据 ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        // y轴是数据轴（连续数据）
        yAxis: {
          type: 'value'
        },
        // 系列列表。每个系列通过 type 决定自己的图表类型
        series: [{
          // 对应legend
        //   name: '销量',

          // 系列中的数据内容数组
          data: this.yData, // -------绑定数据 [820, 932, 901, 934, 1290, 1330, 1320],
          // 折线图
          type: 'line'
        }]
      }

      // 用option来配置chart
      this.chart.setOption(option)
    }
  }
}
</script>
