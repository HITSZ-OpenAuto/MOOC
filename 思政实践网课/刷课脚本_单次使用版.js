(function(){
  // 获取当前视频信息
  const videoElement = document.getElementById('video-active');
  if (!videoElement) {
    alert('未找到视频元素，请确保您在视频播放页面');
    return;
  }
  
  // 获取课程ID和其他必要参数
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('id');
  
  if (!courseId) {
    alert('无法获取课程ID，请确保URL中包含id参数');
    return;
  }
  
  // 构建请求数据
  const data = {
    course_id: courseId,
    chapter_id: "0",  // 根据代码注释，没有章节时为0
    section_id: "0",  // 根据代码注释，没有节时为0
    current_time: videoElement.duration,  // 设置为视频总时长
    duration: videoElement.duration,
    state: 1  // 1表示已完成
  };
  
  // 发送请求标记为已完成
  $.ajax({
    url: "practice/saveUserCourseRecord",
    type: 'post',
    dataType: 'json',
    async: false,
    data: data,
    success: function(response) {
      alert('成功标记视频为已完成！');
      
      // 尝试查找并点击下一个视频链接
      const currentId = courseId;
      const courseLinks = Array.from(document.querySelectorAll('a[href*="coursedetail.html"]'));
      let foundCurrent = false;
      
      for (const link of courseLinks) {
        const linkId = new URLSearchParams(new URL(link.href, window.location.origin).search).get('id');
        
        if (linkId === currentId) {
          foundCurrent = true;
          continue;
        }
        
        if (foundCurrent) {
          alert('正在切换到下一个视频...');
          link.click();
          return;
        }
      }
      
      alert('已完成当前视频，但未找到下一个视频链接');
    },
    error: function(error) {
      alert('标记失败，错误信息: ' + JSON.stringify(error));
    }
  });
})();