var photoListing = [];

var flickrPhotoSetUrl = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=d06a651de2c308348be5326769d1ce47&photoset_id=72157641470493775&user_id=118690346%40N08&format=json&nojsoncallback=1&auth_token=72157672512471285-549666d282c2801a&api_sig=eb57fa32e171a8a4db3f0ac66f086a57';
getJSONForRequest(flickrPhotoSetUrl, getPhotoInfo, console.log);

function getPhotoInfo(json) {
  var photoJson = json.photoset.photo;

  for (var i = 0; i < photoJson.length; i++) {
    var flickrImageInfoUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=d06a651de2c308348be5326769d1ce47&photo_id={id}&format=json&nojsoncallback=1'
      .replace('{id}', photoJson[i].id);

      getJSONForRequest(flickrImageInfoUrl, addPhotoToList, photoJson[i].id);
  }
}

function addPhotoToList(photoSizesJson, photoId) {
  // Add photos to array to load larger images later
  photoListing.push({photoId: photoId, photoSizes: photoSizesJson});

  var mainSection = document.getElementById('photo-section');
  var newSpan = document.createElement('span');
  newSpan.onclick = testImgClick;
  var newImg = document.createElement('img');
  // Get the thumbnail size
  newImg.setAttribute('src', photoSizesJson.sizes.size[3].source);
  var input = document.createElement('input');
  input.setAttribute('type', 'hidden');
  input.setAttribute('name', 'id');
  input.setAttribute('value', photoId);

  newSpan.appendChild(newImg);
  newSpan.appendChild(input);
  mainSection.appendChild(newSpan);
}

function testImgClick(event) {
  var photoId = event.target.nextSibling.value;
  var largerImg = document.getElementById('overlay-img');
  largerImg.setAttribute('src', findPhotoSizes(photoId).sizes.size[6].source);
  
  var el = document.getElementById('overlay');
	el.style.visibility = 'visible';
  el.onclick = closeLightbox;
}

function closeLightbox() {
  var el = document.getElementById('overlay');
	el.style.visibility = 'hidden';
}

function findPhotoSizes(photoId) {
  for (var i = 0; i < photoListing.length; i++) {
    if (photoListing[i].photoId === photoId) {
      return photoListing[i].photoSizes;
    }
  }

  return null;
}

//optional param id for any object you want embedded
function getJSONForRequest(url, success, arg) {
   var xhr = new XMLHttpRequest();
   xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        success(JSON.parse(xhr.responseText), arg);
      } else {
        error(xhr.responseText);
      }
    }
  };

  xhr.open('GET', url);
  xhr.send();
}
