/**
 * @file game.js
 * @game Chicken Crossroad
 * @author Diran Ojoodide
 * @date 2025-05-13
 * 
 * @description
 * Core game logic for the Chicken Crossroad. Handles character and obstacles movement, collision with obstacles, scoring, level progression.
 * 
 * @dependencies
 * -utility.js: Utility functions
 */

import startGame, {startPage, gameMusic} from './utility.js'


let startBtn = document.getElementById('start-btn');
let audioBtn = document.getElementById('audio-btn');
let audioIcon = document.getElementById('audio-icon');


window.addEventListener('DOMContentLoaded', () => {
    startBtn.addEventListener('click', () =>{
        startGame();
    });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && startPage.style.display !== 'none') {
      startGame();
    }
  });


  // Switching between audio and mute
  let music = true;
  audioBtn.addEventListener('click', () =>{
    if(music){
      gameMusic.pause();
      audioIcon.src = "/assets/Images/audio-off-svgrepo-com.svg";
      music = false;
    }else {
      gameMusic.play();
      audioIcon.src = "/assets/Images/audio-svgrepo-com.svg";
      music = true;
    }
  })


});