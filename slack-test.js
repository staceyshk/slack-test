var photosToDisplay = [];

var flickrPhotoSetUrl = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=d06a651de2c308348be5326769d1ce47&photoset_id=72157641470493775&user_id=118690346%40N08&format=json&nojsoncallback=1&auth_token=72157672512471285-549666d282c2801a&api_sig=eb57fa32e171a8a4db3f0ac66f086a57';
getJSONForRequest(flickrPhotoSetUrl, getPhotoInfo, console.log);

function getPhotoInfo(json) {
  var photoJson = json.photoset.photo;

  for (var i = 0; i < photoJson.length; i++) {
    var flickrImageInfoUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=d06a651de2c308348be5326769d1ce47&photo_id={id}&format=json&nojsoncallback=1'
      .replace('{id}', photoJson[i].id);

      getJSONForRequest(flickrImageInfoUrl, addPhotoToList);
  }
}

function addPhotoToList(photoInfoJson) {
  var mainSection = document.getElementById('photo-section');
  var newImg = document.createElement("img");
  // Get the thumbnail size
  newImg.setAttribute("src", photoInfoJson.sizes.size[3].source);
  mainSection.appendChild(newImg);
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
