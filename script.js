// okay so this is my script for the form
// i will check each input one by one
// no regex because regex is confusing lol

// first lets grab all the elements we need
var fullNameInput = document.getElementById("fullName");
var emailInput = document.getElementById("email");
var phoneInput = document.getElementById("phone");
var roleInput = document.getElementById("role");
var experienceInput = document.getElementById("experience");
var portfolioInput = document.getElementById("portfolio");
var coverLetterInput = document.getElementById("coverLetter");

// grab all the buttons
var allNextButtons = document.querySelectorAll(".next-btn");
var allPrevButtons = document.querySelectorAll(".prev-btn");
var submitButton = document.getElementById("submit-btn");
var resetButton = document.getElementById("reset-btn");

// grab the progress bar
var progressBar = document.getElementById("progress-bar");

// grab the step divs
var step1 = document.getElementById("step-1");
var step2 = document.getElementById("step-2");
var step3 = document.getElementById("step-3");

// grab the step indicator dots at the top
var stepDots = document.querySelectorAll(".step");

// keep track of which step we are on
var currentStep = 1;

// mouse glow effect thing
var mouseGlow = document.getElementById("mouse-glow");

document.addEventListener("mousemove", function (e) {
  mouseGlow.style.left = e.clientX + "px";
  mouseGlow.style.top = e.clientY + "px";
});

// =====================
// VALIDATION FUNCTIONS
// =====================

// check if full name is good
// it needs at least 2 words (first and last name)
function checkFullName() {
  var value = fullNameInput.value;

  // remove extra spaces from both sides
  value = value.trim();

  // if empty, bad
  if (value.length === 0) {
    return false;
  }

  // split by space to count words
  var words = value.split(" ");

  // filter out empty strings in case there are double spaces
  var realWords = [];
  for (var i = 0; i < words.length; i++) {
    if (words[i].length > 0) {
      realWords.push(words[i]);
    }
  }

  // need at least 2 words
  if (realWords.length < 2) {
    return false;
  }

  // each word should only have letters (and maybe hyphens for names like mary-jane)
  for (var j = 0; j < realWords.length; j++) {
    var word = realWords[j];
    for (var k = 0; k < word.length; k++) {
      var letter = word[k];
      var charCode = letter.charCodeAt(0);

      // check if its a letter (uppercase or lowercase) or hyphen
      var isUppercase = charCode >= 65 && charCode <= 90;
      var isLowercase = charCode >= 97 && charCode <= 122;
      var isHyphen = letter === "-";

      if (!isUppercase && !isLowercase && !isHyphen) {
        return false;
      }
    }
  }

  return true;
}

// check if email looks right
// an email needs to have an @ sign and a dot after the @
function checkEmail() {
  var value = emailInput.value.trim();

  if (value.length === 0) {
    return false;
  }

  // find the @ sign
  var atPosition = -1;
  for (var i = 0; i < value.length; i++) {
    if (value[i] === "@") {
      atPosition = i;
      break;
    }
  }

  // no @ sign found
  if (atPosition === -1) {
    return false;
  }

  // @ cant be the first character
  if (atPosition === 0) {
    return false;
  }

  // get the part after the @
  var afterAt = value.substring(atPosition + 1);

  // part after @ cant be empty
  if (afterAt.length === 0) {
    return false;
  }

  // need a dot somewhere after the @
  var dotPosition = -1;
  for (var j = 0; j < afterAt.length; j++) {
    if (afterAt[j] === ".") {
      dotPosition = j;
      break;
    }
  }

  if (dotPosition === -1) {
    return false;
  }

  // dot cant be right at the start of afterAt
  if (dotPosition === 0) {
    return false;
  }

  // there needs to be something after the dot too
  var afterDot = afterAt.substring(dotPosition + 1);
  if (afterDot.length === 0) {
    return false;
  }

  return true;
}

// check phone number
// just needs to be 10 digits, nothing else
function checkPhone() {
  var value = phoneInput.value.trim();

  if (value.length === 0) {
    return false;
  }

  // remove dashes and spaces so people can type like 123-456-7890
  var cleanNumber = "";
  for (var i = 0; i < value.length; i++) {
    var char = value[i];
    if (char !== "-" && char !== " " && char !== "(" && char !== ")") {
      cleanNumber += char;
    }
  }

  // must be exactly 10 characters
  if (cleanNumber.length !== 10) {
    return false;
  }

  // all characters must be digits (0-9)
  for (var j = 0; j < cleanNumber.length; j++) {
    var charCode = cleanNumber.charCodeAt(j);
    var isDigit = charCode >= 48 && charCode <= 57;
    if (!isDigit) {
      return false;
    }
  }

  return true;
}

// check if a role is selected
function checkRole() {
  var value = roleInput.value;
  if (value === "" || value === null) {
    return false;
  }
  return true;
}

// check years of experience
// must be a number between 0 and 50
function checkExperience() {
  var value = experienceInput.value.trim();

  if (value.length === 0) {
    return false;
  }

  // convert to a number
  var number = Number(value);

  // if it cant be converted its NaN
  if (isNaN(number)) {
    return false;
  }

  // must be between 0 and 50
  if (number < 0 || number > 50) {
    return false;
  }

  return true;
}

// check portfolio url
// needs to start with http:// or https://
// and have at least a dot somewhere after that
function checkPortfolio() {
  var value = portfolioInput.value.trim();

  if (value.length === 0) {
    return false;
  }

  // check if it starts with https://
  var startsWithHttps = true;
  var httpsPrefix = "https://";
  if (value.length < httpsPrefix.length) {
    startsWithHttps = false;
  } else {
    for (var i = 0; i < httpsPrefix.length; i++) {
      if (value[i] !== httpsPrefix[i]) {
        startsWithHttps = false;
        break;
      }
    }
  }

  // check if it starts with http://
  var startsWithHttp = true;
  var httpPrefix = "http://";
  if (value.length < httpPrefix.length) {
    startsWithHttp = false;
  } else {
    for (var j = 0; j < httpPrefix.length; j++) {
      if (value[j] !== httpPrefix[j]) {
        startsWithHttp = false;
        break;
      }
    }
  }

  // must start with one of them
  if (!startsWithHttps && !startsWithHttp) {
    return false;
  }

  // get the domain part (everything after the ://)
  var domainPart = "";
  if (startsWithHttps) {
    domainPart = value.substring(httpsPrefix.length);
  } else {
    domainPart = value.substring(httpPrefix.length);
  }

  // domain cant be empty
  if (domainPart.length === 0) {
    return false;
  }

  // domain needs a dot in it
  var hasDot = false;
  for (var k = 0; k < domainPart.length; k++) {
    if (domainPart[k] === ".") {
      hasDot = true;
      break;
    }
  }

  if (!hasDot) {
    return false;
  }

  return true;
}

// check cover letter
// needs at least 20 characters
function checkCoverLetter() {
  var value = coverLetterInput.value.trim();
  if (value.length < 20) {
    return false;
  }
  return true;
}

// ==============================
// HELPER FUNCTIONS FOR THE UI
// ==============================

// show a field as valid (green checkmark)
function markValid(inputElement) {
  var wrapper = inputElement.parentElement; // the input-wrapper div
  var group = wrapper.parentElement; // the form-group div

  wrapper.classList.add("valid");
  wrapper.classList.remove("invalid");
  group.classList.remove("error");
}

// show a field as invalid (red X)
function markInvalid(inputElement) {
  var wrapper = inputElement.parentElement;
  var group = wrapper.parentElement;

  wrapper.classList.remove("valid");
  group.classList.add("error");
}

// reset a field back to normal (no colors)
function markNeutral(inputElement) {
  var wrapper = inputElement.parentElement;
  var group = wrapper.parentElement;

  wrapper.classList.remove("valid");
  wrapper.classList.remove("invalid");
  group.classList.remove("error");
}

// enable a button
function enableButton(btn) {
  btn.classList.remove("disabled");
  btn.disabled = false;
}

// disable a button
function disableButton(btn) {
  btn.classList.add("disabled");
  btn.disabled = true;
}

// ==============================
// REAL TIME CHECKING
// these functions run as you type
// ==============================

// step 1 fields
fullNameInput.addEventListener("input", function () {
  if (fullNameInput.value.trim().length === 0) {
    markNeutral(fullNameInput);
  } else if (checkFullName()) {
    markValid(fullNameInput);
  } else {
    markInvalid(fullNameInput);
  }
  checkIfStep1IsComplete();
});

emailInput.addEventListener("input", function () {
  if (emailInput.value.trim().length === 0) {
    markNeutral(emailInput);
  } else if (checkEmail()) {
    markValid(emailInput);
  } else {
    markInvalid(emailInput);
  }
  checkIfStep1IsComplete();
});

phoneInput.addEventListener("input", function () {
  if (phoneInput.value.trim().length === 0) {
    markNeutral(phoneInput);
  } else if (checkPhone()) {
    markValid(phoneInput);
  } else {
    markInvalid(phoneInput);
  }
  checkIfStep1IsComplete();
});

// step 2 fields
roleInput.addEventListener("change", function () {
  if (checkRole()) {
    markValid(roleInput);
  } else {
    markInvalid(roleInput);
  }
  checkIfStep2IsComplete();
});

experienceInput.addEventListener("input", function () {
  if (experienceInput.value.trim().length === 0) {
    markNeutral(experienceInput);
  } else if (checkExperience()) {
    markValid(experienceInput);
  } else {
    markInvalid(experienceInput);
  }
  checkIfStep2IsComplete();
});

portfolioInput.addEventListener("input", function () {
  if (portfolioInput.value.trim().length === 0) {
    markNeutral(portfolioInput);
  } else if (checkPortfolio()) {
    markValid(portfolioInput);
  } else {
    markInvalid(portfolioInput);
  }
  checkIfStep2IsComplete();
});

// step 3 fields
coverLetterInput.addEventListener("input", function () {
  if (coverLetterInput.value.trim().length === 0) {
    markNeutral(coverLetterInput);
  } else if (checkCoverLetter()) {
    markValid(coverLetterInput);
  } else {
    markInvalid(coverLetterInput);
  }
  checkIfStep3IsComplete();
});

// ==============================
// STEP COMPLETION CHECKS
// enable the next button only when all fields in a step are valid
// ==============================

function checkIfStep1IsComplete() {
  var nameOk = checkFullName();
  var emailOk = checkEmail();
  var phoneOk = checkPhone();

  // get the next button inside step 1
  var nextBtn = step1.querySelector(".next-btn");

  if (nameOk && emailOk && phoneOk) {
    enableButton(nextBtn);
  } else {
    disableButton(nextBtn);
  }
}

function checkIfStep2IsComplete() {
  var roleOk = checkRole();
  var expOk = checkExperience();
  var portfolioOk = checkPortfolio();

  var nextBtn = step2.querySelector(".next-btn");

  if (roleOk && expOk && portfolioOk) {
    enableButton(nextBtn);
  } else {
    disableButton(nextBtn);
  }
}

function checkIfStep3IsComplete() {
  var coverOk = checkCoverLetter();

  if (coverOk) {
    enableButton(submitButton);
  } else {
    disableButton(submitButton);
  }
}

// ==============================
// STEP NAVIGATION
// ==============================

// update the progress bar and step indicators
function updateProgress(stepNumber) {
  // step 1 = 0%, step 2 = 50%, step 3 = 100%
  var progressPercent = 0;
  if (stepNumber === 1) {
    progressPercent = 0;
  } else if (stepNumber === 2) {
    progressPercent = 50;
  } else if (stepNumber === 3) {
    progressPercent = 100;
  }

  progressBar.style.width = progressPercent + "%";

  // update the step dots
  for (var i = 0; i < stepDots.length; i++) {
    var dot = stepDots[i];
    var dotStep = parseInt(dot.getAttribute("data-step"));

    dot.classList.remove("active");
    dot.classList.remove("completed");

    if (dotStep === stepNumber) {
      dot.classList.add("active");
    } else if (dotStep < stepNumber) {
      dot.classList.add("completed");
    }
  }
}

// go to a specific step
function goToStep(newStep) {
  // hide current step
  var currentStepDiv = document.getElementById("step-" + currentStep);
  currentStepDiv.classList.remove("active");

  // show new step
  var newStepDiv = document.getElementById("step-" + newStep);
  newStepDiv.classList.add("active");

  // update current step variable
  currentStep = newStep;

  // update the progress bar
  updateProgress(newStep);
}

// add click listeners to all next buttons
for (var i = 0; i < allNextButtons.length; i++) {
  allNextButtons[i].addEventListener("click", function () {
    if (currentStep < 3) {
      goToStep(currentStep + 1);
    }
  });
}

// add click listeners to all back buttons
for (var i = 0; i < allPrevButtons.length; i++) {
  allPrevButtons[i].addEventListener("click", function () {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  });
}

// ==============================
// FORM SUBMIT
// ==============================

var recruitmentForm = document.getElementById("recruitment-form");
var successScreen = document.getElementById("success-screen");
var formWrapper = document.getElementById("form-wrapper");

recruitmentForm.addEventListener("submit", function (event) {
  // stop the page from refreshing
  event.preventDefault();

  // double check everything is valid before submitting
  if (!checkCoverLetter()) {
    markInvalid(coverLetterInput);
    return;
  }

  // show loading spinner on button
  submitButton.classList.add("loading");
  disableButton(submitButton);

  // pretend we are sending to a server (fake 2 second delay)
  setTimeout(function () {
    submitButton.classList.remove("loading");

    // show success screen
    successScreen.classList.remove("hidden");

    // shoot confetti!!
    shootConfetti();
  }, 2000);
});

// ==============================
// CONFETTI!! (the fun part)
// ==============================

function shootConfetti() {
  var container = document.getElementById("confetti-container");

  // figure out the center of the screen
  // this is where all confetti will start from
  var centerX = window.innerWidth / 2;
  var centerY = window.innerHeight / 2;

  // make 120 confetti pieces
  for (var i = 0; i < 120; i++) {
    // create a div for each piece
    var piece = document.createElement("div");
    piece.classList.add("confetti");

    // start all pieces from the center of the screen
    piece.style.left = centerX + "px";
    piece.style.top = centerY + "px";

    // random colors
    var colors = ["#a855f7", "#d946ef", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ffffff"];
    var randomColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.backgroundColor = randomColor;

    // random size
    var size = Math.random() * 10 + 5;
    piece.style.width = size + "px";
    piece.style.height = size + "px";

    // random shape (some circles some squares)
    if (Math.random() > 0.5) {
      piece.style.borderRadius = "50%";
    }

    // we need each piece to fly out in a different direction from center
    // pick a random angle in degrees (0 to 360)
    var angle = Math.random() * 360;

    // pick a random distance to fly outward
    // some go far, some go not so far
    var distance = Math.random() * 400 + 100;

    // convert angle to x and y movement using math
    // angle 0 = right, 90 = down, 180 = left, 270 = up
    var angleInRadians = angle * (Math.PI / 180);
    var moveX = Math.cos(angleInRadians) * distance;
    var moveY = Math.sin(angleInRadians) * distance;

    // use a keyframe animation with a unique name for each piece
    // this lets us move it to the calculated spot AND make it fall down
    var animName = "confetti-fly-" + i;

    // add the keyframe to the page stylesheet
    var styleSheet = document.styleSheets[0];
    var keyframeRule = "@keyframes " + animName + " { "
      + "0%   { transform: translate(0, 0) rotate(0deg);   opacity: 1; } "
      + "60%  { opacity: 1; } "
      + "100% { transform: translate(" + moveX + "px, " + moveY + "px) rotate(720deg); opacity: 0; } "
      + "}";

    // try adding the rule, some browsers are picky so wrap in try/catch
    try {
      styleSheet.insertRule(keyframeRule, styleSheet.cssRules.length);
    } catch (e) {
      // oh well, the piece just wont animate if this fails
    }

    // apply the animation
    var flyTime = Math.random() * 1.5 + 0.8;
    piece.style.animationName = animName;
    piece.style.animationDuration = flyTime + "s";
    piece.style.animationTimingFunction = "ease-out";
    piece.style.animationFillMode = "forwards";

    // small random delay so they dont all pop at exact same time
    var delay = Math.random() * 0.3;
    piece.style.animationDelay = delay + "s";

    // make sure position is absolute so left/top works
    piece.style.position = "fixed";

    container.appendChild(piece);
  }

  // clean up confetti after 4 seconds
  setTimeout(function () {
    container.innerHTML = "";
  }, 4000);
}

// ==============================
// RESET BUTTON
// goes back to the beginning
// ==============================

resetButton.addEventListener("click", function () {
  // hide success screen
  successScreen.classList.add("hidden");

  // clear all the inputs
  fullNameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";
  roleInput.value = "";
  experienceInput.value = "";
  portfolioInput.value = "";
  coverLetterInput.value = "";

  // reset all the valid/invalid styling
  markNeutral(fullNameInput);
  markNeutral(emailInput);
  markNeutral(phoneInput);
  markNeutral(experienceInput);
  markNeutral(portfolioInput);
  markNeutral(coverLetterInput);

  // disable the next buttons again since fields are empty
  var nextBtnStep1 = step1.querySelector(".next-btn");
  var nextBtnStep2 = step2.querySelector(".next-btn");
  disableButton(nextBtnStep1);
  disableButton(nextBtnStep2);
  disableButton(submitButton);

  // go back to step 1
  currentStep = 2; // trick: set to 2 so goToStep(1) will hide step 2
  // actually lets just do it manually
  step1.classList.add("active");
  step2.classList.remove("active");
  step3.classList.remove("active");
  currentStep = 1;

  // reset the progress bar
  updateProgress(1);
});