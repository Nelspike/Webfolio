//= require_tree .
//= require jquery

/**
 * HashMap that contains all of the key stroke information.
 *
 */
var keyMap = {37: "left", 38: "up", 39: "right", 40: "down",
  65: "left", 68: "right", 83: "down", 87: "up"};

/**
 * Moves the selector from one position to another.
 */
function handPosition(current, key) {
  var next = 0;
  switch(key) {
    case "left":
      next = current % 2 == 0 ? current + 1 : current - 1;
      break;
    case "right":
      next = current % 2 == 0 ? current + 1 : current - 1;
      break;
    case "up":
      next = current == 0 || current == 1 ? current + 4 : current - 2;
      break;
    case "down":
      next = current == 4 || current == 5 ? current - 4 : current + 2;
      break;
  }

  $(".selector").data("position", next);
  $(".selector").detach().prependTo(".menu-image[data-position="+next+"]");
}

/**
 * Controls the handler for the hand movement on the Main Menu.
 *
 */
function handMovement() {
  $(document).keydown(function(event) {
    var current = $(".selector").data("position");
    var key = keyMap[event.which];
    handPosition(current, key);
  });
}

$(document).ready(function() {
  handMovement();
});
