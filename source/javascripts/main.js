//= require_tree .
//= require jquery

/**
 * HashMap that contains all of the key stroke information.
 *
 */
var keyMap = {13: "menu", 37: "left", 38: "up", 39: "right", 40: "down",
  65: "left", 68: "right", 83: "down", 87: "up"};

var icons = ["Me", "University", "Projects",
    "Crest",
    "Experience", "Future", "Skills"];

var buttons = $.map(icons, function(value, index) {
  return '<div class="bottom-button">' + value + '</div>';
}).join(" ");

/**
 * Static Menu for Inner Pages.
 */
var bottom = '<div class="bottom-menu">' + buttons + '</div>';

function contentUp(html) {
  var content = $(".content");

  TweenMax.to(content, 1,
    {top: "-100%", onComplete: transformBody,
      onCompleteParams: [html], ease: Power4.easeInOut, y: 0}
  );
}

function contentDown() {
  var innerContent = $(".inner-content");
  TweenMax.to(innerContent, 1, {top: "8px", ease: Power4.easeInOut, y:0});
}

/**
 * Sets the HTML of a given body to the requests HTML.
 *
 */
function transformBody(html) {
  $("body").html(html);
  contentDown();
}

function getPage(current) {
  $.get("/statics/" + current + ".html", function(data) {
    var html = '<div class="inner-content">' + data + bottom + '</div>';
    var element = $('.menu-image[data-position="'+ current +'"]');

    TweenMax.to(element, 0.1,
      {
        background: "rgba(256,256,256,1)",
        ease: Expo.easeInOut, y: 0,
        yoyo: true, repeat: 5,
        onComplete: contentUp, onCompleteParams: [html]
      }
    );
  });
}


/**
 * Moves the selector from one position to another.
 *
 */
function handPosition(current, key) {
  var next = 0;
  var arrow = true;

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
    case "menu":
      arrow = !arrow;
      break;
  }

  if (arrow) {
    $(".selector").data("position", next);
    $(".selector").detach().prependTo(".menu-image[data-position="+next+"]");
  }
  else {
    getPage(current);
  }
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

function menuClick() {
  $(".menu-image").click(function() {
    getPage($(this).data("position"));
  });

  $(".menu-image").hover(function() {
    var position = $(this).data("position");
    $(".selector").detach().prependTo(".menu-image[data-position="+position+"]");
  });
}

$(document).ready(function() {
  handMovement();
  menuClick();
});
