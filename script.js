// Main application logic for The Upper Room Chat

let messagesData = null;
let biosData = null;
let typingBeatsData = null;
let configData = null;

let currentMsg = 0;
let isPlaying = true;
let currentDayLabel = '';
let currentTimeMinutes = null;
let nextTimer = null;
let bioHideTimer = null;
let currentBioTrigger = null;

let selectedSpeed = 'normal';
let baseDelay = 4500; // Default from config
let autoFollow = true;
let userPausedLive = false;
let suppressScrollListener = false;
let unseenCount = 0;
let lastScrollTop = 0;
let followScrollToken = 0;
let scriptureTimer = null;

// DOM Elements
const chat = document.getElementById('chat');
const bottomSentinel = document.getElementById('bottom-sentinel');
const scrollBtn = document.getElementById('scroll-btn');
const newIndicator = document.getElementById('new-indicator');
const participantCount = document.getElementById('participant-count');
const speedControlsContainer = document.getElementById('speed-controls');
const scriptureBanner = document.getElementById('scripture-banner');
const scriptureBannerTag = document.getElementById('scripture-banner-tag');
const scriptureBannerText = document.getElementById('scripture-banner-text');
const scriptureBannerCitation = document.getElementById('scripture-banner-citation');
const bioPopover = document.getElementById('bio-popover');
const bioName = document.getElementById('bio-name');
const bioRole = document.getElementById('bio-role');
const bioSummary = document.getElementById('bio-summary');
const bioRelation = document.getElementById('bio-relation');
const bioWhy = document.getElementById('bio-why');

// Fallback inline data for local testing
const fallbackMessages = [
  {
    "day": "Day 1 – Good Friday",
    "time": 720
  },
  {
    "context": true,
    "content": "Just after noon. The hill is filling, the city is loud, and those who love Jesus are trying to stay near one another while everything comes apart."
  },
  {
    "from": "Mary Magdalene",
    "text": "They've taken Him to Golgotha.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "John",
    "text": "I'm here with His mother.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Joanna",
    "text": "The city is full of shouting.",
    "side": "left",
    "charClass": "char-joanna"
  },
  {
    "from": "Mary (mother)",
    "text": "Stay near one another.",
    "side": "left",
    "charClass": "char-mary",
    "emotional": true
  },
  {
    "from": "John",
    "text": "He spoke to me from the cross. He told me to care for His mother.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Salome",
    "text": "Is there anything we can do?",
    "side": "left",
    "charClass": "char-salome"
  },
  {
    "from": "John",
    "text": "We stay. We do not look away.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "note": "*Friday — later*",
    "time": 900
  },
  {
    "from": "Matthew",
    "text": "The sky has gone dark.",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "Andrew",
    "text": "At this hour?",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "John",
    "text": "He cried out.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Mary Magdalene",
    "text": "He said, \"It is finished.\"",
    "side": "left",
    "charClass": "char-marym",
    "emotional": true
  },
  {
    "from": "James",
    "text": "...",
    "side": "left",
    "charClass": "char-james"
  },
  {
    "from": "Peter",
    "text": "No.",
    "side": "left",
    "charClass": "char-peter",
    "emotional": true
  },
  {
    "from": "Mary (mother)",
    "text": "Lord, receive my son.",
    "side": "left",
    "charClass": "char-mary",
    "emotional": true
  },
  {
    "note": "*The ground shook.*",
    "time": 905
  },
  {
    "from": "Cleopas",
    "text": "There was an earthquake here.",
    "side": "left",
    "charClass": "char-cleopas"
  },
  {
    "from": "Joanna",
    "text": "People are running from the hill.",
    "side": "left",
    "charClass": "char-joanna"
  },
  {
    "from": "John",
    "text": "The centurion said, \"Surely this was the Son of God.\"",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Peter",
    "text": "I should have been there.",
    "side": "left",
    "charClass": "char-peter",
    "emotional": true
  },
  {
    "from": "John",
    "text": "Come back to us.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "note": "*Friday evening*",
    "time": 1110
  },
  {
    "note": "*Joseph of Arimathea and Nicodemus join the chat*",
    "time": 1112
  },
  {
    "from": "Joseph of Arimathea",
    "text": "I have asked Pilate for His body.",
    "side": "left",
    "charClass": "char-joseph"
  },
  {
    "from": "Nicodemus",
    "text": "I am bringing myrrh and aloes.",
    "side": "left",
    "charClass": "char-nicodemus"
  },
  {
    "from": "Mary Magdalene",
    "text": "We are following.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Joanna",
    "text": "We saw where they laid Him.",
    "side": "left",
    "charClass": "char-joanna"
  },
  {
    "from": "Salome",
    "text": "We will return after the Sabbath with spices.",
    "side": "left",
    "charClass": "char-salome"
  },
  {
    "from": "Peter",
    "text": "The stone is sealed?",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Mary Magdalene",
    "text": "Yes.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Thomas",
    "text": "Then it is over.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "John",
    "text": "He told us this would happen.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Thomas",
    "text": "He said many things we did not understand.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "day": "Day 2 – Holy Saturday",
    "time": 720
  },
  {
    "context": true,
    "content": "The Sabbath settles over Jerusalem. The women wait with prepared spices, the disciples stay together behind closed doors, and grief hangs over the room like a weight no one can move."
  },
  {
    "from": "Mary Magdalene",
    "text": "It is quiet.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Andrew",
    "text": "Too quiet.",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "Peter",
    "text": "I keep hearing the rooster.",
    "side": "left",
    "charClass": "char-peter",
    "emotional": true
  },
  {
    "from": "John",
    "text": "Peter—",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Peter",
    "text": "No. Let me say it. I said I would die with Him, and before dawn I denied Him three times.",
    "side": "left",
    "charClass": "char-peter",
    "emotional": true
  },
  {
    "from": "Mary (mother)",
    "text": "He knew your heart before you spoke.",
    "side": "left",
    "charClass": "char-mary"
  },
  {
    "from": "Peter",
    "text": "That makes it worse.",
    "side": "left",
    "charClass": "char-peter",
    "emotional": true
  },
  {
    "from": "Matthew",
    "text": "We should stay together today.",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "Thomas",
    "text": "And then what?",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "note": "*No one replies for a long time.*",
    "time": 760
  },
  {
    "day": "Day 3 – Resurrection Sunday",
    "time": 300
  },
  {
    "context": true,
    "content": "Before sunrise, Mary Magdalene, Joanna, and Salome go toward the tomb with spices. They expect burial. They do not expect the world to begin again."
  },
  {
    "from": "Mary Magdalene",
    "text": "We're going to the tomb now.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Joanna",
    "text": "Bringing spices.",
    "side": "left",
    "charClass": "char-joanna"
  },
  {
    "from": "Salome",
    "text": "Who will move the stone?",
    "side": "left",
    "charClass": "char-salome"
  },
  {
    "note": "*Sunday — dawn*",
    "time": 360
  },
  {
    "from": "Mary Magdalene",
    "text": "The stone is moved.",
    "side": "left",
    "charClass": "char-marym",
    "emotional": true
  },
  {
    "from": "Joanna",
    "text": "The tomb is open.",
    "side": "left",
    "charClass": "char-joanna"
  },
  {
    "from": "Salome",
    "text": "He is not here.",
    "side": "left",
    "charClass": "char-salome",
    "emotional": true
  },
  {
    "from": "Peter",
    "text": "What do you mean, not here?",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Mary Magdalene",
    "text": "Two men in dazzling clothes. They said, 'Why do you seek the living among the dead?'",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "John",
    "text": "Peter. Run.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Peter",
    "text": "Already gone.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "John",
    "text": "Me too.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "note": "*Minutes later*",
    "time": 372
  },
  {
    "from": "John",
    "text": "The linen cloths are here.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Peter",
    "text": "The tomb is empty.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Thomas",
    "text": "Empty does not mean risen.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "type": "verse",
    "side": "right",
    "tag": "Scripture",
    "verseText": "\"But these words seemed to them an idle tale, and they did not believe them.\"",
    "citation": "Luke 24:11"
  },
  {
    "from": "Mary Magdalene",
    "text": "I stayed. I was weeping.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Mary Magdalene",
    "text": "I thought He was the gardener.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Mary Magdalene",
    "text": "He said my name.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Mary Magdalene",
    "text": "\"Mary.\"",
    "side": "left",
    "charClass": "char-marym",
    "emotional": true
  },
  {
    "from": "John",
    "text": "...",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Mary Magdalene",
    "text": "It is Him.",
    "side": "left",
    "charClass": "char-marym",
    "emotional": true
  },
  {
    "from": "Peter",
    "text": "Mary—",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Mary Magdalene",
    "text": "I know what grief sounds like. I know what hope pretending to be grief sounds like. This was neither. It was Him.",
    "side": "left",
    "charClass": "char-marym",
    "emotional": true
  },
  {
    "from": "Mary (mother)",
    "text": "Praise God.",
    "side": "left",
    "charClass": "char-mary",
    "emotional": true
  },
  {
    "type": "verse",
    "side": "right",
    "tag": "Rumor in the city",
    "tone": "rumor",
    "verseText": "\"Tell people, \"His disciples came by night and stole him away while we were asleep.\"\"",
    "citation": "Matthew 28:13"
  },
  {
    "note": "*Later that day*",
    "time": 1080
  },
  {
    "from": "Cleopas",
    "text": "I need everyone to listen.",
    "side": "left",
    "charClass": "char-cleopas"
  },
  {
    "from": "Cleopas",
    "text": "We were on the road to Emmaus. He came alongside us, and we did not know Him.",
    "side": "left",
    "charClass": "char-cleopas"
  },
  {
    "from": "Matthew",
    "text": "How did you not know Him?",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "Cleopas",
    "text": "Because sorrow makes fools of the eyes.",
    "side": "left",
    "charClass": "char-cleopas"
  },
  {
    "type": "verse",
    "side": "left",
    "tag": "Scripture",
    "verseText": "\"But we had hoped that he was the one to redeem Israel.\"",
    "citation": "Luke 24:21"
  },
  {
    "from": "Cleopas",
    "text": "He opened the Scriptures to us.",
    "side": "left",
    "charClass": "char-cleopas"
  },
  {
    "from": "Cleopas",
    "text": "Then at table, He broke the bread.",
    "side": "left",
    "charClass": "char-cleopas"
  },
  {
    "from": "Cleopas",
    "text": "And we knew Him.",
    "side": "left",
    "charClass": "char-cleopas",
    "emotional": true
  },
  {
    "from": "Andrew",
    "text": "Where is He now?",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "Cleopas",
    "text": "Gone from our sight.",
    "side": "left",
    "charClass": "char-cleopas"
  },
  {
    "from": "John",
    "text": "He was just here.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Thomas",
    "text": "Here?",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Peter",
    "text": "In the room. The doors were locked.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "John",
    "text": "He showed us His hands and His side.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Peter",
    "text": "He said, 'Peace be with you.'",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Thomas",
    "text": "You're all speaking like men who have not slept.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Thomas",
    "text": "I will not believe unless I see the mark of the nails myself.",
    "side": "right",
    "charClass": "char-thomas",
    "emotional": true
  },
  {
    "day": "Eight Days Later",
    "time": 720
  },
  {
    "from": "Thomas",
    "text": "I have seen Him.",
    "side": "right",
    "charClass": "char-thomas",
    "emotional": true
  },
  {
    "from": "Matthew",
    "text": "Say that again.",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "Thomas",
    "text": "I have seen Him.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Thomas",
    "text": "He told me to put my hand there if I needed.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Thomas",
    "text": "My Lord and my God.",
    "side": "right",
    "charClass": "char-thomas",
    "emotional": true
  },
  {
    "from": "Peter",
    "text": "Brother.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Thomas",
    "text": "I was wrong.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "John",
    "text": "No. You were brought all the way through.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "day": "Days Later – Galilee",
    "time": 390
  },
  {
    "context": true,
    "content": "Some of the disciples return to the lake. Peter, Thomas, John, James, and others fish through the night. At daybreak, Jesus is waiting on the shore."
  },
  {
    "from": "Peter",
    "text": "I went fishing.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "James",
    "text": "Some of us did.",
    "side": "left",
    "charClass": "char-james"
  },
  {
    "from": "John",
    "text": "He was on the shore at daybreak.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Thomas",
    "text": "Of course He was.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Peter",
    "text": "We did not know it was Him at first.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "John",
    "text": "I knew when the nets filled.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Peter",
    "text": "He made breakfast.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Thomas",
    "text": "The risen Son of God made you breakfast?",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Peter",
    "text": "Bread. Fish. Fire on the shore.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "John",
    "text": "Then He asked Peter three times if he loved Him.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Peter",
    "text": "Yes.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Peter",
    "text": "Yes.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Peter",
    "text": "Lord, You know everything. You know that I love You.",
    "side": "left",
    "charClass": "char-peter",
    "emotional": true
  },
  {
    "from": "Mary Magdalene",
    "text": "And?",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Peter",
    "text": "He told me to feed His sheep.",
    "side": "left",
    "charClass": "char-peter",
    "emotional": true
  },
  {
    "type": "verse",
    "side": "right",
    "tag": "Scripture",
    "verseText": "\"Simon, son of John, do you love me?\" … \"Feed my sheep.\"",
    "citation": "John 21:17"
  },
  {
    "note": "*Later*",
    "time": 840
  },
  {
    "from": "Matthew",
    "text": "He keeps speaking about the kingdom of God.",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "James",
    "text": "Not the kind of kingdom we expected.",
    "side": "left",
    "charClass": "char-james"
  },
  {
    "from": "Andrew",
    "text": "Never the kind we expected.",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "Peter",
    "text": "He said we are to wait in Jerusalem.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Thomas",
    "text": "Wait for what?",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "John",
    "text": "The promise of the Father.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Mary (mother)",
    "text": "Then we wait.",
    "side": "left",
    "charClass": "char-mary"
  },
  {
    "day": "The Day of the Ascension",
    "time": 540
  },
  {
    "from": "John",
    "text": "We were at the Mount of Olives.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Matthew",
    "text": "He led us out as far as Bethany.",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "Peter",
    "text": "He told us again not to leave Jerusalem. To wait for the promise of the Father.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Thomas",
    "text": "I asked whether this was the moment. Whether He would restore the kingdom now.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Peter",
    "text": "He told us that was not ours to know. Times and seasons belong to the Father.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "type": "verse",
    "side": "right",
    "tag": "Scripture",
    "tone": "promise",
    "verseText": "\"It is not for you to know times or seasons … But you will receive power … and you will be my witnesses.\"",
    "citation": "Acts 1:7–8"
  },
  {
    "from": "Andrew",
    "text": "You will receive power when the Holy Spirit comes upon you.",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "Matthew",
    "text": "And that we would be His witnesses. Here first. Then farther.",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "John",
    "text": "Jerusalem. Judea. Samaria. To the ends of the earth.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "John",
    "text": "Then He lifted His hands.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Matthew",
    "text": "He was blessing us.",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "Matthew",
    "text": "He was still blessing us when He began to rise.",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "type": "verse",
    "side": "left",
    "tag": "Scripture",
    "tone": "promise",
    "verseText": "\"While he blessed them, he parted from him.\"",
    "citation": "Luke 24:51"
  },
  {
    "from": "Thomas",
    "text": "He did not step back. He did not turn away. He just went up.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Andrew",
    "text": "None of us moved.",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "James",
    "text": "None of us even spoke.",
    "side": "left",
    "charClass": "char-james"
  },
  {
    "from": "Andrew",
    "text": "We just stood there looking up.",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "Peter",
    "text": "A cloud took Him from our sight.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Peter",
    "text": "I will spend the rest of my life failing to describe what I just saw.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Matthew",
    "text": "Is anyone moving?",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "James",
    "text": "No.",
    "side": "left",
    "charClass": "char-james"
  },
  {
    "from": "Thomas",
    "text": "Then this is the waiting.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "John",
    "text": "Two men were suddenly standing there in white.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "John",
    "text": "They asked why we were still staring into heaven.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "type": "verse",
    "side": "right",
    "tag": "Scripture",
    "tone": "promise",
    "verseText": "\"Men of Galilee, why do you stand looking into heaven?\"",
    "citation": "Acts 1:11"
  },
  {
    "from": "Peter",
    "text": "He said He would come again the same way we saw Him go.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Mary (mother)",
    "text": "Because He told you what to do. Come back to the city. We wait.",
    "side": "left",
    "charClass": "char-mary"
  },
  {
    "day": "The Waiting Days",
    "time": 660
  },
  {
    "context": true,
    "content": "Back in Jerusalem, they gather again in the upper room. This waiting is no longer empty. Prayer becomes the shape of obedience, and every silence now leans toward the promise He gave them."
  },
  {
    "from": "John",
    "text": "Everyone is gathered.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Matthew",
    "text": "We are praying together daily.",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "Joanna",
    "text": "The room feels full even in silence.",
    "side": "left",
    "charClass": "char-joanna"
  },
  {
    "from": "Peter",
    "text": "We chose Matthias.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Thomas",
    "text": "Strange how grief made room for obedience.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Mary Magdalene",
    "text": "Strange how obedience is beginning to feel like joy.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Andrew",
    "text": "Every prayer feels like it is leaning toward something.",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "John",
    "text": "The promise has not come yet.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Peter",
    "text": "But the waiting does not feel empty now.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Mary (mother)",
    "text": "Then pray again.",
    "side": "left",
    "charClass": "char-mary"
  },
  {
    "day": "Day 50 – Pentecost",
    "time": 540
  },
  {
    "context": true,
    "content": "They are together in one place when the sound comes—like a violent wind, though the air outside is still. What descends does not burn the room down. It fills it."
  },
  {
    "from": "Matthew",
    "text": "Does anyone else hear that?",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "Andrew",
    "text": "Wind.",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "John",
    "text": "There is no wind outside.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Thomas",
    "text": "Then why is the room roaring?",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Mary Magdalene",
    "text": "Fire—",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Peter",
    "text": "Not burning. Resting.",
    "side": "left",
    "charClass": "char-peter",
    "pentecostFire": true
  },
  {
    "from": "Joanna",
    "text": "Over each of us.",
    "side": "left",
    "charClass": "char-joanna",
    "pentecostFire": true
  },
  {
    "from": "Matthew",
    "text": "I am speaking and I do not know this language.",
    "side": "left",
    "charClass": "char-matthew",
    "pentecostFire": true
  },
  {
    "from": "Andrew",
    "text": "People in the street are stopping.",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "John",
    "text": "They hear us.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Thomas",
    "text": "They understand us.",
    "side": "right",
    "charClass": "char-thomas",
    "pentecostFire": true
  },
  {
    "note": "*Crowd reactions forwarded by Matthew*",
    "time": 570
  },
  {
    "from": "Matthew",
    "text": "\"Parthians… Medes… Elamites… Visitors from Rome… How is this possible?\"",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "Peter",
    "text": "They think we are drunk.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "type": "verse",
    "side": "right",
    "tag": "Scripture",
    "tone": "rumor",
    "verseText": "\"Others mocking said, \"They are filled with new wine.\"\"",
    "citation": "Acts 2:13"
  },
  {
    "from": "John",
    "text": "It is nine in the morning.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Peter",
    "text": "I'm going downstairs.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Thomas",
    "text": "To do what?",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Peter",
    "text": "To stand up.",
    "side": "left",
    "charClass": "char-peter",
    "pentecostFire": true
  },
  {
    "from": "Mary Magdalene",
    "text": "Then stand up.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Peter",
    "text": "He said this would happen.",
    "side": "left",
    "charClass": "char-peter",
    "pentecostFire": true
  },
  {
    "type": "verse",
    "side": "left",
    "tag": "Scripture",
    "tone": "fire",
    "verseText": "\"I will pour out my Spirit on all flesh.\"",
    "citation": "Joel 2:28 / Acts 2:17"
  },
  {
    "note": "*Later that day*",
    "time": 900
  },
  {
    "from": "Peter",
    "text": "I preached Christ to them.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Andrew",
    "text": "How many stayed?",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "Peter",
    "text": "About three thousand.",
    "side": "left",
    "charClass": "char-peter",
    "emotional": true,
    "pentecostFire": true
  },
  {
    "from": "Thomas",
    "text": "Three thousand?",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Matthew",
    "text": "The room will never be quiet again.",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "John",
    "text": "Good.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Mary (mother)",
    "text": "He told you that you would be His witnesses.",
    "side": "left",
    "charClass": "char-mary"
  },
  {
    "from": "Mary Magdalene",
    "text": "From the cross to the empty tomb to this.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Peter",
    "text": "From fear to fire.",
    "side": "left",
    "charClass": "char-peter",
    "pentecostFire": true
  },
  {
    "from": "John",
    "text": "From locked doors to open streets.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Thomas",
    "text": "From \"unless I see\" to \"now go tell.\"",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Mary (mother)",
    "text": "Then let us begin.",
    "side": "left",
    "charClass": "char-mary",
    "emotional": true
  }
];

const fallbackBios = {
  "Peter": {
    "role": "Simon Peter — fisherman, disciple, and Pentecost preacher",
    "summary": "One of the Twelve and part of Jesus' inner circle. Impulsive, loyal, and still carrying the wound of having denied Him.",
    "relation": "To Jesus: close disciple, eyewitness to major moments, and often the spokesman among the apostles.",
    "why": "Why he is here: Peter stands near the center of the denial, the empty tomb, the restoration by the sea, the Ascension, and the public witness of Pentecost."
  },
  "John": {
    "role": "John son of Zebedee — beloved disciple and eyewitness",
    "summary": "One of the Twelve and among Jesus' closest companions. He remains near the cross when many others scatter.",
    "relation": "To Jesus: part of the inner circle; at the cross Jesus entrusts His mother Mary to John's care.",
    "why": "Why he is here: John is a key eyewitness to the crucifixion, the empty tomb, the upper-room appearances, and the breakfast by the sea."
  },
  "James": {
    "role": "James son of Zebedee — disciple and brother of John",
    "summary": "One of the Twelve and, with Peter and John, part of Jesus' inner circle during key moments of His ministry.",
    "relation": "To Jesus: close disciple present among the apostles named in the upper room after the Ascension.",
    "why": "Why he is here: James helps represent the apostolic circle that moves from fear and confusion into obedience, prayer, and witness."
  },
  "Andrew": {
    "role": "Andrew — disciple, brother of Peter, early follower",
    "summary": "One of the Twelve and Simon Peter's brother. The Gospels often show him bringing people toward Jesus.",
    "relation": "To Jesus: disciple called early in the ministry and present among the apostles in the upper room in Acts 1.",
    "why": "Why he is here: Andrew gives voice to the apostolic group in the waiting, the Ascension, and the coming mission."
  },
  "Matthew": {
    "role": "Matthew — tax collector turned disciple",
    "summary": "One of the Twelve. Formerly a tax collector, he leaves an old life to follow Jesus.",
    "relation": "To Jesus: apostle named among those who return to the upper room and devote themselves to prayer after the Ascension.",
    "why": "Why he is here: Matthew helps the wider apostolic chorus in the final quarter, especially the commission, waiting, and Pentecost scenes."
  },
  "Thomas": {
    "role": "Thomas — disciple remembered for doubt and confession",
    "summary": "One of the Twelve. Honest, cautious, and unwilling to pretend certainty before he truly sees.",
    "relation": "To Jesus: faithful disciple whose skepticism becomes one of the clearest confessions: 'My Lord and my God.'",
    "why": "Why he is here: Thomas gives voice to fear, disbelief, and the costly move from doubt to worship."
  },
  "Mary (mother)": {
    "role": "Mary, mother of Jesus",
    "summary": "The woman who bore and raised Jesus. She carries the sorrow Simeon foresaw and remains among the believers in prayer.",
    "relation": "To Jesus: His mother, present at the cross and later named among those gathered in prayer in Acts 1.",
    "why": "Why she is here: this story is not only public history; it is also personal grief, waiting, and faith inside the community."
  },
  "Mary Magdalene": {
    "role": "Mary Magdalene — devoted follower and resurrection witness",
    "summary": "A faithful disciple who stays close through the darkest hours and goes to the tomb early on the first day of the week.",
    "relation": "To Jesus: beloved follower who becomes the first recorded witness of the risen Jesus in John's Gospel.",
    "why": "Why she is here: her testimony carries the shock of loss, the empty tomb, and the recognition of the risen Christ."
  },
  "Joanna": {
    "role": "Joanna — woman disciple and witness to the empty tomb",
    "summary": "A follower of Jesus named in Luke among the women who supported Him and later reported the empty tomb to the apostles.",
    "relation": "To Jesus: disciple from the wider circle of women who traveled with and supported His ministry.",
    "why": "Why she is here: Joanna helps represent the women whose witness spans burial, resurrection morning, and the prayerful waiting of Acts 1."
  },
  "Salome": {
    "role": "Salome — Galilean follower and witness at cross and tomb",
    "summary": "Named in Mark among the women who followed Jesus, watched the crucifixion from a distance, and came to the tomb with spices.",
    "relation": "To Jesus: devoted woman disciple from the wider circle that stayed near through His death and burial.",
    "why": "Why she is here: Salome helps keep the women's witness visible in the crucifixion and resurrection scenes."
  },
  "Joseph of Arimathea": {
    "role": "Joseph of Arimathea — respected council member and secret disciple",
    "summary": "A wealthy and influential man who steps forward publicly after Jesus' death to ask Pilate for the body.",
    "relation": "To Jesus: disciple from the margins who risks reputation to honor Him when many others are hiding.",
    "why": "Why he is here: he helps secure Jesus' burial and shows that courage sometimes appears after the crisis breaks."
  },
  "Nicodemus": {
    "role": "Nicodemus — Pharisee, seeker, and quiet ally",
    "summary": "A religious leader who once came to Jesus by night and later assists with His burial.",
    "relation": "To Jesus: cautious but real sympathizer whose spiritual curiosity slowly becomes public loyalty.",
    "why": "Why he is here: his presence shows that even within the religious establishment, some were drawn to Jesus and moved by His death."
  },
  "Cleopas": {
    "role": "Cleopas — traveler on the road to Emmaus",
    "summary": "A follower outside the central apostolic circle, walking home in disappointment until the risen Jesus joins the journey.",
    "relation": "To Jesus: disciple and witness whose heart burns as Scripture is opened and Christ is recognized in the breaking of bread.",
    "why": "Why he is here: Cleopas brings the Emmaus testimony into the room, widening the sense that resurrection is breaking in everywhere."
  },
  "Matthias": {
    "role": "Matthias — chosen to take Judas's place among the Twelve",
    "summary": "Chosen in Acts 1 from among those who had followed Jesus from the beginning and witnessed the resurrection era.",
    "relation": "To Jesus: part of the wider company of disciples and selected to be numbered with the apostles.",
    "why": "Why he is here: Matthias is mentioned during the waiting days because the community is already being ordered for mission before Pentecost."
  }
};

const fallbackTypingBeats = [
  {
    "afterText": "Did you feel that? The earth... it moved.",
    "from": "Peter",
    "side": "left",
    "charClass": "char-peter",
    "duration": 1250
  },
  {
    "afterText": "My son. My firstborn...",
    "from": "John",
    "side": "left",
    "charClass": "char-john",
    "duration": 1500,
    "unsent": true
  },
  {
    "afterNote": "*Peter and John run to the tomb*",
    "from": "John",
    "side": "left",
    "charClass": "char-john",
    "duration": 1050
  },
  {
    "afterText": "We're all here. Doors locked.",
    "from": "Thomas",
    "side": "right",
    "charClass": "char-thomas",
    "duration": 1200
  },
  {
    "afterText": "Back to the upper room. All of us. Waiting for power.",
    "from": "John",
    "side": "left",
    "charClass": "char-john",
    "duration": 1300,
    "unsent": true
  },
  {
    "afterContextText": "The disciples are gathered together when suddenly... a sound like wind fills the room. Tongues of fire rest on each of them.",
    "from": "Peter",
    "side": "left",
    "charClass": "char-peter",
    "duration": 1050
  },
  {
    "afterText": "They're confused! Jews from everywhere... Parthians, Medes, Elamites!",
    "from": "Thomas",
    "side": "right",
    "charClass": "char-thomas",
    "duration": 950
  },
  {
    "afterText": "A cloud took Him from our sight.",
    "from": "Joanna",
    "side": "left",
    "charClass": "char-joanna",
    "duration": 1700,
    "unsent": true
  },
  {
    "afterNote": "*Peter stands to speak.*",
    "from": "Peter",
    "side": "left",
    "charClass": "char-peter",
    "duration": 1250
  }
];

const fallbackConfig = {
  "speeds": {
    "fast": {
      "label": "Fast (4 min)",
      "delay": 1800,
      "id": 1
    },
    "normal": {
      "label": "Normal (10 min)",
      "delay": 4500,
      "id": 2
    },
    "slow": {
      "label": "Slow (20 min)",
      "delay": 9000,
      "id": 3
    }
  },
  "defaultSpeed": "normal",
  "participantCount": {
    "prefix": "participants"
  },
  "scripture": {
    "minWordsDisplayTime": 5200,
    "maxWordsDisplayTime": 9200,
    "baseDelay": 2800,
    "wordsPerSecond": 260
  },
  "scroll": {
    "thresholdPixelsFromBottom": 90,
    "fadeTypingOutDuration": 220,
    "typingIndicatorFadeDelay": 140
  }
};

// Main application logic for The Upper Room Chat

let messages = [];

// DOM Elements
const chat = document.getElementById('chat');
const bottomSentinel = document.getElementById('bottom-sentinel');
const scrollBtn = document.getElementById('scroll-btn');
const newIndicator = document.getElementById('new-indicator');
const participantCount = document.getElementById('participant-count');
const speedControlsContainer = document.getElementById('speed-controls');
const scriptureBanner = document.getElementById('scripture-banner');
const scriptureBannerTag = document.getElementById('scripture-banner-tag');
const scriptureBannerText = document.getElementById('scripture-banner-text');
const scriptureBannerCitation = document.getElementById('scripture-banner-citation');
const bioPopover = document.getElementById('bio-popover');
const bioName = document.getElementById('bio-name');
const bioRole = document.getElementById('bio-role');
const bioSummary = document.getElementById('bio-summary');
const bioRelation = document.getElementById('bio-relation');
const bioWhy = document.getElementById('bio-why');

// Fallback inline data for local testing
const fallbackMessages = [
  {
    "day": "Day 1 – Good Friday",
    "time": 720
  },
  {
    "context": true,
    "content": "Just after noon. The hill is filling, the city is loud, and those who love Jesus are trying to stay near one another while everything comes apart."
  },
  {
    "from": "Mary Magdalene",
    "text": "They've taken Him to Golgotha.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "John",
    "text": "I'm here with His mother.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Joanna",
    "text": "The city is full of shouting.",
    "side": "left",
    "charClass": "char-joanna"
  },
  {
    "from": "Mary (mother)",
    "text": "Stay near one another.",
    "side": "left",
    "charClass": "char-mary",
    "emotional": true
  },
  {
    "from": "John",
    "text": "He spoke to me from the cross. He told me to care for His mother.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Salome",
    "text": "Is there anything we can do?",
    "side": "left",
    "charClass": "char-salome"
  },
  {
    "from": "John",
    "text": "We stay. We do not look away.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "note": "*Friday — later*",
    "time": 900
  },
  {
    "from": "Matthew",
    "text": "The sky has gone dark.",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "Andrew",
    "text": "At this hour?",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "John",
    "text": "He cried out.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Mary Magdalene",
    "text": "He said, \"It is finished.\"",
    "side": "left",
    "charClass": "char-marym",
    "emotional": true
  },
  {
    "from": "James",
    "text": "...",
    "side": "left",
    "charClass": "char-james"
  },
  {
    "from": "Peter",
    "text": "No.",
    "side": "left",
    "charClass": "char-peter",
    "emotional": true
  },
  {
    "from": "Mary (mother)",
    "text": "Lord, receive my son.",
    "side": "left",
    "charClass": "char-mary",
    "emotional": true
  },
  {
    "note": "*The ground shook.*",
    "time": 905
  },
  {
    "from": "Cleopas",
    "text": "There was an earthquake here.",
    "side": "left",
    "charClass": "char-cleopas"
  },
  {
    "from": "Joanna",
    "text": "People are running from the hill.",
    "side": "left",
    "charClass": "char-joanna"
  },
  {
    "from": "John",
    "text": "The centurion said, \"Surely this was the Son of God.\"",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Peter",
    "text": "I should have been there.",
    "side": "left",
    "charClass": "char-peter",
    "emotional": true
  },
  {
    "from": "John",
    "text": "Come back to us.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "note": "*Friday evening*",
    "time": 1110
  },
  {
    "note": "*Joseph of Arimathea and Nicodemus join the chat*",
    "time": 1112
  },
  {
    "from": "Joseph of Arimathea",
    "text": "I have asked Pilate for His body.",
    "side": "left",
    "charClass": "char-joseph"
  },
  {
    "from": "Nicodemus",
    "text": "I am bringing myrrh and aloes.",
    "side": "left",
    "charClass": "char-nicodemus"
  },
  {
    "from": "Mary Magdalene",
    "text": "We are following.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Joanna",
    "text": "We saw where they laid Him.",
    "side": "left",
    "charClass": "char-joanna"
  },
  {
    "from": "Salome",
    "text": "We will return after the Sabbath with spices.",
    "side": "left",
    "charClass": "char-salome"
  },
  {
    "from": "Peter",
    "text": "The stone is sealed?",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Mary Magdalene",
    "text": "Yes.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Thomas",
    "text": "Then it is over.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "John",
    "text": "He told us this would happen.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Thomas",
    "text": "He said many things we did not understand.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "day": "Day 2 – Holy Saturday",
    "time": 720
  },
  {
    "context": true,
    "content": "The Sabbath settles over Jerusalem. The women wait with prepared spices, the disciples stay together behind closed doors, and grief hangs over the room like a weight no one can move."
  },
  {
    "from": "Mary Magdalene",
    "text": "It is quiet.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Andrew",
    "text": "Too quiet.",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "Peter",
    "text": "I keep hearing the rooster.",
    "side": "left",
    "charClass": "char-peter",
    "emotional": true
  },
  {
    "from": "John",
    "text": "Peter—",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Peter",
    "text": "No. Let me say it. I said I would die with Him, and before dawn I denied Him three times.",
    "side": "left",
    "charClass": "char-peter",
    "emotional": true
  },
  {
    "from": "Mary (mother)",
    "text": "He knew your heart before you spoke.",
    "side": "left",
    "charClass": "char-mary"
  },
  {
    "from": "Peter",
    "text": "That makes it worse.",
    "side": "left",
    "charClass": "char-peter",
    "emotional": true
  },
  {
    "from": "Matthew",
    "text": "We should stay together today.",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "Thomas",
    "text": "And then what?",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "note": "*No one replies for a long time.*",
    "time": 760
  },
  {
    "day": "Day 3 – Resurrection Sunday",
    "time": 300
  },
  {
    "context": true,
    "content": "Before sunrise, Mary Magdalene, Joanna, and Salome go toward the tomb with spices. They expect burial. They do not expect the world to begin again."
  },
  {
    "from": "Mary Magdalene",
    "text": "We're going to the tomb now.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Joanna",
    "text": "Bringing spices.",
    "side": "left",
    "charClass": "char-joanna"
  },
  {
    "from": "Salome",
    "text": "Who will move the stone?",
    "side": "left",
    "charClass": "char-salome"
  },
  {
    "note": "*Sunday — dawn*",
    "time": 360
  },
  {
    "from": "Mary Magdalene",
    "text": "The stone is moved.",
    "side": "left",
    "charClass": "char-marym",
    "emotional": true
  },
  {
    "from": "Joanna",
    "text": "The tomb is open.",
    "side": "left",
    "charClass": "char-joanna"
  },
  {
    "from": "Salome",
    "text": "He is not here.",
    "side": "left",
    "charClass": "char-salome",
    "emotional": true
  },
  {
    "from": "Peter",
    "text": "What do you mean, not here?",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Mary Magdalene",
    "text": "Two men in dazzling clothes. They said, 'Why do you seek the living among the dead?'",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "John",
    "text": "Peter. Run.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Peter",
    "text": "Already gone.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "John",
    "text": "Me too.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "note": "*Minutes later*",
    "time": 372
  },
  {
    "from": "John",
    "text": "The linen cloths are here.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Peter",
    "text": "The tomb is empty.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Thomas",
    "text": "Empty does not mean risen.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "type": "verse",
    "side": "right",
    "tag": "Scripture",
    "verseText": "\"But these words seemed to them an idle tale, and they did not believe them.\"",
    "citation": "Luke 24:11"
  },
  {
    "from": "Mary Magdalene",
    "text": "I stayed. I was weeping.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Mary Magdalene",
    "text": "I thought He was the gardener.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Mary Magdalene",
    "text": "He said my name.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Mary Magdalene",
    "text": "\"Mary.\"",
    "side": "left",
    "charClass": "char-marym",
    "emotional": true
  },
  {
    "from": "John",
    "text": "...",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Mary Magdalene",
    "text": "It is Him.",
    "side": "left",
    "charClass": "char-marym",
    "emotional": true
  },
  {
    "from": "Peter",
    "text": "Mary—",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Mary Magdalene",
    "text": "I know what grief sounds like. I know what hope pretending to be grief sounds like. This was neither. It was Him.",
    "side": "left",
    "charClass": "char-marym",
    "emotional": true
  },
  {
    "from": "Mary (mother)",
    "text": "Praise God.",
    "side": "left",
    "charClass": "char-mary",
    "emotional": true
  },
  {
    "type": "verse",
    "side": "right",
    "tag": "Rumor in the city",
    "tone": "rumor",
    "verseText": "\"Tell people, \"His disciples came by night and stole him away while we were asleep.\"\"",
    "citation": "Matthew 28:13"
  },
  {
    "note": "*Later that day*",
    "time": 1080
  },
  {
    "from": "Cleopas",
    "text": "I need everyone to listen.",
    "side": "left",
    "charClass": "char-cleopas"
  },
  {
    "from": "Cleopas",
    "text": "We were on the road to Emmaus. He came alongside us, and we did not know Him.",
    "side": "left",
    "charClass": "char-cleopas"
  },
  {
    "from": "Matthew",
    "text": "How did you not know Him?",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "Cleopas",
    "text": "Because sorrow makes fools of the eyes.",
    "side": "left",
    "charClass": "char-cleopas"
  },
  {
    "type": "verse",
    "side": "left",
    "tag": "Scripture",
    "verseText": "\"But we had hoped that he was the one to redeem Israel.\"",
    "citation": "Luke 24:21"
  },
  {
    "from": "Cleopas",
    "text": "He opened the Scriptures to us.",
    "side": "left",
    "charClass": "char-cleopas"
  },
  {
    "from": "Cleopas",
    "text": "Then at table, He broke the bread.",
    "side": "left",
    "charClass": "char-cleopas"
  },
  {
    "from": "Cleopas",
    "text": "And we knew Him.",
    "side": "left",
    "charClass": "char-cleopas",
    "emotional": true
  },
  {
    "from": "Andrew",
    "text": "Where is He now?",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "Cleopas",
    "text": "Gone from our sight.",
    "side": "left",
    "charClass": "char-cleopas"
  },
  {
    "from": "John",
    "text": "He was just here.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Thomas",
    "text": "Here?",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Peter",
    "text": "In the room. The doors were locked.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "John",
    "text": "He showed us His hands and His side.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Peter",
    "text": "He said, 'Peace be with you.'",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Thomas",
    "text": "You're all speaking like men who have not slept.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Thomas",
    "text": "I will not believe unless I see the mark of the nails myself.",
    "side": "right",
    "charClass": "char-thomas",
    "emotional": true
  },
  {
    "day": "Eight Days Later",
    "time": 720
  },
  {
    "from": "Thomas",
    "text": "I have seen Him.",
    "side": "right",
    "charClass": "char-thomas",
    "emotional": true
  },
  {
    "from": "Matthew",
    "text": "Say that again.",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "Thomas",
    "text": "I have seen Him.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Thomas",
    "text": "He told me to put my hand there if I needed.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Thomas",
    "text": "My Lord and my God.",
    "side": "right",
    "charClass": "char-thomas",
    "emotional": true
  },
  {
    "from": "Peter",
    "text": "Brother.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Thomas",
    "text": "I was wrong.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "John",
    "text": "No. You were brought all the way through.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "day": "Days Later – Galilee",
    "time": 390
  },
  {
    "context": true,
    "content": "Some of the disciples return to the lake. Peter, Thomas, John, James, and others fish through the night. At daybreak, Jesus is waiting on the shore."
  },
  {
    "from": "Peter",
    "text": "I went fishing.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "James",
    "text": "Some of us did.",
    "side": "left",
    "charClass": "char-james"
  },
  {
    "from": "John",
    "text": "He was on the shore at daybreak.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Thomas",
    "text": "Of course He was.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Peter",
    "text": "We did not know it was Him at first.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "John",
    "text": "I knew when the nets filled.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Peter",
    "text": "He made breakfast.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Thomas",
    "text": "The risen Son of God made you breakfast?",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Peter",
    "text": "Bread. Fish. Fire on the shore.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "John",
    "text": "Then He asked Peter three times if he loved Him.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Peter",
    "text": "Yes.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Peter",
    "text": "Yes.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Peter",
    "text": "Lord, You know everything. You know that I love You.",
    "side": "left",
    "charClass": "char-peter",
    "emotional": true
  },
  {
    "from": "Mary Magdalene",
    "text": "And?",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Peter",
    "text": "He told me to feed His sheep.",
    "side": "left",
    "charClass": "char-peter",
    "emotional": true
  },
  {
    "type": "verse",
    "side": "right",
    "tag": "Scripture",
    "verseText": "\"Simon, son of John, do you love me?\" … \"Feed my sheep.\"",
    "citation": "John 21:17"
  },
  {
    "note": "*Later*",
    "time": 840
  },
  {
    "from": "Matthew",
    "text": "He keeps speaking about the kingdom of God.",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "James",
    "text": "Not the kind of kingdom we expected.",
    "side": "left",
    "charClass": "char-james"
  },
  {
    "from": "Andrew",
    "text": "Never the kind we expected.",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "Peter",
    "text": "He said we are to wait in Jerusalem.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Thomas",
    "text": "Wait for what?",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "John",
    "text": "The promise of the Father.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Mary (mother)",
    "text": "Then we wait.",
    "side": "left",
    "charClass": "char-mary"
  },
  {
    "day": "The Day of the Ascension",
    "time": 540
  },
  {
    "from": "John",
    "text": "We were at the Mount of Olives.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Matthew",
    "text": "He led us out as far as Bethany.",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "Peter",
    "text": "He told us again not to leave Jerusalem. To wait for the promise of the Father.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Thomas",
    "text": "I asked whether this was the moment. Whether He would restore the kingdom now.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Peter",
    "text": "He told us that was not ours to know. Times and seasons belong to the Father.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "type": "verse",
    "side": "right",
    "tag": "Scripture",
    "tone": "promise",
    "verseText": "\"It is not for you to know times or seasons … But you will receive power … and you will be my witnesses.\"",
    "citation": "Acts 1:7–8"
  },
  {
    "from": "Andrew",
    "text": "You will receive power when the Holy Spirit comes upon you.",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "Matthew",
    "text": "And that we would be His witnesses. Here first. Then farther.",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "John",
    "text": "Jerusalem. Judea. Samaria. To the ends of the earth.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "John",
    "text": "Then He lifted His hands.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Matthew",
    "text": "He was blessing us.",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "Matthew",
    "text": "He was still blessing us when He began to rise.",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "type": "verse",
    "side": "left",
    "tag": "Scripture",
    "tone": "promise",
    "verseText": "\"While he blessed them, he parted from him.\"",
    "citation": "Luke 24:51"
  },
  {
    "from": "Thomas",
    "text": "He did not step back. He did not turn away. He just went up.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Andrew",
    "text": "None of us moved.",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "James",
    "text": "None of us even spoke.",
    "side": "left",
    "charClass": "char-james"
  },
  {
    "from": "Andrew",
    "text": "We just stood there looking up.",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "Peter",
    "text": "A cloud took Him from our sight.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Peter",
    "text": "I will spend the rest of my life failing to describe what I just saw.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Matthew",
    "text": "Is anyone moving?",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "James",
    "text": "No.",
    "side": "left",
    "charClass": "char-james"
  },
  {
    "from": "Thomas",
    "text": "Then this is the waiting.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "John",
    "text": "Two men were suddenly standing there in white.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "John",
    "text": "They asked why we were still staring into heaven.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "type": "verse",
    "side": "right",
    "tag": "Scripture",
    "tone": "promise",
    "verseText": "\"Men of Galilee, why do you stand looking into heaven?\"",
    "citation": "Acts 1:11"
  },
  {
    "from": "Peter",
    "text": "He said He would come again the same way we saw Him go.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Mary (mother)",
    "text": "Because He told you what to do. Come back to the city. We wait.",
    "side": "left",
    "charClass": "char-mary"
  },
  {
    "day": "The Waiting Days",
    "time": 660
  },
  {
    "context": true,
    "content": "Back in Jerusalem, they gather again in the upper room. This waiting is no longer empty. Prayer becomes the shape of obedience, and every silence now leans toward the promise He gave them."
  },
  {
    "from": "John",
    "text": "Everyone is gathered.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Matthew",
    "text": "We are praying together daily.",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "Joanna",
    "text": "The room feels full even in silence.",
    "side": "left",
    "charClass": "char-joanna"
  },
  {
    "from": "Peter",
    "text": "We chose Matthias.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Thomas",
    "text": "Strange how grief made room for obedience.",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Mary Magdalene",
    "text": "Strange how obedience is beginning to feel like joy.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Andrew",
    "text": "Every prayer feels like it is leaning toward something.",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "John",
    "text": "The promise has not come yet.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Peter",
    "text": "But the waiting does not feel empty now.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Mary (mother)",
    "text": "Then pray again.",
    "side": "left",
    "charClass": "char-mary"
  },
  {
    "day": "Day 50 – Pentecost",
    "time": 540
  },
  {
    "context": true,
    "content": "They are together in one place when the sound comes—like a violent wind, though the air outside is still. What descends does not burn the room down. It fills it."
  },
  {
    "from": "Matthew",
    "text": "Does anyone else hear that?",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "Andrew",
    "text": "Wind.",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "John",
    "text": "There is no wind outside.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Thomas",
    "text": "Then why is the room roaring?",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Mary Magdalene",
    "text": "Fire—",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Peter",
    "text": "Not burning. Resting.",
    "side": "left",
    "charClass": "char-peter",
    "pentecostFire": true
  },
  {
    "from": "Joanna",
    "text": "Over each of us.",
    "side": "left",
    "charClass": "char-joanna",
    "pentecostFire": true
  },
  {
    "from": "Matthew",
    "text": "I am speaking and I do not know this language.",
    "side": "left",
    "charClass": "char-matthew",
    "pentecostFire": true
  },
  {
    "from": "Andrew",
    "text": "People in the street are stopping.",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "John",
    "text": "They hear us.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Thomas",
    "text": "They understand us.",
    "side": "right",
    "charClass": "char-thomas",
    "pentecostFire": true
  },
  {
    "note": "*Crowd reactions forwarded by Matthew*",
    "time": 570
  },
  {
    "from": "Matthew",
    "text": "\"Parthians… Medes… Elamites… Visitors from Rome… How is this possible?\"",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "Peter",
    "text": "They think we are drunk.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "type": "verse",
    "side": "right",
    "tag": "Scripture",
    "tone": "rumor",
    "verseText": "\"Others mocking said, \"They are filled with new wine.\"\"",
    "citation": "Acts 2:13"
  },
  {
    "from": "John",
    "text": "It is nine in the morning.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Peter",
    "text": "I'm going downstairs.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Thomas",
    "text": "To do what?",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Peter",
    "text": "To stand up.",
    "side": "left",
    "charClass": "char-peter",
    "pentecostFire": true
  },
  {
    "from": "Mary Magdalene",
    "text": "Then stand up.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Peter",
    "text": "He said this would happen.",
    "side": "left",
    "charClass": "char-peter",
    "pentecostFire": true
  },
  {
    "type": "verse",
    "side": "left",
    "tag": "Scripture",
    "tone": "fire",
    "verseText": "\"I will pour out my Spirit on all flesh.\"",
    "citation": "Joel 2:28 / Acts 2:17"
  },
  {
    "note": "*Later that day*",
    "time": 900
  },
  {
    "from": "Peter",
    "text": "I preached Christ to them.",
    "side": "left",
    "charClass": "char-peter"
  },
  {
    "from": "Andrew",
    "text": "How many stayed?",
    "side": "left",
    "charClass": "char-andrew"
  },
  {
    "from": "Peter",
    "text": "About three thousand.",
    "side": "left",
    "charClass": "char-peter",
    "emotional": true,
    "pentecostFire": true
  },
  {
    "from": "Thomas",
    "text": "Three thousand?",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Matthew",
    "text": "The room will never be quiet again.",
    "side": "left",
    "charClass": "char-matthew"
  },
  {
    "from": "John",
    "text": "Good.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Mary (mother)",
    "text": "He told you that you would be His witnesses.",
    "side": "left",
    "charClass": "char-mary"
  },
  {
    "from": "Mary Magdalene",
    "text": "From the cross to the empty tomb to this.",
    "side": "left",
    "charClass": "char-marym"
  },
  {
    "from": "Peter",
    "text": "From fear to fire.",
    "side": "left",
    "charClass": "char-peter",
    "pentecostFire": true
  },
  {
    "from": "John",
    "text": "From locked doors to open streets.",
    "side": "left",
    "charClass": "char-john"
  },
  {
    "from": "Thomas",
    "text": "From \"unless I see\" to \"now go tell.\"",
    "side": "right",
    "charClass": "char-thomas"
  },
  {
    "from": "Mary (mother)",
    "text": "Then let us begin.",
    "side": "left",
    "charClass": "char-mary",
    "emotional": true
  }
];

const fallbackBios = {
  "Peter": {
    "role": "Simon Peter — fisherman, disciple, and Pentecost preacher",
    "summary": "One of the Twelve and part of Jesus' inner circle. Impulsive, loyal, and still carrying the wound of having denied Him.",
    "relation": "To Jesus: close disciple, eyewitness to major moments, and often the spokesman among the apostles.",
    "why": "Why he is here: Peter stands near the center of the denial, the empty tomb, the restoration by the sea, the Ascension, and the public witness of Pentecost."
  },
  "John": {
    "role": "John son of Zebedee — beloved disciple and eyewitness",
    "summary": "One of the Twelve and among Jesus' closest companions. He remains near the cross when many others scatter.",
    "relation": "To Jesus: part of the inner circle; at the cross Jesus entrusts His mother Mary to John's care.",
    "why": "Why he is here: John is a key eyewitness to the crucifixion, the empty tomb, the upper-room appearances, and the breakfast by the sea."
  },
  "James": {
    "role": "James son of Zebedee — disciple and brother of John",
    "summary": "One of the Twelve and, with Peter and John, part of Jesus' inner circle during key moments of His ministry.",
    "relation": "To Jesus: close disciple present among the apostles named in the upper room after the Ascension.",
    "why": "Why he is here: James helps represent the apostolic circle that moves from fear and confusion into obedience, prayer, and witness."
  },
  "Andrew": {
    "role": "Andrew — disciple, brother of Peter, early follower",
    "summary": "One of the Twelve and Simon Peter's brother. The Gospels often show him bringing people toward Jesus.",
    "relation": "To Jesus: disciple called early in the ministry and present among the apostles in the upper room in Acts 1.",
    "why": "Why he is here: Andrew gives voice to the apostolic group in the waiting, the Ascension, and the coming mission."
  },
  "Matthew": {
    "role": "Matthew — tax collector turned disciple",
    "summary": "One of the Twelve. Formerly a tax collector, he leaves an old life to follow Jesus.",
    "relation": "To Jesus: apostle named among those who return to the upper room and devote themselves to prayer after the Ascension.",
    "why": "Why he is here: Matthew helps the wider apostolic chorus in the final quarter, especially the commission, waiting, and Pentecost scenes."
  },
  "Thomas": {
    "role": "Thomas — disciple remembered for doubt and confession",
    "summary": "One of the Twelve. Honest, cautious, and unwilling to pretend certainty before he truly sees.",
    "relation": "To Jesus: faithful disciple whose skepticism becomes one of the clearest confessions: 'My Lord and my God.'",
    "why": "Why he is here: Thomas gives voice to fear, disbelief, and the costly move from doubt to worship."
  },
  "Mary (mother)": {
    "role": "Mary, mother of Jesus",
    "summary": "The woman who bore and raised Jesus. She carries the sorrow Simeon foresaw and remains among the believers in prayer.",
    "relation": "To Jesus: His mother, present at the cross and later named among those gathered in prayer in Acts 1.",
    "why": "Why she is here: this story is not only public history; it is also personal grief, waiting, and faith inside the community."
  },
  "Mary Magdalene": {
    "role": "Mary Magdalene — devoted follower and resurrection witness",
    "summary": "A faithful disciple who stays close through the darkest hours and goes to the tomb early on the first day of the week.",
    "relation": "To Jesus: beloved follower who becomes the first recorded witness of the risen Jesus in John's Gospel.",
    "why": "Why she is here: her testimony carries the shock of loss, the empty tomb, and the recognition of the risen Christ."
  },
  "Joanna": {
    "role": "Joanna — woman disciple and witness to the empty tomb",
    "summary": "A follower of Jesus named in Luke among the women who supported Him and later reported the empty tomb to the apostles.",
    "relation": "To Jesus: disciple from the wider circle of women who traveled with and supported His ministry.",
    "why": "Why she is here: Joanna helps represent the women whose witness spans burial, resurrection morning, and the prayerful waiting of Acts 1."
  },
  "Salome": {
    "role": "Salome — Galilean follower and witness at cross and tomb",
    "summary": "Named in Mark among the women who followed Jesus, watched the crucifixion from a distance, and came to the tomb with spices.",
    "relation": "To Jesus: devoted woman disciple from the wider circle that stayed near through His death and burial.",
    "why": "Why she is here: Salome helps keep the women's witness visible in the crucifixion and resurrection scenes."
  },
  "Joseph of Arimathea": {
    "role": "Joseph of Arimathea — respected council member and secret disciple",
    "summary": "A wealthy and influential man who steps forward publicly after Jesus' death to ask Pilate for the body.",
    "relation": "To Jesus: disciple from the margins who risks reputation to honor Him when many others are hiding.",
    "why": "Why he is here: he helps secure Jesus' burial and shows that courage sometimes appears after the crisis breaks."
  },
  "Nicodemus": {
    "role": "Nicodemus — Pharisee, seeker, and quiet ally",
    "summary": "A religious leader who once came to Jesus by night and later assists with His burial.",
    "relation": "To Jesus: cautious but real sympathizer whose spiritual curiosity slowly becomes public loyalty.",
    "why": "Why he is here: his presence shows that even within the religious establishment, some were drawn to Jesus and moved by His death."
  },
  "Cleopas": {
    "role": "Cleopas — traveler on the road to Emmaus",
    "summary": "A follower outside the central apostolic circle, walking home in disappointment until the risen Jesus joins the journey.",
    "relation": "To Jesus: disciple and witness whose heart burns as Scripture is opened and Christ is recognized in the breaking of bread.",
    "why": "Why he is here: Cleopas brings the Emmaus testimony into the room, widening the sense that resurrection is breaking in everywhere."
  },
  "Matthias": {
    "role": "Matthias — chosen to take Judas's place among the Twelve",
    "summary": "Chosen in Acts 1 from among those who had followed Jesus from the beginning and witnessed the resurrection era.",
    "relation": "To Jesus: part of the wider company of disciples and selected to be numbered with the apostles.",
    "why": "Why he is here: Matthias is mentioned during the waiting days because the community is already being ordered for mission before Pentecost."
  }
};

const fallbackTypingBeats = [
  {
    "afterText": "Did you feel that? The earth... it moved.",
    "from": "Peter",
    "side": "left",
    "charClass": "char-peter",
    "duration": 1250
  },
  {
    "afterText": "My son. My firstborn...",
    "from": "John",
    "side": "left",
    "charClass": "char-john",
    "duration": 1500,
    "unsent": true
  },
  {
    "afterNote": "*Peter and John run to the tomb*",
    "from": "John",
    "side": "left",
    "charClass": "char-john",
    "duration": 1050
  },
  {
    "afterText": "We're all here. Doors locked.",
    "from": "Thomas",
    "side": "right",
    "charClass": "char-thomas",
    "duration": 1200
  },
  {
    "afterText": "Back to the upper room. All of us. Waiting for power.",
    "from": "John",
    "side": "left",
    "charClass": "char-john",
    "duration": 1300,
    "unsent": true
  },
  {
    "afterContextText": "The disciples are gathered together when suddenly... a sound like wind fills the room. Tongues of fire rest on each of them.",
    "from": "Peter",
    "side": "left",
    "charClass": "char-peter",
    "duration": 1050
  },
  {
    "afterText": "They're confused! Jews from everywhere... Parthians, Medes, Elamites!",
    "from": "Thomas",
    "side": "right",
    "charClass": "char-thomas",
    "duration": 950
  },
  {
    "afterText": "A cloud took Him from our sight.",
    "from": "Joanna",
    "side": "left",
    "charClass": "char-joanna",
    "duration": 1700,
    "unsent": true
  },
  {
    "afterNote": "*Peter stands to speak.*",
    "from": "Peter",
    "side": "left",
    "charClass": "char-peter",
    "duration": 1250
  }
];

const fallbackConfig = {
  "speeds": {
    "fast": {
      "label": "Fast (4 min)",
      "delay": 1800,
      "id": 1
    },
    "normal": {
      "label": "Normal (10 min)",
      "delay": 4500,
      "id": 2
    },
    "slow": {
      "label": "Slow (20 min)",
      "delay": 9000,
      "id": 3
    }
  },
  "defaultSpeed": "normal",
  "participantCount": {
    "prefix": "participants"
  },
  "scripture": {
    "minWordsDisplayTime": 5200,
    "maxWordsDisplayTime": 9200,
    "baseDelay": 2800,
    "wordsPerSecond": 260
  },
  "scroll": {
    "thresholdPixelsFromBottom": 90,
    "fadeTypingOutDuration": 220,
    "typingIndicatorFadeDelay": 140
  }
};

// Initialize the application
async function initApp() {
    try {
        // Try to load JSON files first (for GitHub Pages)
        const [messagesRes, biosRes, typingBeatsRes, configRes] = await Promise.all([
            fetch('./messages.json'),
            fetch('./bios.json'),
            fetch('./typing-beats.json'),
            fetch('./config.json')
        ]);

        if (!messagesRes.ok || !biosRes.ok || !typingBeatsRes.ok || !configRes.ok) {
            throw new Error('Failed to load JSON files');
        }

        messagesData = await messagesRes.json();
        biosData = await biosRes.json();
        typingBeatsData = await typingBeatsRes.json();
        configData = await configRes.json();

        console.log('Loaded from JSON files');

    } catch (error) {
        console.warn('JSON fetch failed, using fallback data:', error);
        
        // Fall back to inline data for local testing
        messagesData = fallbackMessages;
        biosData = fallbackBios;
        typingBeatsData = fallbackTypingBeats;
        configData = fallbackConfig;
    }

    // Set base delay from config
    if (configData && configData.speeds && configData.speeds[configData.defaultSpeed]) {
        baseDelay = configData.speeds[configData.defaultSpeed].delay;
        selectedSpeed = configData.defaultSpeed;
    } else {
        baseDelay = 4500; // Default fallback
    }

    // Build message sequence and initialize UI
    messages = buildSequence(messagesData);
    
    // Populate speed controls
    populateSpeedControls();
    
    // Update participant count
    updateParticipantCount();

    // Initialize scroll state
    autoFollow = true;
    unseenCount = 0;
    updateNewIndicator();
    hideScriptureBanner(true);
    scrollToBottom(true, true);
    lastScrollTop = chat.scrollTop;

    // Start playback after a short delay
    setTimeout(() => {
        play();
        showScrollButton();
    }, 800);
}

// Speed controls
function populateSpeedControls() {
    speedControlsContainer.innerHTML = '';
    
    if (!configData || !configData.speeds) return;
    
    for (const [key, speed] of Object.entries(configData.speeds)) {
        const button = document.createElement('button');
        button.textContent = speed.label;
        button.id = `speed-${speed.id}`;
        
        if (key === configData.defaultSpeed) {
            button.classList.add('active');
        }
        
        button.onclick = () => setSpeed(speed.id);
        speedControlsContainer.appendChild(button);
    }
}

function setSpeed(level) {
    if (!configData || !configData.speeds) return;
    
    const speedKey = Object.keys(configData.speeds).find(key => 
        configData.speeds[key].id === level
    );
    
    if (speedKey && configData.speeds[speedKey]) {
        selectedSpeed = speedKey;
        baseDelay = configData.speeds[speedKey].delay;

        document.querySelectorAll('.controls button').forEach((btn, i) => {
            btn.classList.toggle('active', i + 1 === level);
        });
    }
}

// Helper functions
function assignConversationSides(items) {
    const resolved = [];
    let lastSpeaker = null;
    let lastSide = 'right';

    for (const item of items) {
        if (!item?.from) {
            resolved.push({ ...item });
            continue;
        }

        const next = { ...item };
        if (lastSpeaker && item.from === lastSpeaker) {
            next.side = lastSide;
        } else {
            next.side = lastSide === 'left' ? 'right' : 'left';
        }

        lastSpeaker = item.from;
        lastSide = next.side;
        resolved.push(next);
    }

    return resolved;
}

function buildSequence(items) {
    const sequence = [];
    const normalizedItems = assignConversationSides(items);

    for (const item of normalizedItems) {
        sequence.push(item);

        if (!typingBeatsData) typingBeatsData = fallbackTypingBeats;
        
        for (const beat of typingBeatsData) {
            const matchesAfterText = beat.afterText && item.text === beat.afterText;
            const matchesAfterNote = beat.afterNote && item.note === beat.afterNote;
            const matchesAfterContext = beat.afterContextText && item.content === beat.afterContextText;

            if (matchesAfterText || matchesAfterNote || matchesAfterContext) {
                sequence.push({ type: 'typing', ...beat });
            }
        }
    }

    return assignConversationSides(sequence);
}

// Bio functions
function clearBioHideTimer() {
    if (bioHideTimer) {
        clearTimeout(bioHideTimer);
        bioHideTimer = null;
    }
}

function positionBio(trigger) {
    if (!trigger) return;
    const triggerRect = trigger.getBoundingClientRect();
    const popRect = bioPopover.getBoundingClientRect();
    const margin = 12;

    let top = triggerRect.bottom + 10;
    if (top + popRect.height > window.innerHeight - margin) {
        top = triggerRect.top - popRect.height - 10;
    }
    if (top < margin) top = margin;

    let left = triggerRect.left;
    if (left + popRect.width > window.innerWidth - margin) {
        left = window.innerWidth - popRect.width - margin;
    }
    if (left < margin) left = margin;

    bioPopover.style.top = `${top}px`;
    bioPopover.style.left = `${left}px`;
}

function hideBio() {
    clearBioHideTimer();
    currentBioTrigger = null;
    bioPopover.classList.remove('visible');
    bioPopover.setAttribute('aria-hidden', 'true');
}

function scheduleHideBio() {
    clearBioHideTimer();
    bioHideTimer = setTimeout(() => {
        if (!bioPopover.matches(':hover')) {
            hideBio();
        }
    }, 120);
}

function showBio(trigger, name) {
    const bio = biosData[name];
    if (!bio) return;

    clearBioHideTimer();
    currentBioTrigger = trigger;
    bioName.textContent = name;
    bioRole.textContent = bio.role;
    bioSummary.innerHTML = `<strong>Who:</strong> ${bio.summary}`;
    bioRelation.innerHTML = `<strong>To Jesus:</strong> ${bio.relation.replace(/^To Jesus:\s*/i, '')}`;
    bioWhy.innerHTML = `<strong>Why here:</strong> ${bio.why.replace(/^Why he is here:\s*/i, '').replace(/^Why she is here:\s*/i, '')}`;
    
    bioPopover.classList.add('visible');
    bioPopover.setAttribute('aria-hidden', 'false');
    positionBio(trigger);
}

function buildNameTrigger(msg) {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = `contact-trigger ${msg.charClass || 'char-peter'}`;
    trigger.textContent = msg.from || '';
    trigger.setAttribute('aria-label', `${msg.from} — view bio`);

    trigger.addEventListener('mouseenter', () => showBio(trigger, msg.from));
    trigger.addEventListener('mouseleave', scheduleHideBio);
    trigger.addEventListener('focus', () => showBio(trigger, msg.from));
    trigger.addEventListener('blur', scheduleHideBio);
    trigger.addEventListener('click', (event) => {
        event.stopPropagation();
        if (bioPopover.classList.contains('visible') && currentBioTrigger === trigger) {
            hideBio();
        } else {
            showBio(trigger, msg.from);
        }
    });

    return trigger;
}

// UI component creation
function updateParticipantCount() {
    const names = new Set(
        messagesData
        .filter(item => item.from && item.from.trim())
        .map(item => item.from.trim())
    );
    participantCount.textContent = `${names.size} ${configData?.participantCount?.prefix || 'participants'}`;
}

function formatTime(minutes) {
    if (typeof minutes !== 'number' || Number.isNaN(minutes)) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    return `${h}:${mins.toString().padStart(2, '0')} ${ampm}`;
}

function updateTimelineState(msg) {
    if (msg.day) {
        currentDayLabel = msg.day;
    }
    if (typeof msg.time === 'number' && !Number.isNaN(msg.time)) {
        currentTimeMinutes = msg.time;
    }
}

function createDayMarker(text) {
    const dayDiv = document.createElement('div');
    dayDiv.className = /Pentecost/i.test(text) ? 'day-marker pentecost-day' : 'day-marker';
    dayDiv.textContent = text;
    return dayDiv;
}

function createContextBox(msg) {
    const contextDiv = document.createElement('div');
    const isPentecost = /Pentecost/i.test(currentDayLabel);
    contextDiv.className = isPentecost ? 'pentecost-box' : 'context-box';

    const em = document.createElement('em');
    em.textContent = msg.content || '';
    contextDiv.appendChild(em);
    return contextDiv;
}

function createNote(msg) {
    const noteDiv = document.createElement('div');
    const isPentecost = /Pentecost/i.test(currentDayLabel);
    noteDiv.className = isPentecost ? 'day-marker pentecost-note' : 'day-marker';
    const em = document.createElement('em');
    em.textContent = (msg.note || '').replace(/^\*|\*$/g, '');
    noteDiv.appendChild(em);
    return noteDiv;
}

function createMessage(msg) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${msg.side || 'left'} pop flash`;

    const nameDiv = document.createElement('div');
    nameDiv.className = 'contact-name';
    nameDiv.appendChild(buildNameTrigger(msg));

    const bubbleDiv = document.createElement('div');
    const bubbleClasses = ['bubble'];
    if (msg.emotional && !msg.pentecostFire) bubbleClasses.push('emotional');
    if (msg.holySpirit) bubbleClasses.push('holy-spirit');
    if (msg.pentecostFire) bubbleClasses.push('pentecost-fire');
    bubbleDiv.className = bubbleClasses.join(' ');
    bubbleDiv.textContent = msg.text || '';

    msgDiv.appendChild(nameDiv);
    msgDiv.appendChild(bubbleDiv);

    if (msg.read) {
        const readDiv = document.createElement('div');
        readDiv.className = 'read-receipt';
        readDiv.textContent = 'Read';
        msgDiv.appendChild(readDiv);
    }

    const timeLabel = formatTime(
        typeof msg.time === 'number' && !Number.isNaN(msg.time)
        ? msg.time
        : currentTimeMinutes
    );

    if (timeLabel) {
        const timestampDiv = document.createElement('div');
        timestampDiv.className = 'timestamp';
        timestampDiv.textContent = timeLabel;
        msgDiv.appendChild(timestampDiv);
    }

    return msgDiv;
}

function createTypingIndicator(item) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message typing-indicator ${item.side || 'left'}`;

    const nameDiv = document.createElement('div');
    nameDiv.className = 'contact-name';
    nameDiv.appendChild(buildNameTrigger(item));

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'bubble';
    bubbleDiv.setAttribute('aria-label', `${item.from} is typing`);

    const srText = document.createElement('span');
    srText.className = 'sr-only';
    srText.textContent = `${item.from} is typing`;
    bubbleDiv.appendChild(srText);

    const dots = document.createElement('span');
    dots.className = 'typing-dots';
    dots.innerHTML = '<span></span><span></span><span></span>';
    bubbleDiv.appendChild(dots);

    const captionDiv = document.createElement('div');
    captionDiv.className = 'typing-caption';
    captionDiv.textContent = item.unsent ? '...' : 'typing…';

    msgDiv.appendChild(nameDiv);
    msgDiv.appendChild(bubbleDiv);
    msgDiv.appendChild(captionDiv);
    return msgDiv;
}

function appendNode(node) {
    chat.insertBefore(node, bottomSentinel);
}

// Scripture banner functions
function hideScriptureBanner(immediate = false) {
    clearTimeout(scriptureTimer);
    scriptureTimer = null;
    scriptureBanner.classList.remove('visible');
    scriptureBanner.classList.add('hidden');
    
    if (immediate) {
        scriptureBannerTag.textContent = '';
        scriptureBannerText.textContent = '';
        scriptureBannerCitation.textContent = '';
        delete scriptureBanner.dataset.tone;
    } else {
        setTimeout(() => {
            if (!scriptureBanner.classList.contains('visible')) {
                scriptureBannerTag.textContent = '';
                scriptureBannerText.textContent = '';
                scriptureBannerCitation.textContent = '';
                delete scriptureBanner.dataset.tone;
            }
        }, 500);
    }
}

function countWords(text = '') {
    return (text.trim().match(/\S+/g) || []).length;
}

function getScriptureDisplayDuration(msg) {
    const words = countWords(`${msg.verseText || ''} ${msg.citation || ''}`);
    if (!configData?.scripture) return Math.max(5200, Math.min(9200, 2800 + (words * 260)));
    
    return Math.max(
        configData.scripture.minWordsDisplayTime, 
        Math.min(
            configData.scripture.maxWordsDisplayTime,
            configData.scripture.baseDelay + (words * configData.scripture.wordsPerSecond)
        )
    );
}

function showScriptureBanner(msg) {
    hideScriptureBanner(true);
    scriptureBannerTag.textContent = msg.tag || 'Scripture';
    scriptureBannerText.textContent = msg.verseText || '';
    scriptureBannerCitation.textContent = msg.citation || '';
    
    if (msg.tone) {
        scriptureBanner.dataset.tone = msg.tone;
    } else {
        delete scriptureBanner.dataset.tone;
    }

    requestAnimationFrame(() => {
        scriptureBanner.classList.remove('hidden');
        scriptureBanner.classList.add('visible');
    });

    const visibleFor = getScriptureDisplayDuration(msg);
    scriptureTimer = setTimeout(() => {
        hideScriptureBanner();
    }, visibleFor - 450);

    return visibleFor;
}

// Scroll functions
function isNearBottom() {
    if (!configData?.scroll) return chat.scrollHeight - chat.scrollTop - chat.clientHeight < 90;
    return chat.scrollHeight - chat.scrollTop - chat.clientHeight < configData.scroll.thresholdPixelsFromBottom;
}

function updateNewIndicator() {
    if (autoFollow || unseenCount === 0) {
        newIndicator.classList.remove('visible');
        newIndicator.textContent = 'New messages below';
        return;
    }

    newIndicator.textContent = unseenCount === 1
    ? '1 new message below'
    : `${unseenCount} new messages below`;
    newIndicator.classList.add('visible');
}

function showScrollButton() {
    if (autoFollow || isNearBottom()) {
        scrollBtn.classList.remove('visible');
    } else {
        scrollBtn.classList.add('visible');
    }
}

function performScrollToBottom(immediate = false) {
    const token = ++followScrollToken;
    suppressScrollListener = true;
    const behavior = immediate ? 'auto' : 'smooth';

    requestAnimationFrame(() => {
        if (token !== followScrollToken || userPausedLive) return;
        bottomSentinel.scrollIntoView({ block: 'end', behavior });

        setTimeout(() => {
            if (token !== followScrollToken || userPausedLive) {
                suppressScrollListener = false;
                return;
            }
            bottomSentinel.scrollIntoView({ block: 'end', behavior: 'auto' });
            lastScrollTop = chat.scrollTop;
            suppressScrollListener = false;
            showScrollButton();
        }, immediate ? 0 : (configData?.scroll?.typingIndicatorFadeDelay || 140));
    });
}

function scrollToBottom(force = true, immediate = false) {
    if (userPausedLive && !force) {
        showScrollButton();
        return;
    }
    
    if (force || autoFollow || isNearBottom()) {
        performScrollToBottom(immediate);
        return;
    }
    
    showScrollButton();
}

function resumeLiveFollow() {
    userPausedLive = false;
    autoFollow = true;
    unseenCount = 0;
    updateNewIndicator();
    scrollToBottom(true, true);
}

function pauseLiveFollow() {
    if (userPausedLive) return;
    userPausedLive = true;
    autoFollow = false;
    followScrollToken += 1;
    suppressScrollListener = false;
    updateNewIndicator();
    showScrollButton();
}

// Timing and delay calculations
function isImpactLine(text = '') {
    return /(it is finished|my lord and my god|he said my name|the stone is moved|the tomb is empty|a cloud took him|three thousand|receive the holy spirit|he is not here|it is him|my son|we stay\. we do not look away\.|feed my sheep)/i.test(text);
}

function isQuickReply(text = '') {
    return /^(No\.?|Yes\.?|Go\.?|Me too\.?|Brother\.?|Already gone\.?|Praise God\.?|Here\?)$/i.test(text.trim());
}

function getTransitionDelay(currentItem, nextItem) {
    let delay = baseDelay;

    if (!currentItem) {
        return delay;
    }

    if (currentItem.day) delay *= 0.84;
    if (currentItem.note) delay *= 0.90;
    if (currentItem.context) delay *= 1.12;
    if (currentItem.type === 'verse') delay *= 1.08;

    if (currentItem.from && currentItem.text) {
        const words = countWords(currentItem.text);
        delay += Math.min(words * 34, 950);

        if (words <= 2) delay *= 0.52;
        else if (words <= 5) delay *= 0.68;
        else if (words <= 10) delay *= 0.82;
        else if (words >= 18) delay *= 1.12;

        if (currentItem.emotional) delay *= 1.18;
        if (isImpactLine(currentItem.text)) delay *= 1.18;
        if (/…|\.\\.\\.\\./.test(currentItem.text)) delay *= 1.08;
        if (isQuickReply(currentItem.text)) delay *= 0.70;
        if (/\\?$/.test(currentItem.text)) delay *= 0.94;
    }

    if (nextItem?.from && currentItem?.from && nextItem.from === currentItem.from) {
        delay *= 0.72;
    }
    
    if (nextItem?.type === 'verse') {
        delay *= 1.08;
    }

    if (nextItem?.from && nextItem.text) {
        const nextWords = countWords(nextItem.text);
        if (nextWords <= 4) delay *= 0.86;
        if (isQuickReply(nextItem.text)) delay *= 0.82;
    }

    const jitter = 0.86 + Math.random() * 0.34;
    delay *= jitter;

    return delay;
}

// Playback control functions
function play() {
    if (!messages || currentMsg >= messages.length) return;
    
    const item = messages[currentMsg];
    
    // Skip empty items
    if (!item) {
        advancePlayback();
        return;
    }

    // Handle day markers
    if (item.day) {
        if (currentDayLabel !== item.day) {
            currentDayLabel = item.day;
            chat.appendChild(createDayMarker(item.day));
        }
        advancePlayback();
        return;
    }

    // Handle context blocks
    if (item.context) {
        chat.appendChild(createContextBox(item));
        advancePlayback();
        return;
    }

    // Handle notes
    if (item.note || (typeof item.time === 'number' && !isNaN(item.time))) {
        chat.appendChild(createNote(item));
        advancePlayback();
        return;
    }

    // Handle typing indicators
    if (item.type === 'typing') {
        chat.appendChild(createTypingIndicator(item));
        
        const delay = getTransitionDelay(null, item);
        setTimeout(() => {
            nextTimer = null;
            currentMsg++;
            play();
        }, item.duration || 1000);
        return;
    }

    // Handle regular messages
    if (item.from && item.text) {
        chat.appendChild(createMessage(item));
        
        const delay = getTransitionDelay(null, item);
        setTimeout(() => {
            nextTimer = null;
            currentMsg++;
            play();
        }, delay);
        return;
    }

    // Fallback: advance and continue
    advancePlayback();
}

function advancePlayback() {
    if (!messages || currentMsg >= messages.length) return;
    
    const delay = getTransitionDelay(null, messages[currentMsg]);
    setTimeout(() => {
        nextTimer = null;
        play();
    }, Math.max(400, delay));
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});
