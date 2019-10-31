const Koa = require('koa')
const app = new Koa()

// const main = ctx => {
//   ctx.response.body = 'hello koa'
//   next()
// }

const handle = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.response.status = err.statusCode || err.status || 500
    ctx.response.body = {
      message: err.message
    }
  }
}

const main = ctx => {
  //   ctx.throw(500)
  ctx.response.body = 'hello koa'
}

app.use(main)
app.use(handle)
app.listen(8000)
