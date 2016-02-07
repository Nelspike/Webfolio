//= require_tree .
//= require jquery

/**
 * HashMap that contains all of the key stroke information.
 *
 */
var keyMap = {13: "menu", 37: "left", 38: "up", 39: "right", 40: "down",
  65: "left", 68: "right", 83: "down", 87: "up"};

var icons = ["me", "experience", "projects",
    "crest",
    "skills", "future", "hobbies"];

var buttons = $.map(icons, function(value, index) {
  if (index == 3) {
    return '<div class="bottom-button" data-crest=true>'
      + value + '</div>';
  }
  else if (index > 3) {
    return buildButton(value, index - 1);
  }

  return buildButton(value, index);
}).join(" ");

/**
 * Static Menu for Inner Pages.
 */
var crest = '<div class="bottom-button" data-crest=true>Crest</div>';
var bottom = '<div class="bottom-menu">' + buttons + '</div>';
var bottomBurger = '<div class="bottom-burger">' + crest + '</div>';

function buildButton(value, index) {
  var div = '<div class="bottom-button" id="';
  div += value + '" data-position="' + index + '">';

  div += '<div class="button-container">';
  div += '<span>' + value + '</span>';
  div += '</div>';

  div += '</div>';

  return div;
}

function contentUp(html, content) {
  TweenMax.to($(content), 1,
    {top: "-125%", onComplete: transformBody,
      onCompleteParams: [html, content], ease: Power4.easeInOut, y: 0}
  );
}

function contentDown(content) {
  var innerContent = content == ".content" ? $(".inner-content") : $(content);
  var marginTop = content == ".content" ? "8px" : "0px";
  TweenMax.to(innerContent, 1, {top: marginTop, ease: Power4.easeInOut, y:0});
}

/**
 * Sets the HTML of a given body to the requests HTML.
 *
 */
function transformBody(html, content) {
  var innerContent = content == ".content" ? $("body") : $(content);
  var toInsert = content == ".content" || html == "" ? html : $(html).html();

  innerContent.html(toInsert);

  if (content == ".content") {
    bindPage();
  }

  contentDown(content);
}

function getPage(current, element, content) {
  $.get("/statics/" + current + ".html", function(data) {
    var html = "";

    if (content == ".content") {
      html = '<div class="inner-content">' + data + bottom;
      html += bottomBurger + '</div>';
    }
    else {
      html = data;
    }

    TweenMax.to(element, 0.1,
      {
        background: "rgba(256, 256, 256, 1)",
        ease: Expo.easeInOut, y: 0,
        yoyo: true, repeat: 5,
        onComplete: contentUp, onCompleteParams: [html, content]
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
    getPage(current, $(".menu-image[data-position="+current+"]"), ".content");
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
    getPage($(this).data("position"), $(this), ".content");
    $(".selector").hide();
    $(".menu-image").unbind("click");
  });

  $(".menu-image").hover(function() {
    var position = $(this).data("position");
    $(".selector").detach().prependTo(".menu-image[data-position="+position+"]");
    $(".selector").data("position", position);
  });
}

function openNav() {
  var menu = $(".bottom-menu");
  if ($(window).width() < 1024) {
    TweenMax.to(menu, 1, {right: "0", ease: Power4.easeInOut, y:0});
  }
}

function closeNav() {
  var menu = $(".bottom-menu");
  if ($(window).width() < 1024) {
    TweenMax.to(menu, 1, {right: "-350px", ease: Power4.easeInOut, y:0});
  }
}

function bindPage() {
  $(".inner-content *")
    .not(".bottom-menu, .bottom-burger, .bottom-burger *")
    .click(closeNav);

  $(".bottom-button").click(function() {
    if (!$(this).data("crest")) {
      getPage($(this).data("position"), $(this), ".inner-page");
    }
    else {
      openNav();
    }
  });
}

$(document).ready(function() {
  handMovement();
  menuClick();
});
