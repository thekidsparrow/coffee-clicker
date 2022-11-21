/* eslint-disable no-alert */

/***The line below allows us to access the data from the window object.
 * This comes from the data.js file***/


/***Before we can begin manipulating the DOM we need to gain access to two DOM Nodes***/
// 1. Declare a variable bigCoffee that holds reference to the element with id 'big_coffee'.
// your code here
const bigCoffee = document.getElementById('big_coffee');

// 2. Declare a variable producerContainer that holds reference to the element with id 'producer_container'.
// your code here
const producerContainer = document.getElementById('producer_container');

/***Don't worry about the specifics of the condition in this if statement for now.
 * Just follow the instructions in it to ensure the application has base functionality.
 * We'll discuss in depth later what process is, but it's not necessary just yet.***/
if (typeof process === 'undefined') {
  /********************
   *   Event Listeners
   ********************/

  /* 1. Add a 'click' event listener to the bigCoffee element(giant coffee emoji) you referenced above.
   * It should call the clickCoffee function below and be passed the global data object.*/
  // your code here
  bigCoffee.addEventListener('click', clickCoffee);

  /* 2. Add a 'click' event listener to the producerContainer(Coffee Producers panel) you referenced above.
   * It should call the buyButtonClick function below and be passed the browser event and global data object.*/
  // your code here
  producerContainer.addEventListener('click', buyButtonClick);

  // You don't need to edit this line of code. It calls the tick function passing in the data object every 1000ms or 1s.
  setInterval(() => tick(data), 1000);
}

// Now you're ready to start running the tests. Good luck!

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  document.getElementById('coffee_counter').innerText = coffeeQty;
}

function clickCoffee(data) {
  data.coffee++;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  producers.forEach(item => {
    if (coffeeCount >= (item.price / 2)) {
      item.unlocked = true;
    }
  });
}

function getUnlockedProducers(data) {
  return data.producers.filter((producer) => {
    return producer.unlocked === true;
  });
}

function makeDisplayNameFromId(id) {
  return id.replace(/^_*(.)|_+(.)/g, (s, c, d) => c ? c.toUpperCase() : ' ' + d.toUpperCase());
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  const producerContainer = document.getElementById('producer_container');

  deleteAllChildNodes(producerContainer);

  unlockProducers(data.producers, data.coffee);

  data.producers.forEach(item => {
    if (item.unlocked === true) {
      let producerDiv = makeProducerDiv(item);
      producerContainer.appendChild(producerDiv);
    }
  });
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  let producer = data.producers.filter(producer => producer.id === producerId);

  return producer[0];
}

function canAffordProducer(data, producerId) {
  let producer = getProducerById(data, producerId);

  return data.coffee > producer.price;
}

function updateCPSView(cps) {
  document.getElementById("cps").innerText = cps;
}

function updatePrice(oldPrice) {
  return parseInt(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  let producer = getProducerById(data, producerId);
  let canAfford = canAffordProducer(data, producerId);

  if (canAfford) {
    producer.qty++;
    data.coffee = data.coffee - producer.price;
    producer.price = updatePrice(producer.price);
    data.totalCPS = data.totalCPS + producer.cps;
  }

  return canAfford;
}

function buyButtonClick(event, data) {
  if (event.target.tagName === "BUTTON") {
    const producerId = event.target.id.slice(4);
    const result = attemptToBuyProducer(data, producerId);
    if (!result) {
      window.alert("Not enough coffee!");
    } else {
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    }
  }
}

function tick(data) {
  data.coffee = data.coffee + data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**********************************
 *  Congratulations! You did it!
 **********************************/

// You don't need to edit any of the code below
// If we aren't in a browser and are instead in node
// we'll need to export the code written here so we can import and
// run the tests in Mocha. More on this later.
// Don't worry if it's not clear exactly what's going on here.
if (typeof process !== 'undefined') {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}