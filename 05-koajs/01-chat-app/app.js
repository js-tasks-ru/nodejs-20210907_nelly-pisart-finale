const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscribersStore = {};

router.get('/subscribe', async (ctx, next) => {
  const id = ctx.query.r || Math.random();

  const messagePromise = await new Promise((resolve) => {
    subscribersStore[id] = resolve;
  });

  ctx.req.on('close', () => {
    delete subscribersStore[id];
  });

  ctx.body = messagePromise;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (!message) ctx.throw(404, 'message not found');

  Object.values(subscribersStore).forEach((promise) => promise(message));
  ctx.body = message;
});

app.use(router.routes());

module.exports = app;
