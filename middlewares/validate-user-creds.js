async function validateUserCreds(ctx, next) {
  const pass = ctx.checkBody('pass').notEmpty().len(6, 255).sha1().value;
  const email = ctx.checkBody('email').isEmail().len(0, 255).value;

  ctx.assert(!ctx.errors, 400);

  ctx.state.pass = pass;
  ctx.state.email = email;

  await next();
}

module.exports = validateUserCreds;
