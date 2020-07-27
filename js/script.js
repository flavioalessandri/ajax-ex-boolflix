
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
  searchThroughApi(input_src);
  // return input_src;
}

function searchThroughApi(input_src){

  $.ajax({

    url: 'https://api.themoviedb.org/3/search/movie?api_key=8de22b0db5bf3f29ea5ff07f53e09484',

    method: "GET",

    data:{
      'query': input_src
    },

    success : function(data, state){

      var movie_card = data['results'];
      console.log("data['results']",movie_card);
        var movie_card = data['results'];

      if (movie_card.length > 0){

        var title = movie_card[0]['title'];
        var original_title = movie_card[0]['original_title'];
        var lang = movie_card[0]['original_language'];
        var vote = movie_card[0]['vote_average'];
        var list = title,original_title,lang,vote;

        console.log("data['results']", movie_card);
        console.log("movie_card['original_language']", lang );
        console.log("movie_card['vote_average']", vote);
        console.log("element list", list);


      } else{
        console.log("nessun risultato trovato");
      }


    },

    error: function(err){
      console.log("errore",err);
    }
  });
}


// MAIN FUNCTION CONTAINER ------------------------

function init(){
  inputContentRequest();
}

// 1) Document Ready-----
$(document).ready(init);
