let inv=$('#inventory')
let prodReq=$('#prodReq')
let trans=$('#transactions')
let add=$('#add')
showInv()
$(()=>{
    $('#buyProd').click(showInv)
    $('#addProd').click(showAdd)
    $('#transNav').click(showTrans)
    $('#prodNav').click(showReq)
})


function showInv()
{
    inv.show()
    prodReq.hide()
    trans.hide()
    add.hide()
}
function showReq()
{
    inv.hide()
    prodReq.show()
    trans.hide()
    add.hide()
}
function showAdd()
{
    inv.hide()
    prodReq.hide()
    trans.hide()
    add.show()
}
function showTrans()
{
    inv.hide()
    prodReq.hide()
    trans.show()
    add.hide()
}
