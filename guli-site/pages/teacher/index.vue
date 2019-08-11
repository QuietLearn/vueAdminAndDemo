<!--必须要有模板让页面渲染出来-->
<template>
  <div id="aCoursesList" class="bg-fa of">
    <!-- 讲师列表 开始 -->
    <section class="container">
      <section class="c-sort-box unBr">
        <div>
          <!-- /无数据提示 开始-->
          <section v-if="data.total==0" class="no-data-wrap">
            <em class="icon30 no-data-ico">&nbsp;</em>
            <span class="c-666 fsize14 ml10 vam">没有相关数据，小编正在努力整理中...</span>
          </section>
          <!-- /无数据提示 结束-->

          <!-- /数据列表 开始-->
          <article v-if="data.total>0" class="i-teacher-list">
            <ul class="of">
              <!-- 索引会经常变化，在增删改查的过程中索引会变，所以给一个决定唯一的key -->
              <li v-for="item in data.items" :key="item.id">
                <section class="i-teach-wrap">
                  <div class="i-teach-pic">
                    <a :href="'/teacher/'+item.id" :title="item.name">
                      <img :src="item.avatar" :alt="item.name" height="142" hright="142">
                    </a>
                  </div>
                  <div class="mt10 hLh30 txtOf tac">
                    <a :href="'/teacher/'+item.id" :title="item.name" class="fsize18 c-666">{{ item.name }}</a>
                  </div>
                  <div class="hLh30 txtOf tac">
                    <span class="fsize14 c-999" >{{ item.career }}</span>
                  </div>
                  <div class="mt15 i-q-txt">
                    <p class="c-999 f-fA">{{ item.intro }}</p>
                  </div>
                </section>
              </li>
            </ul>
            <div class="clear"/>
          </article>
          <!-- /数据列表 结束-->
        </div>
        <!-- 公共分页 开始 -->
        <div>
          <div class="paging">
            <!-- undisable这个class是否存在，取决于数据属性hasPrevious -->
            <a
              :class="{undisable: !data.hasPrevious}"
              href="#"
              title="首页"
              @click.prevent="gotoPage(1)">首</a>
            <a
              :class="{undisable: !data.hasPrevious}"
              href="#"
              title="前一页"
              @click.prevent="gotoPage(data.current-1)">&lt;</a>
            <a
              v-for="page in data.pages"
              :key="page"
              :class="{current: data.current == page, undisable: data.current == page}"
              :title="'第'+page+'页'"
              href="#"
              @click.prevent="gotoPage(page)">{{ page }}</a>
            <a
              :class="{undisable: !data.hasNext}"
              href="#"
              title="后一页"
              @click.prevent="gotoPage(data.current+1)">&gt;</a>
            <a
              :class="{undisable: !data.hasNext}"
              href="#"
              title="末页"
              @click.prevent="gotoPage(data.pages)">末</a>
            <div class="clear"/>
          </div>
        </div>
        <!-- 公共分页 结束 -->
      </section>
    </section>
    <!-- /讲师列表 结束 -->
  </div>
</template>

<script>
// import axios from 'axios'
import teacher from '@/api/edu/teacher'
export default {

// 对象的结构赋值
// 从路由对象中拿到params和error
// 前端高级知识：闭包
// 动态数据获取，进行服务器端页面渲染然后返回给浏览器
// 也是data数据，类似data和props，只不过是向后台发送ajax请求动态获取出来的数据
// 先拿先组装，先拿数据，再加载页面（即拿数据开始渲染页面然后返回给浏览器显示，），
  // asyncData({ params, error }) {
  //   // 服务器端获取到数据后会把结果反馈给前端服务器，前端服务器渲染完之后再给浏览器
  //   return axios.get('http://localhost:8210/edu/teacher').then(
  //     response => {
  //       console.log(response.data.data.items)
  //       return {
  //         // 当数据绑定用，给vue提前渲染页面使用
  //         // 页面中可以绑定的数据，就是数据
  //         items: response.data.data.items
  //       }
  //     }
  //   )
  // }

  asyncData({ params, error }) {
    return teacher.getPageList(1, 8).then(response => {
      console.log(response.data.data)
      return { data: response.data.data }
    })
  },

  methods: {
    gotoPage(page) {
      teacher.getPageList(page, 8).then(response => {
        this.data = response.data.data
      })
    }
  }

}
</script>

