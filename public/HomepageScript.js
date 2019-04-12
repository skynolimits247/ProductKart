$(() => {
    refreshList()
    if(sessionStorage.getItem("email") === null){
        $("#login").html(
                `<input type="email" class="form-control" id="username" placeholder="Enter your email...">`
                )
    }else{
            $("#login").html(
                `<button type="button" class="btn btn-basic btn-sm" onclick="logOut()">
                <span class="glyphicon glyphicon-off"></span>LogOut
                </button>`
                )
                $("#salutation").html(
                `<b>Welcome ${sessionStorage.getItem("email")} </b>`
                )
    }

    $('#username').keypress(function(e){
        var keyCode = (event.keyCode ? event.keyCode : event.which);  
        let temp =  $('#username').val().toString().toLowerCase();
        if (keyCode == 13) {
            let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if(!temp.match(mailformat)){
                    alert("Please enter valid emailID...!");
                }else{
                                $.post('/user',
                                {email: temp},
                                (data) => {
                                        if (data.success) {
                                            sessionStorage.setItem("id",parseInt(data.id))
                                            sessionStorage.setItem("email",data.email)
                                            location.reload()
                                        } else {
                                            alert('Some error occurred....!!')
                                        }                           
                                }
                            )
                        $('#username').val('')
                        refreshList()
                }
        }
    });  

})
/*
Refresing page components
*/
function refreshList(){
     $('#productList').html('')
                $.get('/products',
                (data) => {
                    
                    if(data.length == 0){
                        $('#productList').html("<b> No Products Listed for now..! </b>");
                    }
                    else{
                            for(let product of data){
                                     $('#productList').append(`<div class="col-sm-3 well" style="margin-left:2em; margin-right:3em;">
                                            <table class="hover">
                                                <tr>
                                                    <td>Product Name : </td>
                                                    <td><b>${product.name}</b></td>
                                                </tr>
                                                <tr>
                                                    <td>Product Price : </td>
                                                    <td><b>₹ ${product.price}</b></td>
                                                </tr>
                                                <tr>
                                                    <td>Product Vendor : </td>
                                                    <td><b>${product.vendor.name}</b></td>
                                                </tr>
                                                <tr>
                                                    <td>Units left : </td>
                                                    <td><b>${product.qty}</b></td>
                                                </tr>
                                                                <tr>
                                                    <td colspan="2"> <button class="btn btn-danger" onclick=AddCart(${product.id})>Add to Cart</button></td>
                                                </tr>
                                            </table>
                                        </div>`)
                            }
                        }
                    }
        )
        UpdateCart()
}
/*
function to logOut user
*/
function logOut(){
    sessionStorage.clear()
    location.reload()
}
 
/*function to add to cart*/
function AddCart(id){
    if(sessionStorage.getItem("email") === null){
        alert("Please LogIn to add products to your cart...!")  
         $("#username").focus()      
    }else{
             $.post(`/cart`,
                    {
                        productId: id,
                        userId: sessionStorage.getItem("id")
                    },
                    (data) => {
                            if (data.success) {
                                alert("Successfully added item to cart...!")
                                UpdateCart()
                            } else {
                                alert('Some error occurred....!!' + data.err)
                            }                           
                    }
                )
                
    }
}
/*
Updating cart count
*/
function UpdateCart(){
        if(sessionStorage.getItem("email") === null){
        $("#cartCount").html(`Cart : 0 item`)
        }else{
            $.get( `/cart/${sessionStorage.getItem("id")}`,
                    (data) =>  {
                        if(data.length == 0){
                                    $("#cartCount").html(`Cart : 0 item`)
                        }
                            else{
                                $("#cartCount").html(`Cart : ${data.count} item`)
                                }
                    })        
            }
}
/*
functoin to redirect to Cart page
*/
function cartPage(){
    if(sessionStorage.getItem("email") === null){
       alert("Please login to View the cart page...!!")
        $("#username").focus()
        }else{
            console.log("cart page")
            location.replace("/checkout"); 

        }
}