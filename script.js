const form = document.querySelector('#github-form');
const resultContainer = document.querySelector('#result');
const container = document.querySelector('.container');

// Error handling
function showError(message) {
  resultContainer.innerHTML = `
    <div class="error">${message}</div>
  `;
}

// Add fade-in effect to container
window.addEventListener('load', () => {
  container.classList.add('fade-in');
});

// Destructure input element to simplify code
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  resultContainer.innerHTML = '<div class="loading-spinner"></div>'; // add loading spinner

  const { value: username } = document.querySelector('#username'); // use destructuring assignment
  
  try {
    const data = await getUserData(username); // break up code into smaller functions

    resultContainer.innerHTML = ''; // remove loading spinner
    resultContainer.append(
      createAvatar(data),
      createName(data),
      createBio(data),
      createDetailsContainer(data)
    ); // use array destructuring and spread syntax to simplify code

    // Add slide-in effect to user information
    setTimeout(() => {
      document.querySelectorAll('.details-container').forEach((element) => element.classList.add('slide-in')); // use forEach instead of Array.from
    }, 100);
  } catch (error) {
    console.error(error);
    showError("User not found"); // use a generic error message
  }
});

// Separate function to fetch user data from API
async function getUserData(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.json();
  return data;
}

// Separate functions to create HTML elements
function createAvatar(data) {
  const avatarImg = document.createElement('img');
  avatarImg.classList.add('avatar');
  avatarImg.src = data.avatar_url;
  return avatarImg;
}

function createName(data) {
  const nameElem = document.createElement('div');
  nameElem.classList.add('name');
  nameElem.textContent = data.name || '-';
  return nameElem;
}

function createBio(data) {
  const bioElem = document.createElement('div');
  bioElem.classList.add('bio');
  bioElem.textContent = data.bio || '-';
  return bioElem;
}

function createDetailsContainer(data) {
  const { email, location, followers, following, public_repos } = data; // use destructuring to simplify code
  const detailsContainer = document.createElement('div');
  detailsContainer.classList.add('details-container');

  if (email) {
    const emailElem = document.createElement('div');
    emailElem.classList.add('email');
    emailElem.innerHTML = `Email: <a href="mailto:${email}">${email}</a>`;
    detailsContainer.appendChild(emailElem);
  }

  if (location) {
    const locationElem = document.createElement('div');
    locationElem.classList.add('location');
    locationElem.textContent = `Location: ${location}`;
    detailsContainer.appendChild(locationElem);
  }

  const followersElem = document.createElement('div');
  followersElem.classList.add('followers');
  followersElem.textContent = `Followers: ${followers || 0}`;
  detailsContainer.appendChild(followersElem);

  const followingElem = document.createElement('div');
  followingElem.classList.add('following');
  followingElem.textContent = `Following: ${following || 0}`;
  detailsContainer.appendChild(followingElem);

  const publicReposElem = document.createElement('div');
  publicReposElem.classList.add('public-repos');
  publicReposElem.textContent = `Public Repositories: ${public_repos || 0}`;
  detailsContainer.appendChild(publicReposElem);

  return detailsContainer;
}
