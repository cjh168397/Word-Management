<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select
              v-model="q.cate_id"
              placeholder="请选择分类"
              size="small"
            >
              <!-- 循环渲染分类的可选项 -->
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in cateList"
                :key="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="initArtListFn"
              >筛选</el-button
            >
            <el-button type="info" size="small" @click="resetListFn"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button
          type="primary"
          size="small"
          class="btn-pub"
          @click="showPubDialogFn"
          >发表文章</el-button
        >
      </div>

      <!-- 文章表格区域 -->
      <el-table :data="artList" style="width: 100%" border stripe>
        <el-table-column label="文章标题">
          <template v-slot="{ row }">
            <el-link type="primary" @click="showDetailFn(row.title)">
              {{ row.title }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date">
          <template v-slot="{ row }">
            <span>{{ $formatDate(row.pub_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="danger" size="mini" @click="removeFn(row.title)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChangeFn"
        @current-change="handleCurrentChangeFn"
        :current-page.sync="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size.sync="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 发表文章的 Dialog 对话框 -->
      <el-dialog
        title="发表文章"
        :visible.sync="pubDialogVisible"
        fullscreen
        :before-close="handleClose"
        @closed="onDialogClosedFn"
      >
        <!-- 发布文章的对话框 -->
        <el-form
          :model="pubForm"
          :rules="pubFormRules"
          ref="pubFormRef"
          label-width="100px"
        >
          <el-form-item label="文章标题" prop="title">
            <el-input
              v-model="pubForm.title"
              placeholder="请输入标题"
            ></el-input>
          </el-form-item>
          <el-form-item label="文章分类" prop="cate_id">
            <el-select
              v-model="pubForm.cate_id"
              placeholder="请选择分类"
              style="width: 100%"
            >
              <!-- 循环渲染分类的可选项 -->
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in cateList"
                :key="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文章内容" prop="content">
            <!-- 使用 v-model 进行双向的数据绑定 -->
            <quill-editor v-model="pubForm.content"></quill-editor>
          </el-form-item>
          <el-form-item label="文章封面">
            <!-- 用来显示封面的图片 -->
            <img
              src="../../assets/images/cover.jpg"
              alt=""
              class="cover-img"
              ref="imgRef"
            />
            <br />
            <!-- 文件选择框，默认被隐藏 -->
            <input
              type="file"
              style="display: none"
              accept="image/*"
              ref="iptFileRef"
              @change="onCoverChangeFn"
            />
            <!-- 选择封面的按钮 -->
            <el-button type="text" @click="chooseImgFn">+ 选择封面</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="pubArticleFn('已发布')"
              >发布</el-button
            >
            <el-button type="info" @click="pubArticleFn('草稿')"
              >存为草稿</el-button
            >
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 查看文章详情的对话框 -->
      <!-- 查看文章详情的对话框 -->
      <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
        <h1 class="title">{{ title }}</h1>

        <div class="info">
          <span>作者：{{ nickname || username }}</span>
          <span>发布时间：{{ $formatDate(pub_date) }}</span>
          <span>所属分类：{{ name }}</span>
          <span>状态：{{ state }}</span>
        </div>

        <!-- 分割线 -->
        <el-divider></el-divider>

        <!-- 文章的封面 -->
        <img
          :src="img"
          alt=""
        />
        <!-- 文章的详情 -->
        <div v-html="content" class="detail-box"></div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getArtCateListAPI,
  uploadArticleAPI,
  getArticleListAPI,
  getArticleDetailAPI,
  delArticleAPI
} from '@/api'
import { baseURL } from '@/utils/request'
// 导入默认的封面图片
import defaultImg from '@/assets/images/cover.jpg'
export default {
  name: 'ArtList',
  data () {
    return {
      name: '',
      title: '',
      content: '',
      state: '',
      img: '',
      nickname: '',
      username: ' ',
      pub_date: ' ',
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        id: '',
        cate_id: '',
        state: ''
      },
      pubDialogVisible: false, // 控制发表文章对话框的显示与隐藏
      pubForm: {
        // 表单的数据对象
        title: '',
        pub_date: '2022-11-06 15:03:03',
        cate_id: '1',
        author_id: '4',
        id: '',
        content: '', // 文章内容
        cover_img: null, // 用户选择的封面图片（null 表示没有选择任何封面）
        state: '' // 文章的发布状态，可选值有两个：草稿、已发布
      },
      pubFormRules: {
        // 表单的验证规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 1,
            max: 30,
            message: '文章标题的长度为1-30个字符',
            trigger: 'blur'
          }
        ],
        id: [
          { required: true, message: '请选择文章标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      },
      cateList: [], // 文章分类列表
      artList: [], // 文章的列表数据
      total: 0, // 总数据条数
      detailVisible: false, // 控制文章详情对话框的显示与隐藏
      artDetail: {}, // 文章的详情信息对象
      baseURL // 基地址
    }
  },
  created () {
    // 获取-文章分类列表
    this.initCateList()
    // 获取-文章列表
    this.initArtListFn()
  },
  methods: {
    getDateInfo (timeStamp) {
      const date = timeStamp ? new Date(timeStamp) : new Date()
      const y = date.getFullYear()
      const m = date.getMonth() + 1
      const d = date.getDate()
      const time = y + '-' + m + '-' + d
      return time
    },
    // 发表文章按钮->点击事件->让添加文章对话框出现
    showPubDialogFn () {
      this.pubDialogVisible = true
    },
    // 对话框关闭前的回调
    async handleClose (done) {
      // 询问用户是否确认关闭对话框
      const confirmResult = await this.$confirm(
        '此操作将导致文章信息丢失, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)

      // 取消了关闭-阻止住, 什么都不干
      if (confirmResult === 'cancel') return
      // 确认关闭
      done()
    },
    // 初始化文章分类的列表数据
    async initCateList () {
      console.log('date：' + this.getDateInfo())
      const { data: res } = await getArtCateListAPI()
      console.log('+++++++')
      console.log(res.status)
      if (res.status === 0) {
        this.cateList = res.data
        this.pubForm.cate_id = this.cateList.id
      }
    },
    // 选择封面按钮->点击事件->让文件选择窗口出现
    chooseImgFn () {
      this.$refs.iptFileRef.click()
    },
    // 封面选择改变的事件
    onCoverChangeFn (e) {
      // 获取用户选择的文件列表
      const files = e.target.files
      if (files.length === 0) {
        // 用户没有选择封面
        this.pubForm.cover_img = null
        this.$refs.imgRef.setAttribute('src', defaultImg)
      } else {
        // 1. 创建 FileReader 对象
        const fr = new FileReader()
        // 2. 调用 readAsDataURL 函数，读取文件内容
        fr.readAsDataURL(files[0])
        // 3. 监听 fr 的 onload 事件
        fr.onload = (e) => {
          // 4. 通过 e.target.result 获取到读取的结果，值是字符串（base64 格式的字符串）
          this.pubForm.cover_img = e.target.result
          const url = URL.createObjectURL(files[0])
          this.$refs.imgRef.setAttribute('src', url)
          console.log('-------')
          console.log(this.pubForm.cover_img)
        }
        // 使用URL.createObjURL()来转换文件变成图片地址(纯前端本地)
        // this.avatar = URL.createObjectURL(files[0])
      }
    },
    // 发布文章或草稿-按钮点击事件
    pubArticleFn (state) {
      // 1. 设置发布状态
      this.pubForm.state = state

      // 2. 表单预校验
      this.$refs.pubFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请完善文章信息！')
        // 3. 判断是否提供了文章封面
        if (!this.pubForm.cover_img) {
          return this.$message.error('请选择文章封面！')
        }
        // 4. TODO：发布文章
        // 创建 FormData 对象
        const fd = new FormData()

        // 向 FormData 中追加数据
        Object.keys(this.pubForm).forEach((key) => {
          console.log(key + '：' + this.pubForm[key])
          fd.append(key, this.pubForm[key])
          console.log(fd.get(key))
        })
        this.pubForm.pub_date = this.getDateInfo()
        // 发起请求
        console.log('请求')
        const { data: res } = await uploadArticleAPI(this.pubForm)
        if (res.status !== 0) return this.$message.error('发布文章失败！')
        this.$message.success('发布文章成功！')

        // 关闭对话框
        this.pubDialogVisible = false
        // TODO：刷新文章列表数据
        this.resetListFn()
      })
    },
    // 对话框完全关闭之后的处理函数
    onDialogClosedFn () {
      // 清空关键数据
      this.$refs.pubFormRef.resetFields()
      // 因为这个变量对应的标签不是表单绑定的, 所以需要单独控制
      this.$refs.imgRef.setAttribute('src', defaultImg)
    },
    // 初始化文章列表
    async initArtListFn () {
      console.log('-----' + this.q)
      const { data: res } = await getArticleListAPI(this.q)
      if (res.status !== 0) return this.$message.error('获取文章列表失败!')
      this.artList = res.data
      console.log('total:' + this.artList)
      this.total = res.data.length
      // console.log('total' + this.total)
    },
    // pageSize 发生了变化
    handleSizeChangeFn (newSize) {
      // 为 pagesize 赋值
      this.q.pagesize = newSize
      // 默认展示第一页数据
      this.q.pagenum = 1
      // 重新发起请求
      this.initArtListFn()
    },
    // 页码值发生了变化
    handleCurrentChangeFn (newPage) {
      // 为页码值赋值
      this.q.pagenum = newPage
      // 重新发起请求
      this.initArtListFn()
    },
    // 重置文章的列表数据
    resetListFn () {
      // 1. 重置查询参数对象
      this.q = {
        pagenum: 1,
        pagesize: 2,
        id: '',
        state: ''
      }
      // 2. 重新发起请求
      this.initArtListFn()
    },
    // 获取文章详情
    async showDetailFn (title) {
      console.log('title:' + title)
      const { data: res } = await getArticleDetailAPI(title)
      console.log('status' + res.status)
      console.log(res.data)
      if (res.status !== 0) return this.$message.error('获取文章详情失败!')
      if (res.status === 0) this.artDetail = res.data
      console.log(this.artDetail[0].name)
      //  let [,, ] = [ ]
      this.name = this.artDetail[0].name
      this.title = this.artDetail[0].title
      this.content = this.artDetail[0].content
      this.state = this.artDetail[0].state
      this.img = this.artDetail[0].cover_img
      this.username = this.artDetail[0].username
      this.nickname = this.artDetail[0].nickname
      this.pub_date = this.artDetail[0].pub_date

      console.log(this.content)
      // 展示对话框
      this.detailVisible = true
    },
    // 文章-删除
    async removeFn (title) {
      // 1. 询问用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 2. 取消了删除
      if (confirmResult === 'cancel') return

      // 执行删除的操作
      const { data: res } = await delArticleAPI(title)

      if (res.status !== 0) return this.$message.error('删除失败!')
      if (res.status === 0) {
        this.$message.success('删除成功!')
        // 刷新列表数据
        this.resetListFn()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}

// 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
::v-deep .ql-editor {
  min-height: 300px;
}

// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}

.el-pagination {
  margin-top: 15px;
}

.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;
  span {
    margin-right: 20px;
  }
}

// 修改 dialog 内部元素的样式，需要添加样式穿透
::v-deep .detail-box {
  img {
    width: 500px;
  }
}
</style>
