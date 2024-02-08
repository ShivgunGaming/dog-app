document.addEventListener("DOMContentLoaded", function () {
  const generateButton = document.getElementById("generateButton");
  const likeButton = document.getElementById("likeButton");
  const dogImage = document.getElementById("dogImage");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const breedInfo = document.getElementById("breedInfo");
  const likesList = document.getElementById("likesList");
  const likedDogsContainer = document.getElementById("likedDogsContainer");
  const viewLikedDogsButton = document.getElementById("viewLikedDogsButton");
  const closeLikesButton = document.getElementById("closeLikesButton"); // Add reference to the close button

  const likedDogs = [];

  function updateLocalStorage() {
      localStorage.setItem("likedDogs", JSON.stringify(likedDogs));
  }

  generateButton.addEventListener("click", function () {
      showLoadingSpinner();
      getRandomDog();
  });

  likeButton.addEventListener("click", function () {
      const imageUrl = dogImage.src;
      if (imageUrl && !likedDogs.includes(imageUrl)) {
          likedDogs.push(imageUrl);
          updateLikesList();
          updateLocalStorage();
          showLikedDogs();
      }
  });

  viewLikedDogsButton.addEventListener("click", function () {
      showLikedDogs();
  });

  closeLikesButton.addEventListener("click", function () {
      hideLikedDogs();
  });

  function getRandomDog() {
      fetch("https://dog.ceo/api/breeds/image/random")
          .then((response) => response.json())
          .then((data) => {
              const imageUrl = data.message;
              dogImage.src = imageUrl;
              fetchBreedInfo(imageUrl);
          })
          .catch((error) => {
              console.error("Error fetching random dog:", error);
              hideLoadingSpinner();
          });
  }

  function updateLikesList() {
      likesList.innerHTML = "";

      likedDogs.forEach((likedDog) => {
          const likedImage = document.createElement("img");
          likedImage.src = likedDog;
          likedImage.alt = "Liked Dog";
          likesList.appendChild(likedImage);
      });
  }

  function fetchBreedInfo(imageUrl) {
      const breed = extractBreedFromUrl(imageUrl);
      if (breed) {
          fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
              .then((response) => response.json())
              .then((data) => {
                  const breedImageUrl = data.message;
                  breedInfo.textContent = `Breed: ${breed}`;
                  breedInfo.classList.remove("hidden");
                  hideLoadingSpinner();
              })
              .catch((error) => {
                  console.error("Error fetching breed info:", error);
                  hideLoadingSpinner();
              });
      } else {
          breedInfo.classList.add("hidden");
          hideLoadingSpinner();
      }
  }

  function extractBreedFromUrl(url) {
      const match = url.match(/breeds\/(.+)\//);
      return match ? match[1] : null;
  }

  function showLoadingSpinner() {
      loadingSpinner.classList.remove("hidden");
  }

  function hideLoadingSpinner() {
      loadingSpinner.classList.add("hidden");
  }

  function showLikedDogs() {
      likedDogsContainer.classList.remove("hidden");
  }

  function hideLikedDogs() {
      likedDogsContainer.classList.add("hidden");
  }

  // Initial dog image on page load
  getRandomDog();
});
