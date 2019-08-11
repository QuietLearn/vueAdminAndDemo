<template>
  <div id="aCoursesList" class="bg-fa of">
    <!-- /课程详情 开始 -->
    <section class="container">
      <!-- 课程所属分类 开始 -->
      <section class="path-wrap txtOf hLh30">
        <a href="/" title="" class="c-999 fsize14">首页</a>
        \
        <a :title="data.subjectParentTitle" href="/course" class="c-999 fsize14">{{ data.subjectParentTitle }}</a>
        \
        <a :title="data.subjectTitle" href="/course" class="c-999 fsize14">{{ data.subjectTitle }}</a>
        \
        <span class="c-333 fsize14">{{ data.title }}</span>
      </section>
      <!-- /课程所属分类 结束 -->
      <!-- 课程基本信息 开始 -->
      <div>
        <article class="c-v-pic-wrap" style="height: 357px;">
          <section id="videoPlay" class="p-h-video-box">
            <img :src="data.cover" :alt="data.title " class="dis c-v-pic">
          </section>
        </article>
        <aside class="c-attr-wrap">
          <section class="ml20 mr15">
            <h2 class="hLh30 txtOf mt15">
              <span class="c-fff fsize24">{{ data.title }}</span>
            </h2>
            <section class="c-attr-jg">
              <span class="c-fff">价格：</span>

              <b v-if="Number(data.price) === 0" class="c-yellow" style="font-size:24px;">免费</b>

              <b v-if="Number(data.price) !== 0" class="c-yellow" style="font-size:24px;">￥{{ data.price.toFixed(2) }}</b>
              <!-- {{ Number(data.price) !== 0 ? '¥' + data.price.toFixed(2) : '' }} -->
            </section>

            <section class="c-attr-mt c-attr-undis">
              <span class="c-fff fsize14">主讲： {{ data.teacherName }}&nbsp;&nbsp;&nbsp;
              </span>
            </section>
            <section class="c-attr-mt of">
              <span class="ml10 vam">
                <em class="icon18 scIcon"/>
                <a class="c-fff vam" title="收藏" href="#">收藏</a>
              </span>
            </section>
            <section class="c-attr-mt">
              <a href="#" title="立即观看" class="comm-btn c-btn-3">立即观看</a>
            </section>
          </section>
        </aside>
        <aside class="thr-attr-box">
          <ol class="thr-attr-ol clearfix">
            <li>
              <p>&nbsp;</p>
              <aside>
                <span class="c-fff f-fM">购买数</span><br>
                <h6 class="c-fff f-fM mt10">{{ data.buyCount }}</h6>
              </aside>
            </li>
            <li>
              <p>&nbsp;</p>
              <aside>
                <span class="c-fff f-fM">课时数</span><br>
                <h6 class="c-fff f-fM mt10">{{ data.lessonNum }}</h6>
              </aside>
            </li>
            <li>
              <p>&nbsp;</p>
              <aside>
                <span class="c-fff f-fM">浏览数</span><br>
                <h6 class="c-fff f-fM mt10">{{ data.viewCount }}</h6>
              </aside>
            </li>
          </ol>
        </aside>
        <div class="clear"/>
      </div>
      <!-- /课程基本信息 结束 -->
      <!-- /课程封面介绍 -->
      <div class="mt20 c-infor-box">
        <article class="fl col-7">
          <section class="mr30">
            <div class="i-box">
              <div>
                <section id="c-i-tabTitle" class="c-infor-tabTitle c-tab-title">
                  <a name="c-i" class="current" title="课程详情" href="javascript: void(0)">课程详情</a>
                  <!-- <a name="c-g" title="课程大纲" href="javascript: void(0)">课程大纲</a>
                  <a name="c-c" title="课程评论" href="javascript: void(0)">课程评论</a> -->
                </section>
              </div>
              <article class="ml10 mr10 pt20">
                <!-- 课程详情介绍 开始 -->
                <div>
                  <h6 class="c-i-content c-infor-title">
                    <span>课程介绍</span>
                  </h6>
                  <div class="course-txt-body-wrap">
                    <section class="course-txt-body">
                      <!-- 将内容中的html翻译过来 -->
                      <p v-html="data.description">{{ data.description }}</p>
                      <!-- <p>{{ data.description }}</p> -->
                    </section>
                  </div>
                </div>
                <!-- /课程详情介绍 结束 -->

                <!-- 课程大纲 开始-->
                <div class="mt50">
                  <h6 class="c-g-content c-infor-title">
                    <span>课程大纲</span>
                  </h6>
                  <section class="mt20">
                    <div class="lh-menu-wrap">
                      <menu id="lh-menu" class="lh-menu mt10 mr10">
                        <ul>
                          <!-- 文件目录 -->
                          <li v-for="chapter in data.chapterVoList" :key="chapter.id" class="lh-menu-stair">
                            <a :title="chapter.title" href="javascript: void(0)" class="current-1">
                            <em class="lh-menu-i-1 icon18 mr10"/>{{ chapter.title }}</a>
                            <ol class="lh-menu-ol" style="display: block;">

                              <li v-for="video in chapter.videoVoList" :key="video.id" class="lh-menu-second ml30">
                                <!-- class="current-2" -->
                                <a :title="video.title" :href="'/player/'+video.videoSourceId">
                                  <span v-if="video.free" class="fr">
                                    <i class="free-icon vam mr10">免费试听</i>

                                  </span>
                                <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em>{{ video.title }}</a>
                              </li>

                            </ol>
                          </li>

                        </ul>
                      </menu>
                    </div>
                  </section>
                </div>
                <!-- /课程大纲 结束 -->

                <div class="mt50 commentHtml"><div>
                  <h6 id="i-art-comment" class="c-c-content c-infor-title">
                    <span class="commentTitle">课程评论</span>
                  </h6>
                  <section class="lh-bj-list pr mt20 replyhtml">
                    <ul>
                      <li class="unBr">
                        <aside class="noter-pic">
                          <img width="50" height="50" class="picImg" src="http://127.0.0.1:81/static/inxweb/img/avatar-boy.gif">
                        </aside>
                        <div class="of">
                          <section class="n-reply-wrap">
                            <fieldset>
                              <textarea id="commentContent" name="" placeholder="输入您要评论的文字"/>
                            </fieldset>
                            <p class="of mt5 tar pl10 pr10">
                              <span class="fl "><tt class="c-red commentContentmeg" style="display: none;"/></span>
                              <a href="javascript:addComment();" title="回复" class="lh-reply-btn">回复</a>
                            </p>
                          </section>
                        </div>
                      </li>
                    </ul>
                  </section>
                  <section class="">
                    <section class="question-list lh-bj-list pr">
                      <ul class="pr10">
                        <li>
                          <aside class="noter-pic">
                            <img width="50" height="50" class="picImg" src="http://127.0.0.1:81/images/upload/customer/20150910/1441527777887.jpg">
                          </aside>
                          <div class="of">
                            <span class="fl">
                              <font class="fsize12 c-blue">
                                goddess</font>
                            <font class="fsize12 c-999 ml5">评论：</font></span>
                          </div>
                          <div class="noter-txt mt5">
                            <p>是一种面向对象、解释型计算机程序设计语言，由Guido van Rossum于1989年发明，第一个公开发行版发行于1991年。</p>
                          </div>
                          <div class="of mt5">
                            <span class="fr"><font class="fsize12 c-999 ml5">2015/11/04 11:59</font></span> <span class="fl"> <a class="noter-dy vam" title="回复" href="javascript: void(0)" onclick="queryCommentReply('7')">
                              <em class="icon18">&nbsp;</em>(<span class="replyCount7">1</span>)
                            </a> <tt title="赞一下" class="noter-zan vam ml10" onclick="addPraise('7',4)">
                              <em class="icon18">&nbsp;</em>(<span class="addPraise7_4 praiseCount">0</span>)
                            </tt>
                            </span>
                          </div>
                          <div class="n-reply">
                            <section class="n-reply-wrap">
                              <fieldset>
                                <textarea name="" class="commentReplyMsgContent7"/>
                              </fieldset>
                              <p class="of mt5 tar pl10 pr10">
                                <span class="fl"><tt class="c-red commentReplyMsg7"/></span>
                                <a onclick="addCommentReply('7')" class="lh-reply-btn" title="回复" href="javascript: void(0)">回复</a>
                              </p>
                            </section>
                            <div class="mt10 pl10 pr10 pb10 commentReply7"/>
                          </div> <!-- /回复盒子 -->
                        </li>
                        <li>
                          <aside class="noter-pic">
                            <img width="50" height="50" class="picImg" src="http://127.0.0.1:81/images/upload/customer/20150910/1441527777887.jpg">
                          </aside>
                          <div class="of">
                            <span class="fl">
                              <font class="fsize12 c-blue">
                                goddess</font>
                            <font class="fsize12 c-999 ml5">评论：</font></span>
                          </div>
                          <div class="noter-txt mt5">
                            <p>收藏了</p>
                          </div>
                          <div class="of mt5">
                            <span class="fr"><font class="fsize12 c-999 ml5">2015/11/04 10:32</font></span> <span class="fl"> <a class="noter-dy vam" title="回复" href="javascript: void(0)" onclick="queryCommentReply('2')">
                              <em class="icon18">&nbsp;</em>(<span class="replyCount2">0</span>)
                            </a> <tt title="赞一下" class="noter-zan vam ml10" onclick="addPraise('2',4)">
                              <em class="icon18">&nbsp;</em>(<span class="addPraise2_4 praiseCount">0</span>)
                            </tt>
                            </span>
                          </div>
                          <div class="n-reply">
                            <section class="n-reply-wrap">
                              <fieldset>
                                <textarea name="" class="commentReplyMsgContent2"/>
                              </fieldset>
                              <p class="of mt5 tar pl10 pr10">
                                <span class="fl"><tt class="c-red commentReplyMsg2"/></span>
                                <a onclick="addCommentReply('2')" class="lh-reply-btn" title="回复" href="javascript: void(0)">回复</a>
                              </p>
                            </section>
                            <div class="mt10 pl10 pr10 pb10 commentReply2"/>
                          </div> <!-- /回复盒子 -->
                        </li>
                        <li>
                          <aside class="noter-pic">
                            <img width="50" height="50" class="picImg" src="http://127.0.0.1:81/images/upload/customer/20150910/1441527777887.jpg">
                          </aside>
                          <div class="of">
                            <span class="fl">
                              <font class="fsize12 c-blue">
                                goddess</font>
                            <font class="fsize12 c-999 ml5">评论：</font></span>
                          </div>
                          <div class="noter-txt mt5">
                            <p>讲得很详细</p>
                          </div>
                          <div class="of mt5">
                            <span class="fr"><font class="fsize12 c-999 ml5">2015/11/04 10:32</font></span> <span class="fl"> <a class="noter-dy vam" title="回复" href="javascript: void(0)" onclick="queryCommentReply('1')">
                              <em class="icon18">&nbsp;</em>(<span class="replyCount1">0</span>)
                            </a> <tt title="赞一下" class="noter-zan vam ml10" onclick="addPraise('1',4)">
                              <em class="icon18">&nbsp;</em>(<span class="addPraise1_4 praiseCount">0</span>)
                            </tt>
                            </span>
                          </div>
                          <div class="n-reply">
                            <section class="n-reply-wrap">
                              <fieldset>
                                <textarea name="" class="commentReplyMsgContent1"/>
                              </fieldset>
                              <p class="of mt5 tar pl10 pr10">
                                <span class="fl"><tt class="c-red commentReplyMsg1"/></span>
                                <a onclick="addCommentReply('1')" class="lh-reply-btn" title="回复" href="javascript: void(0)">回复</a>
                              </p>
                            </section>
                            <div class="mt10 pl10 pr10 pb10 commentReply1"/>
                          </div> <!-- /回复盒子 -->
                        </li>
                      </ul>
                    </section>
                  </section>

                  <!-- 公共分页 开始 -->
                  <div class="paging">
                    <a href="javascript:goPageAjax(1);" title="">首</a>
                    <a id="backpage" class="undisable" href="javascript:void(0)" title="">&lt;</a>
                    <a href="javascript:void(0)" title="" class="current undisable">1</a><a id="nextpage" href="javascript:void(0)" title="" class="undisable">&gt;</a>
                    <a href="javascript:goPageAjax(1);" title="">末</a>
                    <div class="clear"/>
                  </div>
                  <!-- 公共分页 结束 -->
                </div>
                </div>

              </article>
            </div>
          </section>
        </article>

        <aside class="fl col-3">
          <div class="i-box">
            <!-- 主讲讲师 开始-->
            <div>
              <section class="c-infor-tabTitle c-tab-title">
                <a title="" href="javascript:void(0)">主讲讲师</a>
              </section>
              <section class="stud-act-list">
                <ul style="height: auto;">
                  <li>
                    <div class="u-face">
                      <a :href="'/teacher/'+data.teacherId" target="_blank">
                        <img :src="data.avatar" width="50" height="50" alt>
                      </a>
                    </div>
                    <section class="hLh30 txtOf">
                      <a :href="'/teacher/'+data.teacherId" class="c-333 fsize16 fl" target="_blank">
                        {{ data.teacherName }}</a>
                    </section>
                    <section class="hLh20 txtOf">
                      <span class="c-999">{{ data.intro }}</span>
                    </section>
                  </li>
                </ul>
              </section>
            </div>
            <!-- /主讲讲师 结束 -->
          </div>

          <div class="i-box mt20">
            <section class="c-infor-tabTitle c-tab-title">
              <a href="" title="">学过此课的人（4）</a>
            </section>
            <section class="buy-cin-list">
              <span title="Helen">
                <img alt="" src="photo/customer/01.jpg">
                <tt class="c-999">Helen</tt>
              </span>
              <span title="goddess">
                <img alt="" src="photo/customer/02.jpg">
                <tt class="c-999">goddess</tt>
              </span>
              <span title="qwe@qwe.com">
                <img alt="" src="photo/customer/avatar-boy.gif">
                <tt class="c-999">qwe@qwe.com</tt>
              </span>
              <span title="exmail@qq.com">
                <img src="/assets/photo/customer/avatar-boy.gif" alt="">
                <tt class="c-999">exmail@qq.com</tt>
              </span>
            </section>
          </div>

        </aside>
        <div class="clear"/>
      </div>
    </section>
    <!-- /课程详情 结束 -->
  </div>
</template>

<script>
import axios from 'axios'

export default {

  asyncData({ params, error }) {
    return axios.get('http://localhost:8210/edu/course/' + params.courseid).then(
      response => {
        console.log(response.data.data.item)
        return {
          data: response.data.data
        }
      }
    )
  }
}
</script>
