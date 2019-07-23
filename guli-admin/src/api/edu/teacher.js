import request from '@/utils/request'

const api_name = '/admin/edu/teacher'

export default {
  getList() {
    return request({
      url: api_name,
      method: 'get'
    })
  },

  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },

  deleteTeacherById(teacherId) {
    return request({
      url: `${api_name}/${teacherId}`,
      method: 'delete'

    })
  },

  save(teacher) {
    return request({
      url: `${api_name}`,
      method: 'post',
      data: teacher
    })
  },

  getById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  },

  updateById(teacher) {
    return request({
      url: `${api_name}/${teacher.id}`,
      method: 'put',
      data: teacher
    })
  }
}
