const suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];

suits.forEach((suit) => {
  const section = document.getElementById(suit);
  const container = section.querySelector(".card-container");

  values.forEach((value) => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = `Cards/card${suit}${value}.png`;
    img.alt = `${suit} ${value}`;

    card.appendChild(img);
    container.appendChild(card);
  });
});
