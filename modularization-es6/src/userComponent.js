//只取需要的方法即可，多个方法用逗号分隔
//这时的程序无法运行的，因为ES6的模块化无法在Node.js中执行，需要用Babel编辑成ES5后再执行。
import { getList, save } from './userApi.js'

getList()
save()