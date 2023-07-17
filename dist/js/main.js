window.addEventListener('load', init);

var words = [];

//Load words
async function load_words()
{
  return new Promise(resolve => {
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
      //  IE7+, Firefox, Chrome, Opera, Safari 
      xmlhttp=new XMLHttpRequest();
    }
    else
    {
      // IE6, IE5 
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
      if (xmlhttp.readyState==4 && xmlhttp.status==200)
      {
        
        if (navigator.userAgentData.platform === "Windows")
          words=xmlhttp.responseText.split("\r\n");
        else
          words=xmlhttp.responseText.split("\n");

        words = words.map(string => {
          const parts = string.split(" - ");
          return { acronym: parts[0], terms: parts[1] };
        });
        
        resolve('resolved');
      }
    }
    xmlhttp.open("GET","words.txt",true);
    xmlhttp.send();
  });
}

// Available Levels
const levels = {
  supereasy: 10,
  easy: 5,
  medium: 3,
  hard: 1
};

// To change level
const currentLevel = levels.supereasy;

let time = currentLevel;
let score = 0;
let isPlaying;

// DOM Elements
const wordInput = document.querySelector('#word-input');
const currentWord = document.querySelector('#current-word');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const message = document.querySelector('#message');
const seconds = document.querySelector('#seconds');
const highscoreDisplay = document.querySelector('#highscore');

// Initialize Game
async function init() {
  let result = await load_words();
  // Show number of seconds in UI
  seconds.innerHTML = currentLevel;
  // Load word from array
  showWord(words);
  // Start matching on word input
  wordInput.addEventListener('input', startMatch);
  // Call countdown every second
  setInterval(countdown, 1000);
  // Check game status
  setInterval(checkStatus, 50);

}

// Start match
function startMatch() {
  if (matchWords()) {
    isPlaying = true;
    time = currentLevel + 1;
    showWord(words);
    wordInput.value = '';
    score++;
  }
  
  // Highscore based on score value for Session Storage
  if (typeof sessionStorage['highscore'] === 'undefined' || score > sessionStorage['highscore']) {
    sessionStorage['highscore'] = score;
  } else {
    sessionStorage['highscore'] = sessionStorage['highscore'];
  }

  // Prevent display of High Score: -1
  if (sessionStorage['highscore'] >= 0) {
  highscoreDisplay.innerHTML = sessionStorage['highscore'];
  }

  // If score is -1, display 0
  if (score === -1) {
    scoreDisplay.innerHTML = 0;
  } else {
    scoreDisplay.innerHTML = score;
  }
}

// Match currentWord to wordInput
function matchWords() {
  
  let find = words.find(o => o.acronym === currentWord.innerHTML);

  if (wordInput.value === find.terms) {
    message.innerHTML = 'Correct!!!';
    return true;
  } else {
    message.innerHTML = '';
    return false;
  }
}

// Pick & show random word
function showWord(words) {
  // Generate random array index
  const randIndex = Math.floor(Math.random() * words.length);
  // Output random word
  currentWord.innerHTML = words[randIndex].acronym;
}

// Countdown timer
function countdown() {
  // Make sure time is not run out
  if (time > 0) {
    // Decrement
    time--;
  } else if (time === 0) {
    // Game is over
    isPlaying = false;
  }
  // Show time
  timeDisplay.innerHTML = time;
}

// Check game status
function checkStatus() {
  let find = words.find(o => o.acronym === currentWord.innerHTML);
  if (!isPlaying && time === 0) {
    message.innerHTML = 'Game Over!!! ' + find.terms;
    score = -1;
  }
}
