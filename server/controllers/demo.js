module.exports = ctx=>
{
  //var mydata = ctx.data
  console.log("peter")
  console.log(ctx)
  console.log(ctx.query)
  console.log(ctx.query.open_id)

  ctx.state.data =
  {
    //mydata: ctx.state.data,
    msg:'hello world2'
  }
}