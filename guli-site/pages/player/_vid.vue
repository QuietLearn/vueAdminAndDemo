<template>
  <div>

    <!-- 把脚本粘进来 -->
    <!-- 脚本组件在这里就会被初始化出来，为什么不粘在入口页，因为没有；而且不想富文本那样提供了vue和其整合的脚本从而实现组件化 -->
    <!-- 阿里云视频播放器样式 -->
    <!-- 新的脚本用旧代码会出错 -->
    <link rel="stylesheet" href="https://g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css" >
    <!-- 启用私有加密的防调式：生产环境使用 -->
    <!-- 防止恶意用户在浏览器端调试脚本获取关键信息 -->
    <script src="https://g.alicdn.com/de/prismplayer/2.8.0/hls/aliplayer-vod-anti-min.js" />
    <!-- 阿里云视频播放器脚本 -->
    <script charset="utf-8" type="text/javascript" src="https://g.alicdn.com/de/prismplayer/2.8.2/aliplayer-min.js" />

    <!-- 阿里云视频播放器组件 -->
    <script type="text/javascript" charset="utf-8" src="https://player.alicdn.com/aliplayer/presentation/js/aliplayercomponents.min.js"/>

    <!-- 定义播放器dom  div id的定义就可以使用上面的组件了-->
    <div id="J_prismPlayer" class="prism-player" />
  </div>
</template>

<script>
import vod from '@/api/vod/vod'
export default {

  layout: 'video', // 应用video布局

  asyncData({ params, error }) {
    return vod.getPlayAuth(params.vid).then(response => {
      console.log(response.data.data)
      return {
        vid: params.vid,
        playAuth: response.data.data.playAuth
        // danmukuList 组件写this.danmukuList从绑定数据里取
      }
    })
  },

  /**
 * 页面渲染完成时：此时js脚本已加载，Aliplayer已定义，可以使用
 * 如果在created生命周期函数中使用，会报告Aliplayer is not defined错误
 */
  mounted() {
    /* eslint-disable no-undef */
    /* 关闭广告的自定义事件, 可自行修改代码从而满足不同的功能, 参数为视频广告组件本身 */
    // videoAd 广告本身
    var videoAdClose = function(videoAd) {
    /* 调用视频广告组件的暂停事件来暂停广告 */
      videoAd.pauseVideoAd()
      var result = confirm('确定开通会员关闭广告吗？')
      if (result) {
        /* 调用视频广告组件关闭事件来关闭广告 */
        videoAd.closeVideoAd()
        // 正常情况跳转到开通会员页
      } else {
        /* 调用视频广告组件的播放事件来播放广告 */
        videoAd.playVideoAd()
      }
    }
    /* 弹幕组件集成了 CommentCoreLibrary 框架, 更多 Api 请查看文档 https://github.com/jabbany/CommentCoreLibrary/ */
    // 当你发送1条弹幕时就会在这个列表动态插入一个弹幕对象，同时javascript每隔一段时间向后台发送一个请求将新增的弹幕数据保存到数据库
    var danmukuList = [{
      // 新版本扩展字段，default 1
      'mode': 1,
      'text': '哈哈',
      // 在视频的什么时间出现
      'stime': 1000,
      // 弹幕文字大小
      'size': 25,
      // 弹幕颜色
      'color': 0xffffff
    }, {
      'mode': 1,
      'text': '前方高能',
      'stime': 2000,
      'size': 25,
      'color': 0xff0000
    }, {
      'mode': 1,
      'text': '灵魂歌手',
      'stime': 30000,
      'size': 25,
      'color': 0xff0000
    }, {
      'mode': 1,
      'text': '这是弹幕2',
      'stime': 4000,
      'size': 25,
      'color': 0x00c1de
    }, {
      'mode': 1,
      'text': '神测试',
      'stime': 5000,
      'size': 25,
      'color': 0x00c1de
    }, {
      'mode': 1,
      'text': '顺手一划',
      'stime': 10000,
      'size': 25,
      'color': 0x00c1de
    }, {
      'mode': 1,
      'text': '哈哈',
      'stime': 1000,
      'size': 25,
      'color': 0xffffff
    }]

    const player = new Aliplayer({
      id: 'J_prismPlayer',
      vid: this.vid, // 视频id
      playauth: this.playAuth, // 播放凭证
      encryptType: '1', // 如果播放加密视频，则需设置encryptType=1，非加密视频无需设置此项
      width: '100%',
      height: '500px',
      // components可以现在外面配置，然后动态组装里面的组件数据，开通会员这个对象就不组装了
      components: [{
        name: 'BulletScreenComponent', // 跑马灯组件
        type: AliPlayerComponent.BulletScreenComponent,
        /** 跑马灯组件三个参数 text, style, bulletPosition
       * text: 跑马灯文字内容
       * style: 跑马灯样式
       * bulletPosition: 跑马灯位置, 可选的值为 'top' (顶部), 'bottom' (底部), 'random' (随机), 不传值默认为 'random'
       */
        args: ['欢迎来到谷粒学院', { fontSize: '16px', color: '#00c1de' }, 'random']
      }, {
        name: 'VideoADComponent', // 视频广告组件
        type: AliPlayerComponent.VideoADComponent,
        /* 视频广告四个参数 adVideoSource, adLink, adCloseFunction, closeText
       * adVideoSource {@String 广告视频的视频地址 必须参数}
       * adLink {@String 广告视频的链接地址 必须参数}
       * adCloseFunction {@Function 关闭广告的点击事件处理函数, 可选参数, 不传则默认关闭广告视频}
       * closeText {@String 关闭广告的文字内容, 可选参数, 不传则默认为 '关闭广告'}
       */
        args: ['http://player.alicdn.com/ad/citybrain.mp4', 'https://et.aliyun.com/brain/city', videoAdClose, 'VIP关闭广告']
      }, {
        name: 'AliplayerDanmuComponent', // 弹幕组件
        type: AliPlayerComponent.AliplayerDanmuComponent,
        // 可以从后端数据库中取出来，专门建一个弹幕表，弹幕信息存到里面
        args: [danmukuList]
      }],

      // 内部的跨域设置
      'extraInfo': {
        'crossOrigin': 'anonymous'
      },
      /* 重新定义按钮位置*/
      'skinLayout': [
        // 大的播放按钮
        { 'name': 'bigPlayButton', 'align': 'blabs', 'x': 30, 'y': 80 },
        // H5Loading标签
        { 'name': 'H5Loading', 'align': 'cc' },
        // 错误播放显示信息的位置
        { 'name': 'errorDisplay', 'align': 'tlabs', 'x': 0, 'y': 0 },
        // 播放显示信息
        { 'name': 'infoDisplay' },
        { 'name': 'tooltip', 'align': 'blabs', 'x': 0, 'y': 56 },
        { 'name': 'thumbnail' },
        {
          'name': 'controlBar', 'align': 'blabs', 'x': 0, 'y': 0,
          // 子按钮
          'children': [
            { 'name': 'progress', 'align': 'blabs', 'x': 0, 'y': 44 },
            // 播放按钮
            { 'name': 'playButton', 'align': 'tl', 'x': 15, 'y': 12 },
            // 时间显示
            { 'name': 'timeDisplay', 'align': 'tl', 'x': 10, 'y': 7 },
            // 全屏播放按钮   x,y 离播放进度条距离的这么一个位置
            { 'name': 'fullScreenButton', 'align': 'tr', 'x': 10, 'y': 12 },
            { 'name': 'subtitle', 'align': 'tr', 'x': 15, 'y': 12 },
            { 'name': 'setting', 'align': 'tr', 'x': 15, 'y': 12 },
            { 'name': 'volume', 'align': 'tr', 'x': 5, 'y': 10 },
            { 'name': 'snapshot', 'align': 'tr', 'x': 10, 'y': 12 }
          ]
        }
      ]
    }, function(player) {
      console.log('播放器创建成功')
    })

    /* h5截图按钮, 截图成功回调 */
    // 给内置的snapshoted按钮添加一个事件
    // js实现截图的代码
    player.on('snapshoted', function(data) {
      var pictureData = data.paramData.base64
      var downloadElement = document.createElement('a')
      downloadElement.setAttribute('href', pictureData)
      var fileName = 'Aliplayer' + Date.now() + '.png'
      downloadElement.setAttribute('download', fileName)
      downloadElement.click()
      pictureData = null
    })
  }
}

</script>
