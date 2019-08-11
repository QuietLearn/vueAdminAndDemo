import request from '@/utils/request'
const api_name = '/edu/course'
export default {
  // , courseQuery
  getPageList(page, limit, courseQuery) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: courseQuery
    })
  },

  getCourseDetail(courseId) {
    return request({
      url: `${api_name}/${courseId}`,
      method: 'get'
    })
  }
}
