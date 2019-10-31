// 读写cookie

const Koa = require('koa')
const app = new Koa()

const main = ctx => {
  const n = Number(ctx.cookies.get('views') || 0) + 1
  ctx.cookies.set('views', n)
  ctx.response.body = n + 'views'
}

app.use(main)
app.listen(8889)