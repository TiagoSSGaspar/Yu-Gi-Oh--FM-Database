let inputCard = document.getElementById("cardname");
let output = document.getElementById("output");
let informationCard = document.getElementById("info-card");
let searchMessage = document.getElementById("search-msg");
let resetBtn = document.getElementById("reset-btn");
let searchResultsBtn = document.getElementById("search-results-btn");
let searchNameBtn = document.getElementById("search-name-btn");
let titlesH2 = ["Fusions", "Equips On", "Rituals"];

function resultsClear() {
  output.innerHTML = "";
  informationCard.innerHTML = "";
  searchMessage.innerHTML = "";
}

function createHTMLDanger(input) {
  if (!input) {
    let firstMessage = `<div class="alert-danger">Please enter a valid search term</div>`;
    return firstMessage;
  } else {
    let secondMessage = `<div class="alert-danger">No results found for ${input}</div>`;
    return secondMessage;
  }
}

/** Display a card with information of the query released. */
function createSideCard(card) {
  if (!card.Id) {
    return "";
  }
  let modelCard = `
    <div class="relative  hover:opacity-95">
      <div class="relative h-72 w-full overflow-hidden rounded-lg">
        <img src="public/images/cards/${card.Id}.png"  alt="${card.Name}" class="h-full w-full object-cover object-center hover:scale-105">
      </div>
      <div class="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4 border">
        <div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"></div>
        <p class="relative text-lg font-semibold text-white">${card.Id}</p>
      </div>
    </div>
  `;

  return modelCard;
}

// Initialize awesomplete
var cardNameCompletion = new Awesomplete(inputCard, {
  list: card_db()
    .get()
    .map((c) => c.Name), // list is all the cards in the DB
  autoFirst: true, // The first item in the list is selected
  filter: Awesomplete.FILTER_STARTSWITH, // case insensitive from start of word
});
inputCard.onchange = function () {
  cardNameCompletion.select(); // select the currently highlighted item, e.g. if user tabs
};

/** Creates a div component with all the possibles fusions. */
function fusesToHTML(fuselist, title) {
  let pTagList = fuselist
    .map(function (fusion) {
      let pTag = `
          <li class="flex gap-x-4 py-5">
            <div class="min-w-0">
              <p class="text-sm font-semibold leading-6 text-gray-900">
                ${fusion.card1.Name} + ${fusion.card2.Name}
              </p>
              ${
                fusion.result
                  ? `<p class="text-sm font-semibold leading-6 text-emerald-700">${fusion.result.Name}</p>`
                  : ""
              }
            </div>
          </li>
        `;
      return pTag;
    })
    .join("\n");
  let cardDiv = `
    <div class="mt-4 w-full">
      <h3 class="text-base font-semibold leading-7">${title}</h3>
      <ul role="list" class="divide-y divide-gray-100 h-96 overflow-y-auto">
        ${pTagList}
      </ul>
    </div>
  `;
  return cardDiv;
}

function searchByName() {
  let card = getCardByName(inputCard.value);
  let cardP1 = getCardById(card.Id + 256);
  let cardP2 = getCardById(cardP1.Id + 256);
  if (!card) {
    searchMessage.innerHTML = createHTMLDanger(inputCard.value);
    return;
  } else {
    informationCard.innerHTML += createSideCard(card);
    informationCard.innerHTML += createSideCard(cardP1);
    informationCard.innerHTML += createSideCard(cardP2);
    let fusionResponse = hasFusions(card);
    let equipResponse = equipCard(card);

    if (fusionResponse) {
      let fuses = cardWithFusions(card);
      output.innerHTML += fusesToHTML(fuses, titlesH2[0]);
    }

    if (equipResponse) {
      let equips = cardWithEquips(card);
      output.innerHTML += fusesToHTML(equips, titlesH2[1]);
    } else {
      searchMessage.innerHTML = createHTMLDanger(inputCard.value);
      return;
    }
  }
}

function searchForResult() {
  let card = getCardByName(inputCard.value);
  let cardPossivel1 = getCardById(card.Id - 256);
  let cardPossivel2 = getCardById(cardPossivel1.Id - 256);
  if (!card) {
    searchMessage.innerHTML = createHTMLDanger(inputCard.value);
    return;
  } else {
    informationCard.innerHTML += createSideCard(card);
    informationCard.innerHTML += createSideCard(cardPossivel1);
    informationCard.innerHTML += createSideCard(cardPossivel2);

    let booleanResult = hasResult(card);
    if (booleanResult) {
      let results = resultsList[card.Id].map((f) => {
        return { card1: getCardById(f.card1), card2: getCardById(f.card2) };
      });
      output.innerHTML += fusesToHTML(results, titlesH2[0]);
    } else {
      searchMessage.innerHTML = createHTMLDanger(inputCard.value);
      return;
    }
  }
}

searchNameBtn.onclick = function () {
  let booleanResponse = checkInputValidation(inputCard);
  resultsClear();
  if (booleanResponse) {
    searchMessage.innerHTML = createHTMLDanger();
    return;
  } else {
    searchByName();
  }
};

searchResultsBtn.onclick = function () {
  let booleanResponse = checkInputValidation(inputCard);
  resultsClear();
  if (booleanResponse) {
    searchMessage.innerHTML = createHTMLDanger();
    return;
  } else {
    searchForResult();
  }
};

resetBtn.onclick = function () {
  resultsClear();
  inputCard.value = "";
};
