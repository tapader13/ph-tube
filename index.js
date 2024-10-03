let loadedVideos = [];

const categoriesSec = document.getElementById('categories');

async function getCategories() {
  const response = await fetch(
    'https://openapi.programming-hero.com/api/phero-tube/categories'
  );
  const data = await response.json();
  showCategories(data.categories);
}
getCategories();

async function getCategoriesVideos(id) {
  const response = await fetch(
    `https://openapi.programming-hero.com/api/phero-tube/category/${id}`
  );
  const data = await response.json();
  loadedVideos = [];
  loadedVideos.push(...data.category);
  showVideos(data.category);
}
function showCategories(categories) {
  for (const key of categories) {
    categoriesSec.innerHTML += `
     <button id="btn" class="bg-gray-200 p-2 rounded-md button">${key.category}</button>`;
  }

  categories.forEach((cat, i) => {
    document
      .querySelectorAll('#categories .button')
      [i].addEventListener('click', () => {
        const btns = document.querySelectorAll('#categories .button');
        btns.forEach((btn) => {
          btn.classList.add('bg-gray-200');
          btn.classList.remove('active');
        });
        btns[i].classList.remove('bg-gray-200');
        btns[i].classList.add('active');
        getCategoriesVideos(cat.category_id);
      });
    //
  });
}

async function showDetails(id) {
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${id}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const modal = document.getElementById('my_modal_1');
    const h3 = modal.querySelector('h3');
    const p = modal.querySelector('p');
    h3.textContent = data?.video?.authors[0]?.profile_name;
    p.textContent = data?.video?.description;
    modal.showModal();
  } catch (error) {
    console.log(error);
  }
}

const videos = document.getElementById('videos');

function showVideos(video) {
  videos.innerHTML = '';
  if (video.length === 0) {
    videos.innerHTML = `
    <div class="flex flex-col justify-center items-center w-full my-10">
    <img src="./Icon.png" alt="" />
    <h1 class="text-center text-2xl font-bold">No Video Found</h1>
    </div>`;
  }
  for (const key of video) {
    videos.innerHTML += `
    <div class="card bg-base-100 w-96 shadow-xl cursor-pointer">
  <figure>
    <img class="w-full h-[200px] object-cover"
      src=${key.thumbnail ? key.thumbnail : 'default-thumbnail.jpg'}
      alt="Shoes" />
  </figure>
  <div class="card-body">
   <div class="flex gap-3">
    <h2 class="">
      <img class="w-10 h-10 rounded-full" src=${
        key?.authors[0]?.profile_picture
      } alt="" />
    </h2>
   <div>  <h4 class="font-bold text-black">${key?.title}</h4>
   <p>${key?.authors[0]?.profile_name} ${
      key?.authors[0]?.verified === true
        ? '<span class="badge mx-2 badge-success">Verified</span>'
        : ''
    }</p>
   <p>${key?.others?.views} views</p>
   <button onclick="showDetails('${
     key.video_id
   }')" class="btn btn-neutral">details</button>
   </div>
   </div>
   
  </div>
</div>`;
  }
}

async function loadVideos() {
  const response = await fetch(
    ' https://openapi.programming-hero.com/api/phero-tube/videos'
  );
  const data = await response.json();
  loadedVideos.push(...data.videos);
  showVideos(data.videos);
}
loadVideos();

const search = document.getElementById('search');
if (!search.value.trim()) {
  search.addEventListener('keyup', async (e) => {
    console.log(e.target.value);
    const response = await fetch(
      `https://openapi.programming-hero.com/api/phero-tube/videos?title=${e.target.value}`
    );
    const data = await response.json();
    showVideos(data?.videos);
  });
}

console.log(loadedVideos);
const sort = document.getElementById('sort');
sort.addEventListener('click', () => {
  const sortedVideos = loadedVideos.sort((a, b) =>
    a.title.localeCompare(b.title)
  );
  showVideos(sortedVideos);
});
