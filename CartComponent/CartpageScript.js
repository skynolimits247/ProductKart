$(() => {
    refreshList();
})

function refreshList(){
    let totalPrice=0;
    $('#cartList').html("");
    $.get(`/checkout/${sessionStorage.getItem("id")}`,
        (data) => {
                     if(data.length == 0){
                        $('#cartList').html("<b> No Products Listed for now..! </b>");
                    }
                    else{
                              for(let cart of data){
                                  totalPrice+=(cart.product.price * cart.qty)
                                $('#cartList').prepend(
                                                `<tr class="row">
                                    <td class="col-md-2">${cart.product.name}</td>
                                    <td class="col-md-2">₹ ${cart.product.price}</td>
                                    <td class="col-md-4">
                                        <a href="#" id="qadd">
                                            <span class="glyphicon glyphicon-plus-sign" onclick="AddCart(${cart.productId})"></span>
                                        </a>
                                        <b id = "qty">${cart.qty}</b>
                                        <a href="#" id="qsub">
                                            <span class="glyphicon glyphicon-minus-sign" onclick="RemQtyCart(${cart.id})"></span>
                                        </a>
                                    </td>
                                    
                                    <td class="col-md-2"><i class="fa fa-inr" aria-hidden="true"></i>₹ ${cart.product.price * cart.qty}</td>
                                
                                    <td class="col-md-2">
                                        <button class="btn btn-danger" id="remProduct" onclick="remProduct(${cart.id})">Remove</button>
                                </td>
                                </tr>`
                                )
                            }
                            $('#cartList').append(
                                `<tr class="row">
                                    <td class="col-md-6"></td>
                                    <td class="col-md-2"></td>
                                    <td class="col-md-2">SubTotal :</td>
                                    <td class="col-md-2">₹ <b id="sumtotal">0</b></td>
                                </tr>
                                <tr class="row">
                                    <td class="col-md-6"></td>
                                    <td class="col-md-2"></td>
                                    <td class="col-md-2">
                                        <a href="/" class='btn btn-default' style='font-size: 12px;'>
                                            <span class="glyphicon glyphicon-shopping-cart"></span>
                                            Continue Shopping
                                        </a>
                                    </td>
                                    <td class="col-md-2">
                                        <a href="#" class='btn btn-success' style='font-size: 12px;' onclick="checkout(${sessionStorage.getItem("id")})">
                                            Checkout
                                            <span class="glyphicon glyphicon-circle-arrow-right"></span>
                                        </a>
                                    </td>
                                </tr>`)
                            $("#sumtotal").text(totalPrice)
                    }
        })
}

function remProduct(id){
            $.ajax({
        url:`/delcartprod/${id}`,
        method: 'DELETE',
        contentType:'application/json',
        success: function(data){
            alert("Successully deteleted item form your cart list..!!")
        },
        error: function(request, msg, error){
            alert('Oops...Something went wrong...!')
        }
    })
    refreshList()
}

/*function to add to cart*/
function AddCart(id){
    if(sessionStorage.getItem("email") === null){
        alert("Please LogIn to add products to your cart...!")        
    }else{
             $.post(`/cart`,
                    {
                        productId: id,
                        userId: sessionStorage.getItem("id")
                    },
                    (data) => {
                            if (data.success) {
                                refreshList()
                            } else {
                                alert(data.err+"...!!")
                                refreshList()
                            }                           
                    }
                )
                
    }
}
function checkout(id){
                $.ajax({
        url:`/sale/${id}`,
        method: 'DELETE',
        contentType:'application/json',
        success: function(data){
            alert("Thank you for shopping with us..!!")
            location.replace("/"); 
        },
        error: function(request, msg, error){
            alert('Oops...Something went wrong...!')
            refreshList()
        }
    })
    
}
function RemQtyCart(id){
                     $.post(`/remqty/${id}`,
                    (data) => {
                            if (data.success) {
                                alert("Successfully removed item to cart...!")
                                refreshList()
                            } else {
                                alert('Some error occurred....!!' + data.err)
                                refreshList()
                            }                           
                    })
}