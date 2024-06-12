<template>
  <div class="wscn-http404-container">
    <!-- 404 错误页面主体容器 -->
    <div class="wscn-http404">
      <!-- 404 错误页面的图片部分 -->
      <div class="pic-404">
        <!-- 主要的 404 错误图片 -->
        <img alt="404" class="pic-404__parent" src="@/assets/404_images/404.png">
        <!-- 左侧的云朵装饰图片 -->
        <img alt="404" class="pic-404__child left" src="@/assets/404_images/404_cloud.png">
        <!-- 中间的云朵装饰图片 -->
        <img alt="404" class="pic-404__child mid" src="@/assets/404_images/404_cloud.png">
        <!-- 右侧的云朵装饰图片 -->
        <img alt="404" class="pic-404__child right" src="@/assets/404_images/404_cloud.png">
      </div>
      <!-- 404 错误页面的文字信息部分 -->
      <div class="bullshit">
        <!-- 显示"OOPS!"的标题 -->
        <div class="bullshit__oops">OOPS!</div>
        <!-- 网站版权信息 -->
        <div class="bullshit__info">All rights reserved
          <a href="https://wallstreetcn.com" style="color:#20a0ff" target="_blank">wallstreetcn</a>
        </div>
        <!-- 自定义的错误信息，通过 message 属性传递 -->
        <div class="bullshit__headline">{{ message }}</div>
        <!-- 提示用户检查 URL 或返回首页的说明 -->
        <div class="bullshit__info">Please check that the URL you entered is correct, or click the button below to
          return to the homepage.
        </div>
        <!-- 返回首页的链接 -->
        <a class="bullshit__return-home" href="">Back to home</a>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 页面 404 组件
 * 该组件用于显示一个友好的 404 错误页面，告知用户请求的页面不存在。
 */
export default {
  name: 'Page404', // 定义组件名称
  computed: {
    /**
     * 计算属性：错误信息
     * 用于生成显示给用户的错误信息。
     * @returns {string} 返回一个描述用户请求的页面不存在的字符串。
     */
    message() {
      return '站长说你不能进入这个页面……'
    }
  }
}
</script>

<style lang="scss" scoped>
.wscn-http404-container {
  transform: translate(-50%, -50%);
  position: absolute;
  top: 40%;
  left: 50%;
}

.wscn-http404 {
  position: relative;
  width: 1200px;
  padding: 0 50px;
  overflow: hidden;

  .pic-404 {
    position: relative;
    float: left;
    width: 600px;
    overflow: hidden;

    &__parent {
      width: 100%;
    }

    &__child {
      position: absolute;

      &.left {
        width: 80px;
        top: 17px;
        left: 220px;
        opacity: 0;
        animation-name: cloudLeft;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }

      &.mid {
        width: 46px;
        top: 10px;
        left: 420px;
        opacity: 0;
        animation-name: cloudMid;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1.2s;
      }

      &.right {
        width: 62px;
        top: 100px;
        left: 500px;
        opacity: 0;
        animation-name: cloudRight;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }

      @keyframes cloudLeft {
        0% {
          top: 17px;
          left: 220px;
          opacity: 0;
        }
        20% {
          top: 33px;
          left: 188px;
          opacity: 1;
        }
        80% {
          top: 81px;
          left: 92px;
          opacity: 1;
        }
        100% {
          top: 97px;
          left: 60px;
          opacity: 0;
        }
      }
      @keyframes cloudMid {
        0% {
          top: 10px;
          left: 420px;
          opacity: 0;
        }
        20% {
          top: 40px;
          left: 360px;
          opacity: 1;
        }
        70% {
          top: 130px;
          left: 180px;
          opacity: 1;
        }
        100% {
          top: 160px;
          left: 120px;
          opacity: 0;
        }
      }
      @keyframes cloudRight {
        0% {
          top: 100px;
          left: 500px;
          opacity: 0;
        }
        20% {
          top: 120px;
          left: 460px;
          opacity: 1;
        }
        80% {
          top: 180px;
          left: 340px;
          opacity: 1;
        }
        100% {
          top: 200px;
          left: 300px;
          opacity: 0;
        }
      }
    }
  }

  .bullshit {
    position: relative;
    float: left;
    width: 300px;
    padding: 30px 0;
    overflow: hidden;

    &__oops {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      color: #1482f0;
      opacity: 0;
      margin-bottom: 20px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }

    &__headline {
      font-size: 20px;
      line-height: 24px;
      color: #222;
      font-weight: bold;
      opacity: 0;
      margin-bottom: 10px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }

    &__info {
      font-size: 13px;
      line-height: 21px;
      color: grey;
      opacity: 0;
      margin-bottom: 30px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }

    &__return-home {
      display: block;
      float: left;
      width: 110px;
      height: 36px;
      background: #1482f0;
      border-radius: 100px;
      text-align: center;
      color: #ffffff;
      opacity: 0;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
    }

    @keyframes slideUp {
      0% {
        transform: translateY(60px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
}
</style>
