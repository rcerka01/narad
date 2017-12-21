// transfear Mongo id to Date
var dateFromObjectId = function (objectId) {
	return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};

// JQuery GET URL params
var urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results[1] || 0;
}

// draw market table for game report
function marketTable(results) {
    var output = header();
  
    for (var n=0; n<=2; n++) {
  
      output = output +     
      "</tr>" +  
    "</thead>" +  
    "<tbody>" +  
      "<tr>" +  
        "<th scope='row'>" + results[0].logStatus.marketBetStatus[n].selectionId + "</th>";
        for (var i=1; i<=100; i++ ) {
          var item = "<td>"  + "" +  "</td>";
  
          for (var ii in results) {
            var status = results[ii].logStatus.gameStatus;
            var market = results[ii].logStatus.marketBetStatus[n];
  
            var fullMarket = 
              "BACK_PRICE:<strong>" + market.backPrice + "</strong><br>" +
              "BACK_SIZE:<strong>" + market.backSize + "</strong><br>" +
              "LAY_PRICE:" + market.layPrice + "<br>" +
              "LAY_SIZE:" + market.laySize + "<br>";
            
            if (i == status.timeElapsed) {
              item = "<td style='background-color:pink;width:10%;'>" + fullMarket + "</td>";
            }
          }
          output = output + item;
        }
      }
      return output;
  }
  
// add row for stats table for game report
function addRow(name, results, event, side, isTop) {    
    if (isTop) {
        var output = header();
    } else {
        var output = "";
    }

    output = output +     
    "</tr>" +  
  "</thead>" +  
  "<tbody>" +  
    "<tr>" +  
    "<th scope='row'>" + name + "</th>";
    var prev;
    for (var i=1; i<=100; i++ ) {
        var item = "<td>" + "" + "</td>";

        for (var ii in results) {
        var status = results[ii].logStatus.gameStatus;
        if (i == status.timeElapsed && prev != status.score[side][event]) {
            item = "<td style='background-color:pink;font-weight:bold;'>" + status.score[side][event] + "</td>";
            prev = status.score[side][event];
        }
        }

        output = output + item;
    }
    return output;
}
  
// used in addRow()
function header() {
var output = 
"<table class='table table-striped' style='font-size:8px;'>" +
    "<thead>" +
    "<tr>" +
    "<th> EVENT/TIME </th>";
    for (var i=1; i<=100; i++ ) {
        output = output + "<th>" + i + "</th>";
    };
    return output;
}
  
// used in addRow()
var addBottom = "</tr></tbody></table>";

// draw single line chart
function drawChart(divId, items, data, label, color, title) {
    new Chart(document.getElementById(divId), {
      type: 'line',
      data: {
        labels: items,
        datasets: [{ 
            data: data,
            label: label,
            borderColor: color,
            fill: false
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: title
        }
      }
    });
  }

  // used for single line chart
  function getItemsPrices(source) {
    var items = [];
    var prices = [];
    for (var i in source) {
      items.push(i);
      prices.push(source[i].price); 
    }
    return { items:items, prices:prices };
  }
  