# FileUploadSchedule

> 文件上传调度

# 配置

| 配置项   | 描述           | 默认值 |
| -------- | -------------- | ------ |
| accept   | 允许的文件类型 | all    |
| multiple | 是否支持多选   | false  |

# 使用

``` javascript
import fileUploadSchedule from 'FileUploadSchedule'
```

或

```html
<script src="./FileUploadSchedule.min.js"></script>
<script>
  fileUploadSchedule = new FileUploadSchedule();
</script>
```

然后 定义upload方法

```javascript
// file  当前待上传的文件
// success 上传成功回调传入服务器返回值，最终会统一返回
// 上传失败回调
fileUploadSchedule.upload=function(file,success,fail){}
```

调用文件选择```select```和上传```startUpload```方法

``` javascript
fileuploadSchedule.select().then(function () {
        return fileuploadSchedule.startUpload();
      }).then(function (data) {
        console.log('upload success', data);
      }).catch(function (err) {
        console.error(err);
      });
```
[查看实例](./index.html)