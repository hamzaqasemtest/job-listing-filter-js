async function fetchData() {
  const response = await fetch("./data/data.json");
  const data = await response.json();
  return data;
}

function displayData(data) {
  const cardContainer = document.querySelector(".card-container");

  while (cardContainer.firstChild) {
    cardContainer.removeChild(cardContainer.firstChild);
  }

  if (data.length === 0) {
    const noResults = document.createElement("div");
    noResults.textContent = "No results found";
    cardContainer.appendChild(noResults);
    return;
  }


  data.forEach((job) => {
    const card = document.createElement("div");
    card.className = "card active";

    const taxonomyList = job.languages.concat(job.tools);

    const cardContent = document.createElement("div");
    cardContent.className = "card-content";

    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";

    const logo = document.createElement("img");
    logo.id = "logo";
    logo.src = job.logo;
    logo.alt = "Company Logo";
    imageContainer.appendChild(logo);

    const infoContainer = document.createElement("div");
    infoContainer.className = "info-container";

    const companyInfo = document.createElement("div");
    companyInfo.className = "company-info";

    const companyName = document.createElement("span");
    companyName.id = "company";
    companyName.className = "company-name";
    companyName.textContent = job.company;
    companyInfo.appendChild(companyName);

    if(job.new) {
      const isNew = document.createElement("span");
      isNew.id = "new";
      isNew.className = "new";
      isNew.textContent = "NEW!";
      companyInfo.appendChild(isNew);
  }
  
  if(job.featured) {
      const isFeatured = document.createElement("span");
      isFeatured.id = "featured";
      isFeatured.className = "featured";
      isFeatured.textContent = "FEATURED";
      companyInfo.appendChild(isFeatured);
   }

    infoContainer.appendChild(companyInfo);

    const position = document.createElement("div");
    position.id = "position";
    position.className = "job-title";
    position.textContent = job.position;
    infoContainer.appendChild(position);

    const jobDetails = document.createElement("div");
    jobDetails.className = "job-details";

    const postedAt = document.createElement("span");
    postedAt.id = "postedAt";
    postedAt.textContent = job.postedAt;
    jobDetails.appendChild(postedAt);

    const contract = document.createElement("span");
    contract.id = "contract";
    contract.textContent = job.contract;
    jobDetails.appendChild(contract);

    const location = document.createElement("span");
    location.id = "location";
    location.textContent = job.location;
    jobDetails.appendChild(location);

    infoContainer.appendChild(jobDetails);
    cardContent.appendChild(imageContainer);
    cardContent.appendChild(infoContainer);
    card.appendChild(cardContent);

    const taxonomy = document.createElement("div");
    taxonomy.id = "taxonomy-list";
    taxonomy.className = "taxonomy";
    const ul = document.createElement("ul");

    taxonomyList.forEach((item) => {
      const li = document.createElement("li");
      li.className = "taxonomy-term";
      li.textContent = item;
      ul.appendChild(li);
    });

    taxonomy.appendChild(ul);
    card.appendChild(taxonomy);
    cardContainer.appendChild(card);
  });
  document.querySelectorAll(".taxonomy-term").forEach((term) => {
    term.addEventListener("click", handleTaxonomyClick);
  });
}


let clickedTaxonomies = [];

function handleTaxonomyClick(e) {
  const clickedTaxonomy = e.target.textContent;
  if (!clickedTaxonomies.includes(clickedTaxonomy)) {
    clickedTaxonomies.push(clickedTaxonomy);
  }
  filterCards();
  displayClickedTaxonomies();
  document.querySelector("#reset-button").style.display = "block";
  document.querySelector("#clicked-taxonomies-wrapper").style.display = "flex";
}

function displayClickedTaxonomies() {
  const container = document.querySelector("#clicked-taxonomies");
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  clickedTaxonomies.forEach((taxonomy) => {
    const taxonomyElement = document.createElement("span");
    taxonomyElement.className = "taxonomy-term";
    taxonomyElement.textContent = taxonomy;
    taxonomyElement.addEventListener("click", () => {
      clickedTaxonomies = clickedTaxonomies.filter((t) => t !== taxonomy);
      displayClickedTaxonomies();
      filterCards();
    });
    container.appendChild(taxonomyElement);
  });
}



document.querySelector("#reset-button").addEventListener("click", () => {
  clickedTaxonomies = [];
  document.querySelector("#clicked-taxonomies-wrapper").style.display = "none";
  document.querySelector("#reset-button").style.display = "none";
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.style.display = "flex";
  });
  displayClickedTaxonomies();
});

async function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  const data = await fetchData();
  const filteredData = data.filter(
    (job) =>
      job.company.toLowerCase().includes(searchTerm) ||
      job.position.toLowerCase().includes(searchTerm) ||
      job.role.toLowerCase().includes(searchTerm) ||
      job.level.toLowerCase().includes(searchTerm) ||
      job.languages.join(" ").toLowerCase().includes(searchTerm) ||
      job.tools.join(" ").toLowerCase().includes(searchTerm)
  );
  displayData(filteredData);
}

document.querySelector("#search").addEventListener("input", handleSearch);

function filterCards() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const cardTaxonomyList = card.querySelector("#taxonomy-list").textContent;
    if (!clickedTaxonomies.every(taxonomy => cardTaxonomyList.includes(taxonomy))) {
      card.style.display = "none";
    } else {
      card.style.display = "flex";
    }
  });
}
