
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

      if (movies.length>0){
        console.log(movies,"movies");

        // Handlebars section-----------------------
        var template = $('#template').html();
        var compiled = Handlebars.compile( template);

        // starting FOR cycle through movies
        for (var i = 0; i < movies.length; i++) {
          var movie = movies[i];
          var movie_serie = movies[i];
          var id = movie['id'];

          // get vote parameters and switch them to font-awesome stars
          var vote = movie['vote_average'];
          var stars_rating = Math.round(vote/2);
          movie.stars = starRatingfunction(stars_rating);
          movie['vote_average'] = stars_rating;
          // add lang parameters form lang.js
          var lang_code = movie["original_language"];
          var lang_name = getLanguageName(lang_code);//function from lang.js
          movie['lang_name'] = lang_name ;

          movie['film'] = "film" ;
          movie['poster'] = getPosterImage(movie_serie)[0];
          movie['image_not_found']= getPosterImage(movie_serie)[1];
          // Append Handlebars template compiled to body--
          var cardHTML = compiled(movie);
          target.append(cardHTML);
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

        // starting FOR cycle through tv-series
        for (var i = 0; i < tv_series.length; i++) {
          var serie = tv_series[i];
          var movie_serie = tv_series[i];
          var id = serie['id'];

          // get vote parameters and switch them to font-awesome stars
          var vote = serie['vote_average'];
          var stars_rating = Math.round(vote/2);
          serie.stars = starRatingfunction(stars_rating);
          serie['vote_average'] = stars_rating;
          // add lang parameters form lang.js
          var lang_code = serie["original_language"];
          var lang_name = getLanguageName(lang_code);//function from lang.js
          serie['lang_name'] = lang_name ;

          serie['tv-show'] = "tv-show" ;

          // insert poster image

          serie['poster'] = getPosterImage(movie_serie)[0];
          serie['image_not_found']= getPosterImage(movie_serie)[2];

          // Append Handlebars template compiled to body--          var tvHTML = compiled(serie);
          var tvHTML = compiled(serie);
          target.append(tvHTML);
        } // end of FOR cycle through movies

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
function getPosterImage(movie_serie){
  var not = movie_serie["image_not_found"];
  var dim = "w342";
  // var dim = "w185";
  var url = movie_serie["poster_path"];

  // if no poster images found
  if (url === null){
    var poster = "img/w185.jpg";
    not_movie_img = movie_serie['original_title'];
    not_serie_img = movie_serie['original_name'];
    return [poster, not_movie_img,not_serie_img];

  }else{
    var poster = "https://image.tmdb.org/t/p/" + dim + url;
    not = "";
    return [poster, not];
    }
}

// -----start new function---------------------------

function starRatingfunction(stars_rating){

  var star_list ="";
  for (var j = 0; j < 5; j++){
    if(j < stars_rating){
      star_list += "<i class='yellow fas fa-star'></i>";
    }else{
      star_list += "<i class='far fa-star'></i>";
    }
  }return star_list;
}

function mouseEnterDropdown(){
  var parent_dropdown =  $('#navbar-content .link .parent_dropdown');

  // function when mouse enter on the parent-dropdown
  parent_dropdown.on('mouseenter', function() {//when mouse over the class parent_dropdown
      $(this).children('span').addClass('color');
      $(this).children('.dropdown').addClass('active');
      $(this).children('.dropdown').removeClass('hidden'); //make the dropdown of this element visible
  });
}

function mouseEnterContent(){
  console.log("enter content");
  $(document).on("mouseenter",'#container li.movie', function(){
    $(this).children('img.poster').fadeOut("fast");
  });
}

function mouseLeaveContent(){
  console.log("enter content");
  $(document).on("mouseleave",'#container li.movie', function(){
    $(this).children('img.poster').fadeTo("slow",1);
  });
}

// MAIN FUNCTION CONTAINER ------------------------

function init(){
  getInputValue();
  mouseEnterContent();
  mouseLeaveContent();
  // inputContentRequest();

}

// 1) Document Ready-----
$(document).ready(init);
