var photosToDisplay = [];

var flickrPhotoSetUrl = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos'
  +'&api_key=30ef710092abe7a2283d14e000aa57f4&photoset_id=72157641470493775&user_id=118690346%40N08'
  +'&format=json&nojsoncallback=1&auth_token=72157671571015091-175567590ea4bb84&api_sig=6d1c45c8929c9b3f4e551d04d42db351';
getJSONForRequest(flickrPhotoSetUrl, getPhotoInfo, console.log);

function getPhotoInfo(json) {
  var photoJson = json.photoset.photo;

  for (var i = 0; i < photoJson.length; i++) {
    var flickrImageInfoUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&'
      +'api_key=30ef710092abe7a2283d14e000aa57f4&photo_id={id}&format=json&nojsoncallback=1'
      .replace('{id}', photoJson[i].id);

      getJSONForRequest(flickrImageInfoUrl, addImageList);
  }
}

function addImageList() {
  
}

function getJSONForRequest(url, success, error) {
   var xhr = new XMLHttpRequest();
   xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        success(JSON.parse(xhr.responseText));
      } else {
        error(xhr.responseText);
      }
    }
  };

  xhr.open('GET', url);
  xhr.send();
}
