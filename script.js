
let pattern = [0,0,0,0,0,0,0,0];
let progress = 0; // index into pattern, 0 to 7. determines what level the player is at in the game
let gamePlaying = false;
let tonePlaying = false;
let volume = 0.5;  //must be between 0.0 and 1.0
let clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
let guessCounter = 0;
let strikes = 3;

let strikeCounter = document.getElementById("strikes");

function startGame(){
    //initialize game variables
    progress = 0;
    guessCounter = 0; 
    clueHoldTime = 1000;
    strikes = 3
    gamePlaying = true;
    strikeCounter.textContent = `Strikes: ${strikes}`
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    for(let i=0; i<pattern.length; i++) {
      pattern[i] = Math.floor(Math.random() * 4) + 1
    } 
    playClueSequence();
}

function stopGame() {
    gamePlaying = false;
    document.getElementById("startBtn").classList.remove("hidden");  
    document.getElementById("stopBtn").classList.add("hidden");
}
function lightButton(btn){
  document.getElementById("b"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("b"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  context.resume()
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
  clueHoldTime-=100
  
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  
  if(pattern[guessCounter] == btn) {
    if(guessCounter == progress){
      if(progress < pattern.length - 1){
        progress++; // determines how far into the game we are
        playClueSequence();
        return;
      } 
      else {
        winGame();
        return;
      }
    } 
    else {
      guessCounter++;
      return;
    }
  } 
  if(--strikes == 0) {
    strikeCounter.textContent = `Strikes: ${strikes}`;
    loseGame();
    return;
  }
  else {
    strikeCounter.textContent = `Strikes: ${strikes}`;
  }
  return;
}


// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
let AudioContext = window.AudioContext || window.webkitAudioContext 
let context = new AudioContext()
let o = context.createOscillator()
let g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Game Over. You win!");
}