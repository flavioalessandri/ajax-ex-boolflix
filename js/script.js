
// -----start new function---------------------------
// define the Button used to get input value
function inputContentRequest(){
  var btn = $('#src_btn');
  btn.click(getInputValue);
}

// -----start new function---------------------------
// get input value after button click
function getInputValue(){
  var target = $('#container');
  target.html('');
  var input_value = $('#src_input');
  var input_src =$('#src_input').val();
  input_value.val('');

  console.log("valore input: ", input_src);
  var my_api = "8de22b0db5bf3f29ea5ff07f53e09484";
  searchThroughMovieApi(target,input_src,my_api);
  searchThroughTvApi(target,input_src,my_api);

}

// -----start new function---------------------------
function searchThroughMovieApi(target,input_src,my_api){
  console.log("searchThrough---------Movie---------Api");
  $.ajax({

    url: 'https://api.themoviedb.org/3/search/movie',

    method: "GET",

    data: {
      'api_key': my_api,
      'query': input_src,
      'language': 'it' //get italian title and informations
    },

    success : function(data, results){

      var movies = data['results'];
      console.log("data['results']",results );

      if (movies.length>0){
        console.log(movies,"movies");

        // Handlebars section-----------------------
        var template = $('#template').html();
        var compiled = Handlebars.compile( template);
        // var target = $('#container');
        // target.html('');

        for (var i = 0; i < movies.length; i++) {
          var movie = movies[i];
          var vote = movie['vote_average'];
          var id = movie['id'];
          var stars_rating = Math.round(vote/2);
          var lang_code = movie["original_language"];
          var lang_name = getLanguageName(lang_code);//function from lang.js

          movie['lang_name'] = lang_name ;
          movie['film'] = "film" ;
          movie['poster'] = getPosterImage(movie);

          // Handlebars object -----------------------
          var cardHTML = compiled(movie);

          target.append(cardHTML);
          getStarsRating(id,stars_rating);
        }// Main for cycle end

      } else{
        alert("No Movies Found");
      }
    }, //end of object - success

    error: function(errors){
      var errors = errors['status'];
      alert("errore "+errors);
    }
  });
}


// -----start new function---------------------------
function searchThroughTvApi(target,input_src,my_api){
  console.log("------searchThrough---Tv-------Api--------------------");
  $.ajax({

    url: 'https://api.themoviedb.org/3/search/tv',

    method: "GET",

    data: {
      'api_key': my_api,
      'query': input_src,
      'language': 'it' //get italian title and informations
    },

    success : function(data, results){

      var tv_series = data['results'];
      console.log("data['results']",results );

      if (tv_series.length>0){
        console.log(tv_series,"tv_series");

        // Handlebars section-----------------------
        var template = $('#template').html();
        var compiled = Handlebars.compile( template);
        // var target = $('#container');
        // target.html('');

        for (var i = 0; i < tv_series.length; i++) {
          var movie = tv_series[i];
          var vote = movie['vote_average'];
          var id = movie['id'];
          var stars_rating = Math.round(vote/2);
          var lang_code = movie["original_language"];
          var lang_name = getLanguageName(lang_code);//function from lang.js

          // var poster = getPosterImage(movie);

          movie['lang_name'] = lang_name ;
          movie['tv-show'] = "tv-show" ;
          movie['poster'] = getPosterImage(movie);

          // Handlebars object -----------------------
          var tvHTML = compiled(movie);

          target.append(tvHTML);
          getStarsRating(id,stars_rating);
        }// Main for cycle end

      } else{
        alert("No Tv Series Found");
      }
    }, //end of object - success

    error: function(errors){
      var errors = errors['status'];
      alert("errore "+errors);
    }
  });
}

// -----start new function---------------------------
function getPosterImage(movie){
  var dim = "w185";
  var url = movie["poster_path"];

  if (url === null){
    var poster = "img/w185.jpg";
    return poster;
  }else{
    var poster = "https://image.tmdb.org/t/p/" + dim + url;
    return poster;
    }
}

// -----start new function---------------------------

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
  // fareLog();
  inputContentRequest();

}

// 1) Document Ready-----
$(document).ready(init);
