module.exports = ctx=>
{
  //var mydata = ctx.data
  const tdata = ctx.data

  ctx.state.data =
  {
    mydata: tdata,
    msg:'hello world2'
  }
}