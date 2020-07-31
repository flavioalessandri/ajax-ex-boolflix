
// -----start new function---------------------------
function onClickInput(){
  // define the Button used to get input value
  var btn = $('#src_btn');
  btn.on("click", (getInputValue));
}

// -----start new function---------------------------
function getInputValue(){
  // get input value after button click
  var target = $('.container');
  target.html('');
  var input_value = $('#src_input');
  var input_src =$('#src_input').val();
  input_value.val('');

  console.log("valore input: ", input_src);
  var my_api_key = "8de22b0db5bf3f29ea5ff07f53e09484";

  var movie = "movie";
  var tv_serie = "tv";
  searchMovieTv(movie,target,input_src,my_api_key);
  searchMovieTv(tv_serie,target,input_src,my_api_key);
}

// -----start new function---------------------------
function searchMovieTv(type,target,input_src,my_api_key){
  // call serieTv and Movie MovieDB Api
  console.log("------searchMovieTv---------", type);

  $.ajax({

    url: 'https://api.themoviedb.org/3/search/'+ type,

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
          // var movies = data['results'][i];
          var movie = movies[i];


          var id = movie.id;
          var genre_ids = movie.genre_ids;

          // get vote parameters and switch them to font-awesome stars
          var vote = movie.vote_average;
          var stars_rating = Math.round(vote/2);
          movie.stars = getStarRating(stars_rating);
          vote = stars_rating;
          movie.card = type;

          // add lang parameters form lang.js
          var lang_code = movie.original_language;
          var lang_name = getLanguageName(lang_code);//function from lang.js
          movie.lang_name = lang_name ;

          movie.overview = getOverview(movie);
          movie.film = getCardType(movie,type);
          movie.poster = getPosterImage(movie, type)[0];
          movie.image_not_found= getPosterImage(movie, type)[1];

          // Append Handlebars template compiled to body--
          var cardHTML = compiled(movie);

          if(type == "movie"){
            $('#container_movie').append(cardHTML);
          } else{
            $('#container_tv').append(cardHTML);
          }

          getActors(type,id,my_api_key);
          getGenre(type,my_api_key,genre_ids,id);
        }// Main for cycle end

      } else{
        if (type === "movie"){
          alert ("no film Found");

        } else{
          alert ("no serie Found");
        }
      }
    }, //end of object - success

    error: function(errors){
      var errors = errors['status'];
      console.log("errore searchThroughMovieApi "+errors);
    }
  });
}

// -----start new function---------------------------
function getCardType(movie,type){
  if (type === "movie"){
    movie.film = "film" ;
    return movie.film;
  } else{
    movie.film="tv_serie";
    return movie.film;
  }
}

// -----start new function---------------------------
function getActors(type,id,my_api_key){

  $.ajax({
    url: 'https://api.themoviedb.org/3/'+type+'/'+ id +'/credits',

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
        }
    },

    error: function(errors){
      var errors = errors['status'];
      console.log("Errore getActors "+errors);
    }
  });
}

// -----start new function---------------------------
function getGenre(type,my_api_key,genre_ids,id){

  $.ajax({
    url: 'https://api.themoviedb.org/3/genre/'+type+'/list?api_key=8de22b0db5bf3f29ea5ff07f53e09484&language=it',

    method: "GET",

    success: function(data, state){

        var this_id = $('li[data-id = "'+id+'"]');
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
function getOverview(movie){
  if(movie.overview.length == 0){
    movie.overview = "No overview for this title";
    return movie.overview;
  } else{
    return movie.overview;
  }
}

// -----start new function---------------------------
function getPosterImage(movie, type){
  var not = movie.image_not_found;
  var dim = "w342";
  var url = movie.poster_path;

  // if no poster images found
  if (url === null) {
    if(type === "movie"){
      var poster = "img/w342.jpg";
      not_movie_img = movie.original_title;
      return [poster, not_movie_img];

    } else{
      var poster = "img/w342.jpg";
      not_movie_img = movie.original_name;
      return [poster, not_movie_img];
    }

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
  $(document).on("mouseenter",'.container li.movie', function(){
    $(this).children('img.poster , .image_not_found').fadeOut("fast");
  });
}

// -----start new function---------------------------
function onMouseLeave(){
  console.log("enter content");
  $(document).on("mouseleave",'.container li.movie', function(){
    $(this).children('img.poster, .image_not_found').fadeIn("fast");
  });
}

// MAIN FUNCTION CONTAINER ------------------------
function init(){
  onClickInput();
  onMouseEnter();
  onMouseLeave();
}

// 1) Document Ready-----
$(document).ready(init);
