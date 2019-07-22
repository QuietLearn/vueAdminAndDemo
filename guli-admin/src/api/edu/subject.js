import request from '@/utils/request'

const api_name = '/admin/edu/subject'

export default {
  getNestedTreeList() {
    return request({
      url: `${api_name}/list`,
      method: 'get'
    })
  }
}
