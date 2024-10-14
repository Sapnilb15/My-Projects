function calculateProbability() {
    const numPlayers = parseInt(document.getElementById("numPlayers").value);
    const card1Value = document.getElementById("card1").value;
    const card2Value = document.getElementById("card2").value;
    const card3Value = document.getElementById("card3").value;

    // Create a representation of your hand
    const playerHand = [card1Value, card2Value, card3Value];

    // Determine your hand rank
    const yourHandRank = determineHandRank(playerHand);

    // Get the probability of the player's hand and the probability of better hands
    const yourHandProbability = getHandProbability(yourHandRank);
    const betterHandProbability = getBetterHandProbability(yourHandRank);

    // Calculate probability of winning against all other players
    const winProbability = Math.pow(1 - betterHandProbability, numPlayers - 1);

    // Display the results
    document.getElementById("result").innerHTML = `
        Your Hand Rank: ${yourHandRank} <br>
        Probability of Your Hand: ${(yourHandProbability * 100).toFixed(2)}% <br>
        Probability of Winning: ${(winProbability * 100).toFixed(2)}%
    `;
}

// Probabilities based on the hand frequencies you provided
function getHandProbability(handRank) {
    const handProbabilities = {
        "Trail": 52 / 22100,  // 0.24% or 52/22,100
        "Pure Sequence": 48 / 22100,  // 0.22% or 48/22,100
        "Sequence": 720 / 22100,  // 3.26% or 720/22,100
        "Color": 1096 / 22100,  // 4.96% or 1096/22,100
        "Pair": 3744 / 22100,  // 16.94% or 3744/22,100
        "High Card": 16440 / 22100  // 74.39% or 16440/22,100
    };

    return handProbabilities[handRank] || 0;
}

// Cumulative probabilities of getting a better hand than the one you have
function getBetterHandProbability(handRank) {
    const cumulativeProbabilities = {
        "Trail": 0,  // Nothing is better than a Trail
        "Pure Sequence": 52 / 22100,  // Only Trail is better
        "Sequence": (52 + 48) / 22100,  // Trail and Pure Sequence are better
        "Color": (52 + 48 + 720) / 22100,  // Trail, Pure Sequence, Sequence are better
        "Pair": (52 + 48 + 720 + 1096) / 22100,  // Trail, Pure Sequence, Sequence, Color are better
        "High Card": (52 + 48 + 720 + 1096 + 3744) / 22100  // All other hands are better
    };

    return cumulativeProbabilities[handRank] || 0;
}

// Function to determine the player's hand rank
function determineHandRank(hand) {
    const suits = hand.map((_, index) => document.getElementById(`card${index + 1}Suit`).value);
    const uniqueCards = new Set(hand);
    const cardCounts = {};

    hand.forEach(card => {
        cardCounts[card] = (cardCounts[card] || 0) + 1;
    });

    const isFlush = new Set(suits).size === 1;  // Check if all suits are the same
    const values = hand.map(parseCardValue).sort((a, b) => a - b);

    const isSequential = values[2] - values[1] === 1 && values[1] - values[0] === 1;  // Check if the cards are sequential

    if (uniqueCards.size === 1) {
        return "Trail";  // All cards are the same (Three of a kind)
    } else if (isFlush && isSequential) {
        return "Pure Sequence";  // Same suit and sequential (Straight Flush)
    } else if (isSequential) {
        return "Sequence";  // Sequential but different suits (Straight)
    } else if (isFlush) {
        return "Color";  // Same suit but not sequential (Flush)
    } else if (Object.values(cardCounts).includes(2)) {
        return "Pair";  // Two cards of the same rank
    } else {
        return "High Card";  // No special combination
    }
}

function parseCardValue(card) {
    if (card === "A") return 14;  // Ace is the highest
    if (card === "K") return 13;
    if (card === "Q") return 12;
    if (card === "J") return 11;
    return parseInt(card);  // For number cards (2-10)
}
