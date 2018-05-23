class FileUploadSchedule {
  constructor(options) {
    this.MAX_UPLOADING_COUNT = 5;
    // 已选文件列表
    this.selectedFiles = [];
    // 上传成功文件列表
    this.successFiles = [];
    // 上传失败文件列表
    this.failedFiles = [];
    if (options) {
      this.accept = options.accept;
      this.multiple = options.multiple;
    }
  }
  select() {
    const _this = this;
    return new Promise((resolve, reject) => {
      try {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        // 设置文件类型
        if (_this.accept) {
          input.setAttribute('accept', _this.accept);
        }
        if (_this.multiple) {
          input.setAttribute('multiple', true);
        }
        input.onchange = function () {
          _this.selectedFiles = Array.from(input.files);
          resolve();
        }
        input.click();
      } catch (e) {
        reject(e);
      }
    });
  }
  upload() {
    console.warn('请重写上传的方法,接受三个参数:file、successCb、failCb,然后调用 startUpload');
  }
  // 开始上传文件
  startUpload() {
    return new Promise((resolve, reject) => {
      const _this = this;
      let upload_count = 0;

      // 任务调度函数，主要用来判断是否可以执行任务，以及任务执行情况
      function _uploadSchedule() {
        if (upload_count < _this.MAX_UPLOADING_COUNT) {
          // 当前可以执行任务，判断是否还有待执行的任务
          if (_this.selectedFiles.length > 0) {
            // 还有任务
            // 任务数量+1
            upload_count += 1;
            // 取出第一个任务
            const _file = _this.selectedFiles.shift();
            // 执行上传
            _this.upload(_file, function (result) {
              _this.successFiles.push(result);
              upload_count -= 1;
              // 上传成功继续任务
              _uploadSchedule();
            }, function (err) {
              console.error('upload faild ', err);
              _this.failedFiles.push(_file);
              upload_count -= 1;
              // 上传失败，任然继续任务
              _uploadSchedule();
            });
          } else {
            // 没有任务了，判断是否有正在执行的任务，如果没有了，则说明全部执行完毕
            if (upload_count === 0) {
              const result = {
                success: [].concat(_this.successFiles),
                fail: [].concat(_this.failedFiles)
              };
              // 清空所有任务数据
              _this.selectedFiles.length = 0;
              _this.successFiles.length = 0;
              _this.failedFiles.length = 0;
              resolve(result);
            }
          }
        } else {
          // 任务数量超过最大值，不允许执行，需要等待当前任务执行完毕唤起执行
          console.warn('任务数量超过最大值，不允许执行，需要等待当前任务执行完毕唤起执行');
        }
      }
      // 开始执行任务调度
      _uploadSchedule();
    });
  }
}
export default function (cfg) {
  return new FileUploadSchedule(cfg);
};
// 打包的需要挂载到window上
if (process.env.NODE_ENV === 'production') {
  window.FileUploadSchedule = FileUploadSchedule;
}