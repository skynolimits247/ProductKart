$(() => {
    refreshList();
})

/* function to refresh product list */
function refreshList(){
        $('#productList').empty()
        $('#productName').val('')
        $('#productPrice').val('')
         $('#productQuantity').val('')
        
                     $.get('/vendors',
            (data) => {
                        if(data.length == 0){
                            $('#vendorList').append("<b> No Vendors Listed for now..! </b>");
                        }
                        else{
                            $('#vendorList').empty()
                             $('#vendorList').append(`<option value="">Select Vendor</option>`)
                                for(let vendor of data){
                                    $('#vendorList').append(
                                    `<option value="${vendor.id}">${vendor.name}</option>`
                                    )
                                }
                            }
                        }
            )
        $.get('/products',
        (data) => {
                    
                    if(data.length == 0){
                        $('#productList').append("<b> No Products Listed for now..! </b>");
                    }
                    else{
                            for(let product of data){
                                console.log(product)
                                $('#productList').append(
                                `<li class="list-group-item"><div class="row" align="center">
                                <div class="col-md-10"> Product Name: <b>${product.name}</b> <br> Total Quantity: ${product.qty}
                                <br>Price :<b> &#8377 ${product.price}</b>
                                <br>
                                Vendor: ${product.vendor.name}
                                </div>
                                <div class="col-md-2">       
                                <button type="button" class="btn btn-danger btn-lg" onclick=delProduct(${product.id})>
                                <span class="glyphicon glyphicon-remove-circle"></span> Remove
                                </button></div>
                                </div><li>`
                                )
                            }
                        }
                    }
        )
}
/* Function to add a new product */
function addProduct(){
    let productName = ($('#productName').val()).toString().toLowerCase();
    let productPrice = parseFloat($('#productPrice').val());
    let productQty = parseInt($('#productQuantity').val());
    let vendorId = parseInt($('#vendorList').val());
    if(($('#productName').val()).toString() === ''){
        alert("Please enter product name...!");
    }
    if(productPrice.toString() == 'NaN'){
            alert("Please enter a valid product price...!")
    }
    if(productQty.toString() == 'NaN'){
            alert("Please enter a valid product quantity...!")
    }
    if(vendorId.toString() == 'NaN'){
            alert("Please select a vendor...!")
    }
    else{
            $.post('/products',
                {
                    name:productName,
                    price:productPrice,
                    qty:productQty,
                    vendor:vendorId
                },
                (data) => {
                    if (data.success) {
                        refreshList()
                    } else {
                    alert('Some error occurred....!!')
                    }
                refreshList()
                }
                )
    }
            
}
function delProduct(id){
        $.ajax({
        url:`/products/${id}`,
        method: 'DELETE',
        contentType:'application/json',
        success: function(data){
        },
        error: function(request, msg, error){
            alert('Oops...Something went wrong...!')
        }
    })
    refreshList()
}