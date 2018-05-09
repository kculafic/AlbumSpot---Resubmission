$(document).ready(function() {
  'use strict';

  let albums = [];

  function emptyAlbumArr() {
    albums = [];
  }

  function modelData(e) {
    e.preventDefault();
    const search = $('#search').val();
    getLastFmData(search);
  }

  function getLastFmData(search) {
    let $xhr = $.getJSON(`http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${search}&limit=10&api_key=f7699d11f81610e3d8fe4c8d5207e11c&format=json`);

    $xhr.done(function(albumsData) {
      emptyAlbumArr();
      clearAlbumResults();
      const topAlbums = albumsData.topalbums.album

      for (let album of topAlbums) {
        let lp = {
          albumName: album.name,
          artistName: album.artist.name,
          artwork: album.image[3]['#text']
        }
        albums.push(lp);
      }
      renderAlbums(albums);
    });

    $xhr.fail(function(err) {
      console.log('Last FM Error');
    })
  }

  function goToDiscogs() {
    let $searchEl;
    $('#shopbutton').empty();
    $('#shopbutton').append('<a class="waves-effect waves-light btn-large #eeeeee grey lighten-3 black-text" type="submit" id="shop" name="action"><i class="material-icons left tiny">album</i>Shop</a>');
    var $searchField = $('#search').val();
    $searchEl = $searchField.replace(' ', '_');
    $('#shop').attr("href", `https://www.discogs.com/search/?q=${$searchEl}&type=master&format=vinyl`);

    $('#search').val('');

  }

  function clearAlbumResults() {
    $('#listings').empty();
  }

  function buildCards() {
    for (let album of albums) {
      let $column = $('<div class="col s12 m6 l6">');
      let $content = $('<div class="card-content center">');
      let $title = $('<h6 class="card-title truncate">');
      let $albumArtwork = $('<img class="artwork">');
      let $card = $('<div class="card hoverable">');

      $($title).attr({
        'data-position': 'top',
        'data-tooltip': (album.albumName)
      });


      $title.append(album.albumName)

      $($albumArtwork).attr({src: album.artwork});

      $content.append($title);
      $content.append($albumArtwork);
      
      $card.append($content);
      $column.append($card);

      $('#listings').append($column);
      $('#maincontainer').css({"padding-bottom" : "0%"});
    }
  }

  function renderAlbums(albums) {
    buildCards();
    goToDiscogs();
  };

  $('button').click(modelData);
});
