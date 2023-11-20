"use strict";

// Only register the service worker if they're supported.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(
    (registration) => {
      console.log("Service worker registration successful:", registration);
    },
    (error) => {
      console.error(`Service worker registration failed: ${error}`);
    },
  );
} else {
  console.error("Service workers are not supported.");
}

/* global webkitSpeechRecognition */
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var state = 0;
var speechRecognizer = null;
var lastUpdated = null;
var lineBreakWatcher = null;
var alreadyInsertedLineBreakThisSilence = false;
var isScrolledNearToEnd = true;
// The SpeechRecognizer will stop automatically if it hears nothing for some period of time.  This tracks whether we're supposed to be captioning, so that it can be automatically restarted.
var captioningEnabled = false;
var transcript = "";

const main_toggle = document.getElementById("toggle_captioning");
const interim = document.getElementById("interim");
const final = document.getElementById("final");
const scroller = document.getElementById("scroller");
const end_anchor = document.getElementById("end_of_transcript_anchor");
const mic_label = document.getElementById("mic_name");
const mic_indicator = document.getElementById("mic_indicator");
mic_indicator.style.display = "none";

var scrolledToEndObserver = new IntersectionObserver(
  (intersections) => {
    if (intersections[0]) {
      isScrolledNearToEnd = intersections[0].isIntersecting;
    } else {
      isScrolledNearToEnd = false;
    }
  },
  {
    root: scroller,
    rootMargin: "0px 0px 100px 0px",
  },
);
scrolledToEndObserver.observe(end_anchor);

main_toggle.onclick = (_event) => {
  if (state === 0) {
    captioningEnabled = true;
    start_captioning();
    main_toggle.textContent = "Stop Captioning";
  } else if (state === 1) {
    captioningEnabled = false;
    stop_captioning();
    main_toggle.textContent = "Start Captioning";
  }
};

function set_transcript_interim(text) {
  interim.innerText = text;
}

function clear_transcript_interim() {
  interim.innerText = "";
}

function append_transcript_final(text) {
  transcript = transcript + text;
  final.innerText = transcript;
}

function scroll_transcript_to_end() {
  end_anchor.scrollIntoView({
    behavior: "instant",
    // behavior: document.hidden ? "auto" : "smooth",
  });
}

function start_captioning() {
  state = 1;
  speechRecognizer = new SpeechRecognition();
  speechRecognizer.continuous = true;
  speechRecognizer.interimResults = true;
  speechRecognizer.lang = "en";
  try {
    speechRecognizer.start();
  } catch (e) {
    console.log(e);
  }
  if (navigator.mediaDevices) {
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          autoGainControl: false,
        },
      })
      .then((stream) => {
        if (stream) {
          const tracks = stream.getTracks();
          if (tracks) {
            mic_indicator.style.display = "inline-block";
            mic_label.textContent = "Mic: " + tracks[0].label;
            return;
          }
        }
        mic_label.textContent = "Did you grant mic permissions?";
      });
  }
  const micPermsTimeout = setTimeout(() => {
    console.log("User probably hasn't granted mic permissions");
    mic_label.textContent = "Did you grant mic permissions?";
  }, 200);
  speechRecognizer.onstart = () => {
    clearTimeout(micPermsTimeout);
    if (!lineBreakWatcher) {
      lineBreakWatcher = setInterval(() => {
        let now = Date.now();
        const msSinceLastResult = now - lastUpdated;

        if (
          lastUpdated &&
          msSinceLastResult >= 2 * 1000 &&
          !alreadyInsertedLineBreakThisSilence
        ) {
          alreadyInsertedLineBreakThisSilence = true;
          append_transcript_final("\n\n");
          if (isScrolledNearToEnd) {
            scroll_transcript_to_end();
          }
        }
        if (lastUpdated && msSinceLastResult >= 30 * 1000) {
          speechRecognizer.stop();
        }
      }, 750);
    }
  };
  speechRecognizer.onresult = (event) => {
    lastUpdated = Date.now();
    alreadyInsertedLineBreakThisSilence = false;
    let transcriptInterim = "";
    let transcriptFinal = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        transcriptFinal += event.results[i][0].transcript;
      } else {
        transcriptInterim += event.results[i][0].transcript;
      }
    }

    if (transcriptInterim) {
      set_transcript_interim(transcriptInterim);
    }
    if (transcriptFinal) {
      clear_transcript_interim();
      append_transcript_final(transcriptFinal);
    }
    if (isScrolledNearToEnd) {
      scroll_transcript_to_end();
    }
  };
  speechRecognizer.onend = (_event) => {
    console.log("speech recognition ended");
    clearInterval(lineBreakWatcher);
    lineBreakWatcher = null;
    lastUpdated = null;
    if (captioningEnabled) {
      console.log("automatically restarting");
      start_captioning();
    }
  };
}

function stop_captioning() {
  console.log("stop function called");
  state = 0;
  captioningEnabled = false;
  speechRecognizer.stop();
  mic_label.textContent = "";
  mic_indicator.style.display = "none";
}
