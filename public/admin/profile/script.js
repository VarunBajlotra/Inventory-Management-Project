statsNav()
$(()=>{
    statsNav()
    $('#statsNav').click(statsNav)
    $('#invNav').click(invNav)
    $('#usersNav').click(usersNav)
    $('#transNav').click(transNav)
    $('#prodNav').click(prodNav)
    $('#reqNav').click(reqNav)
    $('#addProduct').click(showAdd)
})

function statsNav(){
    $('#adminCard').show()
    $('#inventory').hide()
    $('#usersAdmin').hide()
    $('#transaction').hide()
    $('#productRequest').hide()
    $('#requestLog').hide()
    $('#add').hide()
}

function invNav(){
    $('#adminCard').hide()
    $('#inventory').show()
    $('#usersAdmin').hide()
    $('#transaction').hide()
    $('#productRequest').hide()
    $('#requestLog').hide()
    $('#add').hide()

}

function usersNav(){
    $('#adminCard').hide()
    $('#inventory').hide()
    $('#usersAdmin').show()
    $('#transaction').hide()
    $('#productRequest').hide()
    $('#requestLog').hide()
    $('#add').hide()
}

function transNav(){
    $('#adminCard').hide()
    $('#inventory').hide()
    $('#usersAdmin').hide()
    $('#transaction').show()
    $('#productRequest').hide()
    $('#requestLog').hide()
    $('#add').hide()
}

function prodNav(){
    $('#adminCard').hide()
    $('#inventory').hide()
    $('#usersAdmin').hide()
    $('#transaction').hide()
    $('#productRequest').show()
    $('#requestLog').hide()
    $('#add').hide()
}
function reqNav(){
    $('#adminCard').hide()
    $('#inventory').hide()
    $('#usersAdmin').hide()
    $('#transaction').hide()
    $('#productRequest').hide()
    $('#requestLog').show()
    $('#add').hide()
}

function showAdd(){
    $('#adminCard').hide()
    $('#inventory').hide()
    $('#usersAdmin').hide()
    $('#transaction').hide()
    $('#productRequest').hide()
    $('#requestLog').hide()
    $('#add').show()
}