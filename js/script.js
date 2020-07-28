
// Milestone 1:
// Creare un layout base con una searchbar (una input e un button) in cui possiamo
// scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il
// bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni
// film trovato:
// 1. Titolo
// 2. Titolo Originale
// 3. Lingua
// 4. Voto


// define the Button used to get input value
function inputContentRequest(){
  var btn = $('#src_btn');
  btn.click(getInputValue);

}
// get input value after button click
function getInputValue(){
  var input_value = $('#src_input');
  var input_src =$('#src_input').val();
  input_value.val('');

  console.log("valore input: ", input_src);
  var my_api = "8de22b0db5bf3f29ea5ff07f53e09484";
  searchThroughApi(input_src,my_api);

}


function searchThroughApi(input_src,my_api){

  $.ajax({

    url: 'https://api.themoviedb.org/3/search/movie',

    method: "GET",

    data: {

      'api_key': my_api,
      'query': input_src,
      'language': 'it' //get italian title and informations
    },

    success : function(data, results){

      console.log(data);

      var results = data['results'];
      console.log("data['results']",results );



      if (results.length>0){
        console.log(results,"results ");


        // Handlebars section-----------------------
        var template = $('#template').html();
        var compiled = Handlebars.compile( template);
        var target = $('#container');
        target.html('');

        for (var i = 0; i < results.length; i++) {
          var title = results[i]['title'];
          var original_title = results[i]['original_title'];
          var lang = results[i]['original_language'];
          var vote = results[i]['vote_average'];
          var id = results[i]['id'];
          console.log("vote", vote);
          var stars_rating = Math.round(vote/2);


          // Handlebars object -----------------------
          var cardHTML = compiled(
            {
            'id' : id,
            'title': title,
            'original_title' : original_title ,
            'original_language' : lang.toUpperCase(),
            'vote_average': stars_rating
            }
          )



          target.append(cardHTML);
          getStarsRating(id,stars_rating);




          console.log("APPEND", cardHTML);

        }// Main for cycle end

      } else{
        alert("nessun risultato trovato");
      }
    }, //end of object - success

    error: function(errors){
      var errors = errors['status'];
      alert("errore "+errors);
    }
  });
}




function getStarsRating(id,stars_rating){
  console.log("--------getStarsRating()----------");
  $('li[date-id="'+id+'"]').each(function(){
    for (var i = 0; i < 5; i++) {
      if(i<stars_rating){
        $(this).children('.rating').append("<i class= 'yellow fas fa-star'></i>");
      }else{
        $(this).children('.rating').append("<i class= 'fas fa-star'></i>");
      }
    }
  });
}





// MAIN FUNCTION CONTAINER ------------------------

function init(){
  inputContentRequest();

}

// 1) Document Ready-----
$(document).ready(init);
