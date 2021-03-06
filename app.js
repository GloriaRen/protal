const Koa = require('koa')
const path = require('path')
const multer = require('koa-multer')
const views = require('koa-views')
const router = require('koa-router')()
const koaBody = require('koa-body')
const static = require('koa-static')
const app = new Koa()

// 加载模板引擎
app.use(
  views(path.join(__dirname, 'src/views'), {
    extension: 'ejs'
  })
)

router.get('/', async ctx => {
  let title = 'MideaCloud'
  await ctx.render('index', {
    title
  })
})

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE')
  ctx.set(
    'Access-Control-Allow-Headers',
    'x-requested-with, accept, origin, content-type'
  )
  // 服务器收到请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。
  ctx.set('Content-Type', 'application/json;charset=utf-8')
  // 当设置成允许请求携带cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";
  ctx.set('Access-Control-Allow-Credentials', true)
  // 该字段可选，用来指定本次预检请求的有效期，单位为秒。
  ctx.set('Access-Control-Max-Age', 300)
  ctx.set('Access-Control-Expose-Headers', 'myData')
  await next()
})

//文件上传
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'src/static/')
  },
  //修改文件名称
  filename: function(req, file, cb) {
    var fileFormat = file.originalname.split('.') //以点分割成数组，数组的最后一项就是后缀名
    cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
  }
})
//加载配置
var upload = multer({ storage: storage })
router.post('/upload', upload.single('file'), async (ctx, next) => {
  console.log(ctx.req.file)
  ctx.body = {
    filename: ctx.req.file.filename //返回文件名
  }
})

// 上传json文件
// const uploadUrl = 'http://localhost:3000/file'
// router.post('/file', ctx => {
//   console.log(ctx.request)
//   const file = ctx.request.files.file
//   console.log(file)
//   // 读取文件流
//   const fileReader = fs.createReadStream(file.path)
//   const filePath = path.join(__dirname, 'src/static/')
//   // 组装成绝对路径
//   const fileResource = filePath + `/${file.name}`
//   // 使用 createWriteStream 写入数据，然后使用管道流pipe拼接
//   const writeStream = fs.createWriteStream(fileResource)
//   // 判断 /static/ 文件夹是否存在，如果不在的话就创建一个
//   if (!fs.existsSync(filePath)) {
//     console.log('001')
//     fs.mkdir(filePath, err => {
//       if (err) {
//         throw new Error(err)
//       } else {
//         fileReader.pipe(writeStream)
//         ctx.body = {
//           url: uploadUrl + `/${file.name}`,
//           code: 200,
//           message: '上传成功'
//         }
//       }
//     })
//   } else {
//     console.log('002')
//     fileReader.pipe(writeStream)
//     ctx.body = {
//       url: uploadUrl + `/${file.name}`,
//       code: 0,
//       message: '上传成功'
//     }
//   }
// })

// 获取版本信息
router.get('/versionList', async (ctx, next) => {
  ctx.response.body = {
    code: 200,
    status: true,
    data: version,
    msg: '获取数据成功'
  }
})

// 回滚版本

// app.use(static(path.join(__dirname)))
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3022, () => {
  console.log('app started at port 3022...')
})
