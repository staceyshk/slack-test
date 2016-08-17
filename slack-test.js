var photoListing = [];
var currentPhoto;

//Start getting the photo set
var flickrPhotoSetUrl = 'https://api.flickr.com/services/rest/?method='
  +'flickr.photosets.getPhotos&api_key=f596922296cb3040def0a5b0cdd3eb7a&'
  +'photoset_id=72157641470493775&user_id=118690346%40N08&format=json&nojsoncallback=1';
getJSONForRequest(flickrPhotoSetUrl, getPhotoInfo, console.log);

//Getting the photo info (such as the title)
function getPhotoInfo(json) {
  var photoJson = json.photoset.photo;

  for (var i = 0; i < photoJson.length; i++) {
    var flickerInfoUrl = 'https://api.flickr.com/services/rest/?method='
      +'flickr.photos.getInfo&api_key=f596922296cb3040def0a5b0cdd3eb7a'
      +'&photo_id=12759547784&format=json&nojsoncallback=1';
    getJSONForRequest(flickerInfoUrl, addPhotoInfo, photoJson[i].id);   
  }
}

function addPhotoInfo(photoInfoJson, photoId) {
  photoListing.push({photoId: photoId, photoInfo: photoInfoJson});

  var flickrImageSizesUrl = 'https://api.flickr.com/services/rest/?method='
    +'flickr.photos.getSizes&api_key=f596922296cb3040def0a5b0cdd3eb7a'
    +'&photo_id={id}&format=json&nojsoncallback=1'
      .replace('{id}', photoId); 
  getJSONForRequest(flickrImageSizesUrl, addPhotoSizes, photoId);
}

// The images themselves come from a different api call
function addPhotoSizes(photoSizesJson, photoId) {
  // Add photos to array to load larger images later
  var photoObj = findPhotoObj(photoId)
  photoObj.photoSizes = photoSizesJson;

  var mainSection = document.getElementById('photo-section');
  var newDiv = document.createElement('div');
  newDiv.setAttribute('class', 'float-left');

  // Get the thumbnail size
  var newImg = document.createElement('img');
  newImg.setAttribute('src', photoSizesJson.sizes.size[3].source);
  newImg.onclick = imgClick;

  var input = document.createElement('input');
  input.setAttribute('type', 'hidden');
  input.setAttribute('name', 'id');
  input.setAttribute('value', photoId);

  var pNode = document.createElement('p');
  var textnode = document.createTextNode(photoObj.photoInfo.photo.title._content);  
  pNode.appendChild(textnode);

  newDiv.appendChild(newImg);
  newDiv.appendChild(input);
  newDiv.appendChild(pNode);  
  mainSection.appendChild(newDiv);
}

function imgClick(event) {
  var photoId = event.target.nextSibling.value;
  setOverlayImage(photoId);
}

function setOverlayImage(photoId) {
  var largerImg = document.getElementById('overlay-img');
  currentPhoto = findPhotoObj(photoId);

  // Get Medium size photo
  largerImg.setAttribute('src', currentPhoto.photoSizes.sizes.size[6].source);
  var prevBtn = document.getElementById('previous');
  prevBtn.onclick = previousPhoto;
  var nextBtn = document.getElementById('next');
  nextBtn.onclick = nextPhoto;
  // It takes a bit of time to show the image
  setTimeout(showLightbox, 500);
}

function showLightbox() {
  var el = document.getElementById('overlay');
	el.style.visibility = 'visible';
  document.getElementById('close').onclick = closeLightbox;
}

function closeLightbox() {
  var el = document.getElementById('overlay');
	el.style.visibility = 'hidden';
}

function findPhotoObj(photoId) {
  for (var i = 0; i < photoListing.length; i++) {
    if (photoListing[i].photoId === photoId) {
      return photoListing[i];
    }
  }

  return null;
}

function nextPhoto() {
  var currentIndex = photoListing.indexOf(currentPhoto); 
  var nextIndex = (currentIndex + 1 === photoListing.length) ? 0 : currentIndex + 1;
  console.log(nextIndex);
  setOverlayImage(photoListing[nextIndex].photoId);
}

function previousPhoto() {
  var currentIndex = photoListing.indexOf(currentPhoto);
  var previousIndex = (currentIndex - 1 < 0) ? photoListing.length - 1 : currentIndex - 1;
  console.log(previousIndex);
  setOverlayImage(photoListing[previousIndex].photoId);
}

//optional param id for any object you want embedded
function getJSONForRequest(url, success, objId) {
   var xhr = new XMLHttpRequest();
   xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        success(JSON.parse(xhr.responseText), objId);
      } else {
        error(xhr.responseText);
      }
    }
  };

  xhr.open('GET', url);
  xhr.send();
}
