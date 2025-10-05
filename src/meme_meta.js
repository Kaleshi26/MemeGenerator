// src/meme_meta.js
// Small map of known meme names -> description + keywords.
// Add more entries as you like. Keys are meme names as returned by imgflip API.
const memeMeta = {
  "Distracted Boyfriend": {
    description: "A man looks at another woman while his girlfriend looks shocked/angry — used for 'distracted by new thing' comparisons.",
    keywords: ["boyfriend", "girlfriend", "man", "woman", "distracted", "looking", "jealous", "cheating"]
  },
  "Drake Hotline Bling": {
    description: "Two-panel Drake meme — top panel: disapproval; bottom: approval. Used to contrast preferences.",
    keywords: ["drake", "hotline bling", "no", "yes", "approve", "disapprove", "preference"]
  },
  "Woman Yelling at a Cat": {
    description: "A woman dramatically yelling and a confused cat sitting at a table — used for arguments or exaggerated reactions.",
    keywords: ["woman", "yelling", "cat", "table", "angry", "screaming"]
  },
  "Two Buttons": {
    description: "Person sweating trying to pick between two buttons. Used where two choices are hard to pick.",
    keywords: ["two buttons", "choices", "decision", "sweating", "button", "choose"]
  },
  "Change My Mind": {
    description: "Man sitting at a table with a sign that invites debate — used for expressing controversial opinions or takes.",
    keywords: ["change my mind", "table", "sign", "opinion", "debate", "take"]
  },
  "Left Exit 12 Off Ramp": {
    description: "Car swerving off the highway to exit — used to show an abrupt change of choice or preference.",
    keywords: ["left exit", "off ramp", "car", "swerve", "change", "exit"]
  },
  "Expanding Brain": {
    description: "Multiple panels of increasingly 'expansive' brain images — used to compare levels of thought or logic.",
    keywords: ["expanding brain", "brain", "levels", "intelligence", "thought"]
  },
  "Is This A Pigeon?": {
    description: "Anime man pointing at a butterfly asking if it is a pigeon — used for mislabeling or confusion.",
    keywords: ["pigeon", "butterfly", "is this a pigeon", "confused", "anime"]
  },
  "Mocking Spongebob": {
    description: "Spongebob in a mocking pose (alternating-case text) — used for mocking or sarcastic repetition.",
    keywords: ["mocking", "spongebob", "sarcastic", "repeat"]
  },
  "Batman Slapping Robin": {
    description: "Batman slaps Robin — used to interrupt or shut down a statement quickly.",
    keywords: ["batman", "robin", "slap", "interrupt"]
  }
};

export default memeMeta;
