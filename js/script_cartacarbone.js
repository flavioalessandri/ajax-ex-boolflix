
function myCalendar(){
  console.log('*-------myCalendar----------*');
  var month=1;

  getCurrentMonth(month);
  console.log("----------getCurrentMonth----------");

  // after click next button
  $("#next").click(function(){
    if(month > 11) {
      // alert("Back to January");
      month=1;
    }else {
      month= month+1;
    }
    getCurrentMonth(month);
  })

// after click prev button
  $("#prev").click(function(){
    if(month <= 1) {
      // alert("Back To December");
      month=12;
    }else {
    month= month-1;
    }
    getCurrentMonth(month);
  })

}

function getCurrentMonth(month){
  console.log('*--------getCurrentMonth-----------*');

    var date = moment("01-"+month+"-2018", "DD-MM-YYYY");

    var template = $('#template').html();
    var template_month = $('#month_template').html();

    var compiled = Handlebars.compile(template);
    var compiled_month = Handlebars.compile(template_month);

    var target = $('#month');
    var target_month = $('#selected_month');

    var daysInMonth = date.daysInMonth();

    target.html('');
    target_month.html('');

    for (var i = 1; i <= daysInMonth ; i++) {

      var calendarHTML = compiled(
        {
        'day': i,
        'month' : (date.month()),
        'month_wrld': date.format('MMMM')
      });

      var month_titleHTML = compiled_month(
        {
        'month' : date.format('MMMM')
      });

      target.append(calendarHTML);
    }
    target_month.append(month_titleHTML);

    cycleThrougAPI(month);
}


function cycleThrougAPI(month){
console.log("----------cycleThrougAPI()------");
  var date = moment("01-"+month+"-2018", "DD-MM-YYYY");

  var year = date.year();
  var month = date.month();
  console.log("YEAR", year);
  console.log("MONTH", month);

  $.ajax({

    url: 'https://flynn.boolean.careers/exercises/api/holidays',
    method: "GET",
    data : {
      'month' : month,
      'year' : year
    },

    success: function(data,state){

      var holidays = data['response'];
      var success = data['success'];

      var holidays_length = data['response'].length;

      if(success && holidays_length>0 ){

        for (var i = 0; i < holidays_length; i++) {
          var variables = holidays[i]['date'];
          var holiday_name = holidays[i]['name'];
          var complete_date = moment(variables).format('YYYY-MM-DD');
          var day = parseInt(moment(variables).format('DD'));

          var holiday_selected= $("#month li[data-datacomplete='"+ day + "']");
          holiday_selected.append("<span> "+holiday_name+" </span>");
          holiday_selected.addClass('holidays');
        }
      }
      else{
        var month_alert = date.format('MMMM').toUpperCase();
        alert(" I'm sorry ! No Holidays in  " + month_alert+" !");
      }

    },
    error: function(err){
      console.log("ERRORE",err);
    }
});

}

// MAIN FUNCTION CONTAINER ------------------------

function init(){
  myCalendar();
}

// 1) Document Ready-----
$(document).ready(init);
