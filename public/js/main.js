function getTodays(){
  $.ajax({
     type: "GET",
     url: "/query",
     success: function(msg) {

        todaysChat(msg)
        // var output = "";
        // for(var i in msg)
        //  {
        //    output = output + ("<li>" + msg[i].name + " <strong>" + msg[i].market_count + "</strong></li>");
        //  }
        //  $('#events').html("Market count: <ul>" + output + "</ul>")
       }
  }); 
}