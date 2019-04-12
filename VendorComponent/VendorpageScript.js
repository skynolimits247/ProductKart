$(() => {
    refreshList();
})
/* function to refresh vendor list */
function refreshList(){
        $('#vendorList').empty()
        $('#vendorName').val('')
        $('#vendorEmail').val('')
        $.get('/vendors',
        (data) => {
                    if(data.length == 0){
                        $('#vendorList').append("<b> No Vendors Listed for now..! </b>");
                    }
                    else{
                            for(let vendor of data){
                                $('#vendorList').append(
                                `<li class="list-group-item "><div class="row" align="center"><div class="col-md-10"> Vendor Name: <b>${vendor.name}</b> <br> Email: ${vendor.email}</div>
                                <div class="col-md-2">       
                                <button type="button" class="btn btn-danger btn-lg" onclick=DelVendor(${vendor.id})>
                                <span class="glyphicon glyphicon-remove-circle"></span> Remove
                                </button></div>
                                </div><li>`
                                )
                            }
                        }
                    }
        )
}

/* function to add new vendor */
function addVendor(){
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(($('#vendorName').val()).toString() === ''){
        alert("Please enter vendor name...!");
    }
    if(!($('#vendorEmail').val()).match(mailformat)){
         alert("Please enter valid vendor email...!");
    }
    else{
            $.post('/vendors',
                {
                    vendorName: $('#vendorName').val().toLowerCase(),
                    vendorEmail: $('#vendorEmail').val().toLowerCase(),
                    qty:''
                },
                      (data) => {
                    if (data.success) {
                        refreshList()
                    } else {
                    alert('Some error occurred....!!')
                    }
                }
                )
    }
}

/* function to delete an existing vendor */
function DelVendor(id){
    $.ajax({
        url:`/vendors/${id}`,
        method: 'DELETE',
        contentType:'application/json',
        success: function(data){
             refreshList()
        },
        error: function(request, msg, error){
            alert('Oops...Something went wrong...!')
             refreshList()
        }
    })
    refreshList()
}