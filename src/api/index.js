import request from '@/utils/request'

/**
 * 注册接口
 * @param {*} param0 { username: 用户名, password: 密码 }
 * @returns Promise对象
 */
export const registerAPI = ({ username, password, repassword }) => {
  return request({
    url: '/api/reguser',
    method: 'post',
    data: {
      username,
      password,
      repassword
    }
  })
}

/**
 * 登录接口
 * @param {*} param0 { username: 用户名, password: 密码 }
 * @returns Promise对象
 */
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}
// export const loginAPI = ({ username, password }) => {
//   return request({
//     url: '/api/login1',
//     method: 'post',
//     data: {
//       username,
//       password
//     }
//   })
// }
/**
 * 获取-用户基础资料
 * @returns Promise对象
 */
export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo'
  })
}

/**
 * 获取-侧边栏菜单数据
 * @returns Promise对象
 */
export const getMenusAPI = () => {
  return request({
    url: 's/my/menu'
  })
}

/**
 * 更新-用户基本资料
 * @param {*} param0 { id: 用户id, email: 用户邮箱, nickname: 用户昵称, userPic: 用户头像地址, username: 用户名 }
 * @returns Promise对象
 */
export const updateUserInfoAPI = ({ id, email, nickname, userPic, username }) => {
  return request({
    url: '/my/userinfo',
    method: 'POST',
    data: {
      id,
      email,
      nickname,
      userPic,
      username
    }
  })
}

/**
 * 更新-用户头像
 * @param {*} avatar 头像的base64字符串
 * @returns Promise对象
 */
export const updateAvatarAPI = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'POST',
    data: {
      avatar
    }
  })
}

/**
 * 更新-用户密码
 * @param {*} param0 { oldPwd: 旧密码, newPwd: 新密码, rePwd: 新密码确认 }
 * @returns Promise对象
 */
export const updatePwdAPI = ({ oldPwd, newPwd, rePwd }) => {
  return request({
    url: '/my/updatepwd',
    method: 'POST',
    data: {
      oldPwd,
      newPwd,
      rePwd
    }
  })
}

/**
 * 获取-文章分类
 * @returns Promise对象
 */
export const getArtCateListAPI = () => {
  return request({
    url: '/my/article/cates',
    method: 'GET'
  })
}

/**
 * 增加-文章分类
 * @param {*} param0 { name: 文章分类名字, alias: 文章分类别名 }
 * @returns Promise对象
 */
export const addArtCateAPI = ({ name, alias }) => {
  return request({
    url: 'my/article/addcates',
    method: 'POST',
    data: {
      name,
      alias
    }
  })
}

/**
 * 更新-文章分类
 * @param {*} param0 { id: 文章分类id, name: 文章分类名字, alias: 文章分类别名 }
 * @returns Promise对象
 */
export const updateArtCateAPI = ({ Id, name, alias }) => {
  console.log(Id, name, alias)
  return request({
    url: '/my/article/updatecate',
    method: 'POST',
    data: {
      Id,
      name,
      alias
    }
  })
}

/**
 * 删除-文章分类
 * @param {*} id 要删除的-文章分类id
 * @returns Promise对象
 */
export const delArtCateAPI = (id) => {
  return request({
    url: '/my/article/deletecate/' + id,
    method: 'GET'

  })
}

/**
 * 发布文章
 * @param {*} fd 表单对象
 * @returns Promise对象
 */
export const uploadArticleAPI = ({ content, title, cover_img, state, pub_date, cate_id, author_id, id }) => {
  console.log('调用')
  console.log(content, title, state, cover_img, cate_id)
  return request({
    url: '/my/article/add',
    method: 'POST',
    data: {
      title,
      content,
      cover_img,
      pub_date,
      cate_id,
      author_id,
      state
    }

  })
}

/**
 * 获取文章列表
 * @param {*} param0 { pagenum: 当前页码数, pagesize: 当前页条数, id: 文章分类id, state: 文章状态 }
 * @returns Promise对象
 */
export const getArticleListAPI = ({ pagenum, pagesize, cate_id, state, pub_date }) => {
  console.log('get:' + state, cate_id)
  return request({
    url: '/my/article/list',
    method: 'POST',
    data: {
      pagenum,
      pagesize,
      cate_id,
      pub_date,
      state
    }
  })
}

/**
 * 获取-文章详情
 * @param {*} id 文章id
 * @returns Promise对象
 */
export const getArticleDetailAPI = (title) => {
  console.log('title2' + title)
  return request({
    url: '/my/article/list',
    method: 'POST',
    data: {
      title
    }
  })
}

/**
 * 删除-文章
 * @param {*} id 文章id
 * @returns Promise对象
 */
export const delArticleAPI = (title) => {
  return request({
    url: '/my/article/info/' + title,
    method: 'get',
    params: {
      title
    }
  })
}
