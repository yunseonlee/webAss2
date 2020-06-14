/*********************************************************************************
* WEB422 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: ____Yunseon Lee       Student ID:  048 757 140        Date: June/14/2020
*
*
********************************************************************************/ 
let saleData =[];
let page = 1;
const perPage = 10;
const saleTableTemplate = _.template(`
                            <% _.forEach(sales, sale=> { %>
                                <tr data-id=<%- sale._id %>> 
                                <td><%- sale.customer.email %></td> 
                                <td><%- sale.storeLocation %></td> 
                                <td><%- sale.items.length %></td> 
                                <td><%- moment.utc(sale.saleDate).local().format('LLLL') %></td> 
                                </tr>
                            <% }); %> `);


 const saleModalBodyTemplate = _.template(`
                                <h4><b>Customer</b></h4>
                                <strong>email:</strong> <%- obj.customer.email %><br>
                                <strong>age:</strong> <%- obj.customer.age %><br>
                                <strong>satisfaction:</strong> <%- obj.customer.satisfaction %> / 5
                                <br><br>
                                <h4><b>Items: $<%- obj.total.toFixed(2) %></b></h4>
                                <table class="table">
                                    <thead>
                                        <tr><b>
                                            <th>Product Name</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                        </b></tr>
                                    </thead>
                                    <tbody>
                                        <% _.forEach(obj.items, function(sale) { %>
                                            <tr data-id=<%- sale._id %>>
                                                <td><%- sale.name %></td>
                                                <td><%- sale.quantity %></td>
                                                <td>$<%- sale.price %></td>
                                            </tr>
                                        <% }); %>
                                    </tbody>
                                </table>`);
$(function(){
    loadSaleData();

function loadSaleData(){

    fetch(`https://straw-very-very-icecream.herokuapp.com/api/sales?page=${page}&perPage=${perPage}`).then(res=>{
           // console.log("first then");    
            return res.json();
        }).then(data=>{
            console.log(data);
            saleData = data;
            let dataTable = saleTableTemplate({sales: saleData});
            $("#sale-table tbody").html(dataTable);
            $("#current-page").html(page);
            
    })
}
 
    $("#sale-table tbody").on("click","tr", function(e){  //tr is dynamic
        let modalId = $(this).attr("data-id");
       //let clicked = saleData.find(({_id})=>_id == modalId);  same as below
       let clicked =  _.find(saleData,function(a){return a._id==modalId});
    
       //console.log(modalId);
             
         
       $("#sale-modal .modal-header").html(`<b>Sale: ${modalId}</b>`)
      clicked.total = 0;

      //  sum total sale, price x quantity
      for (let i = 0; i < clicked.items.length; i++) {
          clicked.total += clicked.items[i].price * clicked.items[i].quantity;
      }
      
       
        $("#modal-body").html(saleModalBodyTemplate(clicked));
 
        $("#sale-modal").modal({
            backdrop: 'static', // disable click to close
            keyboard: false // disable keyboard press to close
        });
    });


    $("#next-page").on("click", function(){
        page++;
        loadSaleData();
    });
    $("#previous-page").on("click", function(){
        if(page>1){
        page--;
        }
        loadSaleData();
    });

 

});