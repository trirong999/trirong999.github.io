document.addEventListener("DOMContentLoaded", function () {
  const url =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQFZT1IWuvf-kv1QACsHkLGlK2a3lStzcXuYxHgN8dZxZ30X2yA-B4IQUKG5b8LewukJ0xOdCH2j5jK/pub?output=csv";
  let allCards = [];
  let currentLanguage = "en"; // Default language is English

  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      const rows = data.split(/\r?\n/).slice(1);
      const container = document.getElementById("card-container");

      rows.forEach((row) => {
        if (row.trim()) {
          const cols = row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
          const card = document.createElement("li");
          card.className = "collection-01__item";
          card.dataset.category = cols[3].toLowerCase();
          card.dataset.title = cols[0].toLowerCase();
          card.dataset.en = cols[5]; // English description
          card.dataset.th = cols[6]; // Thai description
          card.dataset.cn = cols[7]; // Chinese description
          card.dataset.es = cols[8]; // Spanish description
          card.dataset.pt = cols[9]; // Portuguese description
          card.dataset.jp = cols[10]; // Japanese description
          card.dataset.ru = cols[11]; // Russian description
          card.dataset.hi = cols[12]; // Hindi description
          card.dataset.ko = cols[13]; // Korean description
          card.dataset.ar = cols[14]; // Arabic description
          card.dataset.bn = cols[15]; // Bengali description
          card.dataset.vi = cols[16]; // Vietnamese description
          card.dataset.de = cols[17]; // German description
          card.dataset.fr = cols[18]; // French description
          card.dataset.id = cols[19]; // Indonesian description
          card.dataset.it = cols[20]; // Italian description
          // Add more languages as needed

          card.innerHTML = `
            <div class="collection-01__item">
              <a target="_blank" href="${cols[2].replace(/"/g, "")}">
                <div class="collection-01__title-box">
                  <div class="collection-01__title-inner-box">
                    <img class="collection-01__logo" src="${cols[4].replace(
                      /"/g,
                      ""
                    )}" alt="${cols[0].replace(/"/g, "")} logo" />
                    <h3 class="collection-01__title">${cols[0].replace(
                      /"/g,
                      ""
                    )}</h3>
                  </div>
                  <div class="collection-01__rating">
                    <i class="far fa-star"></i>
                    <span class="collection-01__rating-text">${cols[1].replace(
                      /"/g,
                      ""
                    )}</span>
                  </div>
                </div>
                <div class="collection-01__image">
                  <img src="${cols[21].replace(
                    /"/g,
                    ""
                  )}" alt="${cols[0].replace(
            /"/g,
            ""
          )} screenshot" class="collection-01__screenshot">
                </div>
                <div class="collection-01__text content_box">
                  <p>${cols[currentLanguage]}</p>
                </div>
              </a>
            </div>
          `;

          allCards.push(card);
          container.appendChild(card);
        }
      });

      updateLanguage(); // Initial language update

      const tags = new Set();
      rows.forEach((row) => {
        if (row.trim()) {
          const cols = row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
          const categoryTags = cols[3]
            .toLowerCase()
            .split(";")
            .map((tag) => tag.trim());
          categoryTags.forEach((tag) => tags.add(tag));
        }
      });

      const sortedTags = Array.from(tags).sort((a, b) => a.localeCompare(b));
      const tagsContainer = document.getElementById("tag-buttons-container");
      sortedTags.unshift("all");
      sortedTags.forEach((tag) => {
        const button = document.createElement("button");
        button.classList.add("collection-01__tag-button");
        button.textContent = tag;
        button.dataset.category = tag;
        tagsContainer.appendChild(button);
      });

      tagsContainer.addEventListener("click", function (event) {
        const tag = event.target.dataset.category;
        if (!tag) return;

        tagsContainer
          .querySelectorAll(".collection-01__tag-button")
          .forEach((button) => {
            button.classList.remove("is-selected");
          });
        event.target.classList.add("is-selected");

        allCards.forEach((card) => {
          const cardTags = card.dataset.category
            .split(";")
            .map((tag) => tag.trim());
          if (tag === "all" || cardTags.includes(tag)) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
      });

      document
        .getElementById("search-input")
        .addEventListener("input", function () {
          const searchText = this.value.toLowerCase();
          allCards.forEach((card) => {
            const title = card.dataset.title;
            const text = card.dataset[currentLanguage].toLowerCase();
            const tags = card.dataset.category;

            if (
              title.includes(searchText) ||
              text.includes(searchText) ||
              tags.includes(searchText)
            ) {
              card.style.display = "block";
            } else {
              card.style.display = "none";
            }
          });

          tagsContainer
            .querySelectorAll(".collection-01__tag-button")
            .forEach((button) => {
              const tag = button.dataset.category.toLowerCase();
              if (tag.includes(searchText) || searchText === "") {
                button.style.display = "inline-block";
              } else {
                button.style.display = "none";
              }
            });
        });

      document
        .getElementById("hamburger-menu")
        .addEventListener("click", function () {
          this.classList.toggle("open");
          document
            .getElementById("tag-buttons-container")
            .classList.toggle("open");
        });

      // Language selection handling
      document
        .getElementById("language-select")
        .addEventListener("change", function () {
          currentLanguage = this.value;
          updateLanguage();
        });

      // Detect user's language by IP location
      detectUserLanguage();
    })
    .catch((error) => console.error("Error fetching data:", error));

  // Update language for all cards
  function updateLanguage() {
    allCards.forEach((card) => {
      const textElement = card.querySelector(".collection-01__text p");
      textElement.textContent = card.dataset[currentLanguage];
    });
  }

  // Detect user language using IPinfo.io
  function detectUserLanguage() {
    fetch("https://ipinfo.io/json?token=448d950a773bf6")
      .then((response) => response.json())
      .then((data) => {
        const country = data.country;
        let language = "en"; // Default to English

        switch (country) {
          case "TH":
            language = "th";
            break;
          case "CN":
            language = "cn";
            break;
          case "ES":
            language = "es";
            break;
          case "PT":
            language = "pt";
            break;
          case "JP":
            language = "jp";
            break;
          case "RU":
            language = "ru";
            break;
          case "IN":
            language = "hi";
            break;
          case "KR":
            language = "ko";
            break;
          case "SA":
            language = "ar";
            break;
          case "BD":
            language = "bn";
            break;
          case "VN":
            language = "vi";
            break;
          case "DE":
            language = "de";
            break;
          case "FR":
            language = "fr";
            break;
          case "ID":
            language = "id";
            break;
          case "IT":
            language = "it";
            break;
          // Add more cases as needed
        }

        document.getElementById("language-select").value = language;
        currentLanguage = language;
        updateLanguage();
      })
      .catch((error) => console.error("Error fetching IP info:", error));
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const backToTopButton = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
    }
  });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
