
// -----start new function---------------------------
// define the Button used to get input value
function onClickInput(){
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
  var my_api_key = "8de22b0db5bf3f29ea5ff07f53e09484";
  searchThroughMovieApi(target,input_src,my_api_key);
  searchThroughTvApi(target,input_src,my_api_key);

}

// -----start new function---------------------------
function searchThroughMovieApi(target,input_src,my_api_key){
  console.log("searchThrough---------Movie---------Api");
  $.ajax({

    url: 'https://api.themoviedb.org/3/search/movie',

    method: "GET",

    data: {
      'api_key': my_api_key,
      'query': input_src,
      'language': 'it' //get italian title and informations
    },

    success : function(data, results){

      var movies = data['results'];

      if (movies.length>0){
        // Handlebars section-----------------------
        var template = $('#template').html();
        var compiled = Handlebars.compile( template);

        // starting FOR cycle through movies
        for (var i = 0; i < movies.length; i++) {
          var movie = movies[i];
          var movie_serie = movies[i];
          var id = movie.id;

          var genre_ids = movie_serie.genre_ids;

          // get vote parameters and switch them to font-awesome stars
          var vote = movie.vote_average;
          var stars_rating = Math.round(vote/2);
          movie.stars = getStarRating(stars_rating);
          vote = stars_rating;
          // add lang parameters form lang.js
          var lang_code = movie.original_language;
          var lang_name = getLanguageName(lang_code);//function from lang.js
          movie.lang_name = lang_name ;

          movie.overview = getOverview(movie_serie);
          console.log(movie.overview, "movie overview");

          movie.film = "film" ;
          movie.poster = getPosterImage(movie_serie)[0];
          movie.image_not_found= getPosterImage(movie_serie)[1];
          // Append Handlebars template compiled to body--
          var cardHTML = compiled(movie);
          target.append(cardHTML);

          getActors(id,my_api_key);

          getGenre(my_api_key,genre_ids,id);



        }// Main for cycle end

      } else{
        alert("No Movies Found");
      }
    }, //end of object - success

    error: function(errors){
      var errors = errors['status'];
      console.log("errore searchThroughMovieApi "+errors);
    }
  });
}

// -----start new function---------------------------
function searchThroughTvApi(target,input_src,my_api_key){
  console.log("------searchThrough---Tv--Api--------------------");
  $.ajax({

    url: 'https://api.themoviedb.org/3/search/tv',

    method: "GET",

    data: {
      'api_key': my_api_key,
      'query': input_src,
      'language': 'it' //get italian title and informations
    },

    success : function(data, results){

      var tv_series = data['results'];


      if (tv_series.length>0){

        // Handlebars section-----------------------
        var template = $('#template').html();
        var compiled = Handlebars.compile( template);

        // starting FOR cycle through tv-series
        for (var i = 0; i < tv_series.length; i++) {
          var serie = tv_series[i];
          var movie_serie = tv_series[i];
          var id = serie.id;
          var genre_ids = movie_serie.genre_ids;

          // get vote parameters and switch them to font-awesome stars
          var vote = serie.vote_average;
          var stars_rating = Math.round(vote/2);
          serie.stars = getStarRating(stars_rating);
          vote = stars_rating;
          // add lang parameters form lang.js
          var lang_code = serie.original_language;
          var lang_name = getLanguageName(lang_code);//function from lang.js
          serie.lang_name = lang_name ;
          serie.tv_show = "tv_show" ;

          serie.overview = getOverview(movie_serie);

          // insert poster image
          serie['poster'] = getPosterImage(movie_serie)[0];
          serie['image_not_found']= getPosterImage(movie_serie)[2];

          // Append Handlebars template compiled to body--          var tvHTML = compiled(serie);
          var tvHTML = compiled(serie);
          target.append(tvHTML);

          getActors(id,my_api_key);
          getGenre(my_api_key,genre_ids,id);

        } // end of FOR cycle through movies

      } else{
        alert("No Tv Series Found");
      }
    }, //end of object - success

    error: function(errors){
      var errors = errors['status'];
      console.log("errore searchThroughTvApi "+errors);
    }
  });
}

// -----start new function---------------------------
function getActors(id,my_api_key){
  console.log("---------getActors------");

  $.ajax({
    url: 'https://api.themoviedb.org/3/movie/'+ id +'/credits',

    method: "GET",

    data: {
      'api_key': my_api_key,
      'language': 'it' //get italian title and informations
    },

    success: function(data, state){

        var actors ="";
        var character = data['cast'];

        if(character.length>0){

          for (var k = 0; k< 5; k++) {

            if (k !== undefined){
              actors = "<li>" + character[k]['name'] + "</li>";
              $('li[data-id = "' + id + '"]').find('.cast').append(actors);
            }
        }
        } else{
          k = 5;
            $('li[data-id = "' + id + '"]').find('.cast').text("No Actors List Found!");
        }return actors;
    },

    error: function(errors){
      var errors = errors['status'];
      console.log("Errore getActors "+errors);
    }
  });
}

// -----start new function---------------------------
function getGenre(my_api_key,genre_ids,id){

  $.ajax({
    url: 'https://api.themoviedb.org/3/genre/movie/list?api_key=8de22b0db5bf3f29ea5ff07f53e09484&language=it',

    method: "GET",

    success: function(data, state){

        var this_id = $('.movie[data-id = "'+id+'"]');
        var genresLength = data['genres'].length;
        var genreApiSort = data['genres'].sort((a, b) => (a.id > b.id) ? 1 : -1)
        var myGenreSort= genre_ids.sort(function(c,d) { return c - d; });

        if(myGenreSort.length>0){
          for (var m = 0; m < genresLength; m++) {

            var genKey = genreApiSort[m]['id'];
            var genName = genreApiSort[m]['name'];

            if (myGenreSort.includes(genKey)){
              this_id.find('.genres').append("<li> ID " + genKey +" : "+ genName +"</li>");

            } else {
              // console.log("niente genere");
            }
          }
        } else{
          this_id.find('.genres').text("No Genre Found!");
        }
      },

      error: function(errors){
        var errors = errors['status'];
        console.log("Errore getActors "+ errors);
      }
  });
}

// -----start new function---------------------------
function getOverview(movie_serie){
  if(movie_serie.overview.length == 0){
    movie_serie.overview = "No overview for this title";
    return movie_serie.overview;
  } else{
    return movie_serie.overview;
  }
}

// -----start new function---------------------------
function getPosterImage(movie_serie){
  var not = movie_serie.image_not_found;
  var dim = "w342";
  var url = movie_serie.poster_path;

  // if no poster images found
  if (url === null) {
    var poster = "img/w342.jpg";
    not_movie_img = movie_serie.original_title;
    not_serie_img = movie_serie.original_name;
    return [poster, not_movie_img,not_serie_img];

  } else {
    var poster = "https://image.tmdb.org/t/p/" + dim + url;
    not = "";
    return [poster, not];
    }
}

// -----start new function---------------------------
function getStarRating(stars_rating){

  var star_list ="";
  for (var j = 0; j < 5; j++){
    if(j < stars_rating){
      star_list += "<i class='colored fas fa-star'></i>";
    }else{
      star_list += "<i class='far fa-star'></i>";
    }
  }return star_list;
}

// -----start new function---------------------------
function onMouseEnter(){
  console.log("enter content");
  $(document).on("mouseenter",'#container li.movie', function(){
    $(this).children('img.poster , .image_not_found').fadeOut("fast");
  });
}

// -----start new function---------------------------
function onMouseLeave(){
  console.log("enter content");
  $(document).on("mouseleave",'#container li.movie', function(){
    $(this).children('img.poster, .image_not_found').fadeIn("fast");
  });
}

// MAIN FUNCTION CONTAINER ------------------------
function init(){
  onClickInput();
  getInputValue()
  onMouseEnter();
  onMouseLeave();
}

// 1) Document Ready-----
$(document).ready(init);
