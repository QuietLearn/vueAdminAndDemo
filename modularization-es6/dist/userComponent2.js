"use strict";

var _userApi = require("./userApi2.js");

var _userApi2 = _interopRequireDefault(_userApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_userApi2.default.getList(); //只取需要的方法即可，多个方法用逗号分隔
//这时的程序无法运行的，因为ES6的模块化无法在Node.js中执行，需要用Babel编辑成ES5后再执行。
//import { getList, save } from './userApi.js'
//getList()
//save()

_userApi2.default.save();