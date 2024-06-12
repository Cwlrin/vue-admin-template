<template>
  <el-upload
    :before-upload="beforeAvatarUpload"
    :http-request="uploadImage"
    :show-file-list="false"
    action=""
    class="avatar-uploader"
  >
    <!-- (自动上传)action 是上传地址 人资项目不需要 人资项目 (手动上传)  -->
    <!-- show-file-list 不展示列表 -->
    <img v-if="value" :src="value" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>
import COS from 'cos-js-sdk-v5'

/**
 * 用户头像上传组件。
 * 该组件使用 Element UI 的 el-upload 组件实现用户头像的上传功能。
 * 上传的文件类型必须是 JPG、PNG、GIF 或 BMP，且文件大小不能超过 5MB。
 * 上传的文件会通过腾讯云 COS 服务进行存储，并获取到文件的地址用于后续展示用户头像。
 */
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    /**
     * 在上传文件之前执行的检查函数。
     * 该函数用于验证即将上传的文件是否符合要求，包括文件类型和文件大小的检查。
     * @param {Object} file 待上传的文件对象。
     * @returns {Boolean} 如果文件符合要求，返回 true 允许上传；否则返回 false 中止上传。
     */
    beforeAvatarUpload(file) {
      const isJPG = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 5 // 5M
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG PNG GIF BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isJPG && isLt2M
    },
    /**
     * 自定义上传逻辑的函数。
     * 该函数负责将文件上传到腾讯云 COS，并在上传成功后触发 input 事件，将文件地址传递出去。
     * @param {Object} params 上传参数，包含待上传的文件对象。
     */
    uploadImage(params) {
      const cos = new COS({
        SecretId: 'AKID2we9RVMn12pPlupNsBNOExZ66vXxAVrA',
        SecretKey: 'GLEwVt8ECzeBZu56yiJm399xcEi1CE7q'
      }) // 完成 cos 对象的初始化
      cos.putObject({
        Bucket: 'cwlrin-1301346590', // 存储桶名称
        Region: 'ap-beijing', // 地域名称
        Key: params.file.name, // 文件名称
        StorageClass: 'STANDARD', // 固定值
        Body: params.file // 文件对象
      }, (err, data) => {
        if (data.statusCode === 200 && data.Location) {
          // 拿到了腾讯云返回的地址
          // 通过 input 自定义事件将地址传出去
          this.$emit('input', 'http://' + data.Location) // 将地址返回了
        } else {
          this.$message.error(err.Message) // 上传失败提示消息
        }
      })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
