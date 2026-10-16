// Knowledge base for the Ask AI assistant. PUBLIC information only.
// No phone number, no address, no email, no date of birth, no ID numbers.
// Every chunk mirrors what is already public on nge-portfolio.vercel.app or
// confirmed resume facts Ganesh approved for the assistant.
export const KB = [
  {
    id: 'about',
    keywords: ['who', 'ganesh', 'about', 'yourself', 'bio', 'person', 'naga', 'eswar', 'gangisetty'],
    text: 'Naga Ganesh Eswar Gangisetty (Ganesh) is a final-year Computer Engineering diploma student and a full-stack builder and creative technologist. He works across software, interactive worlds, filmmaking and AI music. His site describes him as "one person, many ways to build".'
  },
  {
    id: 'skills',
    keywords: ['skill', 'skills', 'stack', 'language', 'languages', 'code', 'coding', 'java', 'python', 'javascript', 'tech'],
    text: 'Ganesh codes in Java, C and Python, and Android with Java and XML, and keeps improving. He uses Git and GitHub. His JavaScript is basic and growing, and he is learning MongoDB and React. Many of his web and app projects were built with AI assistance, with parts coded personally. He is comfortable using AI tools to design, build and ship real products.'
  },
  {
    id: 'education',
    keywords: ['education', 'college', 'study', 'studies', 'diploma', 'degree', 'school', 'student', 'marks', 'aggregate', 'polytechnic', 'graduation'],
    text: 'Ganesh is in the final year of a Diploma in Computer Engineering at Government Polytechnic, Dharmavaram, expected to finish in April 2027. His aggregate so far is 92.93% (2602 out of 2800). He completed schooling at Jeevan Jyothi E.M. High School in 2024 with 565 out of 600 (94.2%) in SSC.'
  },
  {
    id: 'experience',
    keywords: ['experience', 'internship', 'internships', 'work', 'job', 'worked', 'inamigos', 'yuvaintern', 'henry', 'harvin'],
    text: 'Ganesh completed a web development internship at InAmigos Foundation (20 Aug to 3 Sep 2026): an NGO awareness webpage, website analysis, an AI-assisted website and Figma feature layouts. He completed a YuvaIntern / Henry Harvin Data Science with Python trainee programme, and did a YuvaIntern Cloud Computing programme (Sep to Nov 2026) submitting six cloud tasks. He also does freelance video editing and AI content.'
  },
  {
    id: 'certificates',
    keywords: ['certificate', 'certificates', 'certification', 'course', 'courses', 'ibm', 'skillsbuild', 'training'],
    text: 'Certificates and training: IBM SkillsBuild "Foundations in Generative AI" (completed 22 Mar 2026), InAmigos Foundation internship completion letter, YuvaIntern Data Science with Python, and YuvaIntern Cloud Computing coursework.'
  },
  {
    id: 'projects-overview',
    keywords: ['projects', 'portfolio', 'everything', 'all', 'overview', 'list', 'built', 'made', 'work'],
    text: 'Ganesh has built 17 featured projects: Palzy (college social platform), Smart Attendance (170+ daily student users), Drift (music discovery), APIT (open-source agent policy tests), TinyLLM (offline Android LLM), GRIB (knowledge assistant), IP-SAKTI Sahayak (AYUSH IP guide), Chapp (encrypted chat), RelayClip Lite (clipboard relay), Neural Network Playground, Cloud Notes API, Exam Hall Watch (3D game), Neon Coast (Three.js game), GaneshOS (Linux desktop), Mana Katha (Telugu kirana ledger), Swara Keyboard and AI Resume Builder. Ask about any one of them by name for details.'
  },
  {
    id: 'palzy',
    keywords: ['palzy', 'social', 'campus', 'app', 'college app'],
    text: 'Palzy is a college-exclusive social platform Ganesh is building: React and Firebase with authentication, feed, stories, a campus board and moderation tools, packaged as a PWA, with an Android app in progress. It launched within his college. Source: github.com/ShortEditor/palzy'
  },
  {
    id: 'attendance',
    keywords: ['attendance', 'students', 'faculty', 'college platform', 'portal'],
    text: 'The Smart Attendance platform is a multi-role college academic platform (student, faculty and admin portals) used daily by over 170 students at his college. Built with JavaScript and Firebase. Source: github.com/ShortEditor/gpt-attendance-ui'
  },
  {
    id: 'drift',
    keywords: ['drift', 'music discovery', 'songs', 'music app'],
    text: 'Drift is a music-discovery app: a reels-style interface where you scroll real tracks, hear 30-second previews and save what moves you. Built with React, TypeScript and Vite as a personal prototype, with an Android prototype too. Live at drift-music-scroll.vercel.app. Source: github.com/ShortEditor/drift'
  },
  {
    id: 'apit',
    keywords: ['apit', 'agent', 'policy', 'tests', 'testing', 'open source'],
    text: 'APIT (Agent Policy Interop Tests) is Ganesh\'s open-source Python project: deterministic tests for AI agent policies covering allow, deny, transform, approval and replay, with eight scenarios and faulty adapters, using the standard-library unittest. Apache-2.0. Source: github.com/ShortEditor/apit'
  },
  {
    id: 'tinyllm',
    keywords: ['tinyllm', 'offline', 'llm', 'language model', 'android ai'],
    text: 'TinyLLM is an offline Android language-model app built with Kotlin and Jetpack Compose, running existing small open models (0.5B class) through MediaPipe on device. v1.1 added editable prompt and context options and RAM checks.'
  },
  {
    id: 'grib',
    keywords: ['grib', 'knowledge', 'assistant', 'rag', 'notes'],
    text: 'GRIB is a personal knowledge assistant: notes and chat that keep local models in the conversation, built with React, Node, Express and MongoDB with Groq, and a ChromaDB/Ollama RAG variant. Source: github.com/ShortEditor/grib'
  },
  {
    id: 'ipsakti',
    keywords: ['ip', 'sakti', 'sahayak', 'ayush', 'patent', 'sih', 'hackathon'],
    text: 'IP-SAKTI Sahayak is a Smart India Hackathon (SIH-26045) prototype: evidence-grounded AI guidance for AYUSH innovators navigating intellectual property, with role-based intake, prior-art and biodiversity workflows. Source: github.com/ShortEditor/ipshakthi'
  },
  {
    id: 'chapp',
    keywords: ['chapp', 'chat', 'messaging', 'encrypted', 'encryption'],
    text: 'Chapp is a realtime encrypted-messaging project: ECDH key exchange with AES-GCM, Socket.IO chat, WebRTC calls, local storage, Supabase and Redis.'
  },
  {
    id: 'relayclip',
    keywords: ['relayclip', 'clipboard', 'sync', 'relay'],
    text: 'RelayClip Lite is a clipboard and file relay: WebSocket-based sync between phone, Windows and web, with room pairing and a PWA.'
  },
  {
    id: 'nn-playground',
    keywords: ['neural', 'network', 'playground', 'visualization', 'ml'],
    text: 'Neural Network Playground is an interactive browser simulator that runs fully client-side: train a small network on datasets, add layers, and watch decision boundaries and loss visualizations. Live at neural-network-playground.vercel.app.'
  },
  {
    id: 'cloud-notes',
    keywords: ['cloud notes', 'notes api', 'flask', 'rest', 'api'],
    text: 'Cloud Notes API is a cloud training project: six task folders covering a Flask notes REST API with SQLite, tests, CI and deployment materials. Source: github.com/ShortEditor/cloud-notes-api'
  },
  {
    id: 'exam-hall',
    keywords: ['exam', 'hall', 'watch', 'game', '3d', 'anomaly'],
    text: 'Exam Hall Watch is a 3D spot-the-anomaly browser game built with Three.js, set in a dim exam hall: find what changed between rounds, or call ALL CLEAR. Live at exam-hall-watch-v2.vercel.app.'
  },
  {
    id: 'neon-coast',
    keywords: ['neon', 'coast', 'game', 'three.js', 'threejs'],
    text: 'Neon Coast is a Three.js browser game with a neon visual style, one of Ganesh\'s interactive world experiments.'
  },
  {
    id: 'ganeshos',
    keywords: ['ganeshos', 'os', 'operating system', 'desktop', 'linux'],
    text: 'GaneshOS is a personal desktop operating system prototype in development, built on Linux with Debian underneath, shaped into a Mac-style desktop with custom window controls on top.'
  },
  {
    id: 'mana-katha',
    keywords: ['mana', 'katha', 'kirana', 'ledger', 'telugu', 'voice'],
    text: 'Mana Katha is a Telugu + English credit-ledger app for a kirana shop, built as an Android prototype that works offline-first: speak an entry and the app writes it and answers back.'
  },
  {
    id: 'swara',
    keywords: ['swara', 'keyboard', 'tenglish', 'typing'],
    text: 'Swara Keyboard is an early Android keyboard prototype with Tenglish (Telugu + English) suggestions, basic autocorrect and optional Groq-powered answers.'
  },
  {
    id: 'resume-builder',
    keywords: ['resume', 'builder', 'cv'],
    text: 'AI Resume Builder is a live web app that helps build resumes with AI assistance. Live at resume-builder-mocha-pi.vercel.app.'
  },
  {
    id: 'telugu-poetry',
    keywords: ['poetry', 'poem', 'telugu model', 'gemma', 'lora', 'fine-tune', 'finetune'],
    text: 'Ganesh runs experiments fine-tuning Gemma 3 with LoRA on Telugu poetry and verse-meaning pairs, checking metre, rhyme and endings. It is learning work in progress: form improved in small tests, meaning and grammar remain weak.'
  },
  {
    id: 'films',
    keywords: ['film', 'films', 'movie', 'short film', 'directed', 'video', 'editing', 'detective', 'arjun', 'alien'],
    text: 'Ganesh directs and edits short films: Detective Arjun, Alien Hand 3 and The Last Guest (watchable on YouTube at youtu.be/-Rs5eojZBFs). He also does freelance video editing and AI visual storytelling, including mythology-based visuals.'
  },
  {
    id: 'music',
    keywords: ['music', 'song', 'songs', 'spotify', 'track', 'tracks', 'album', 'sound', 'ai music'],
    text: 'Ganesh makes AI music, released on Spotify as Naga Ganesh Eswar: Sudarshan Dhari (2024), Venkateshwara Raaga (2024), the Detective Arjun theme (2025) and Shantakaram. "Sudarshan Dhari" appears in Alien Hand 3. Spotify: open.spotify.com/artist/6JmItTt1toKBqvRYqixH2h'
  },
  {
    id: 'nge-layer-method',
    keywords: ['layer', 'method', 'nge layer', 'prompt', 'framework'],
    text: 'The NGE Layer Method is Ganesh\'s original prompt framework for AI music with six layers: Emotion, Environment, Story, Sound Design, Vocal Character and Mix. Start with a feeling, build toward the mix.'
  },
  {
    id: 'contact',
    keywords: ['contact', 'reach', 'social', 'instagram', 'github', 'linkedin', 'follow', 'connect', 'hire', 'collaborate', 'email'],
    text: 'You can find Ganesh on Instagram (@short_editor), GitHub (ShortEditor) and LinkedIn (Gangisetty Naga Ganesh Eswar). His portfolio is nge-portfolio.vercel.app. I do not have a public email or phone number to share.'
  },
  {
    id: 'other-builds',
    keywords: ['marks', 'tracker', 'shortboxd', 'face recognition', 'supplylink', 'campus', 'visualizer', 'projects', 'other'],
    text: 'Other builds include Marks Tracker, Shortboxd, Face Recognition Attendance, SupplyLink, a 3D Campus Explorer (with Rishi) and a Browser Audio Visualizer. The full list of 17 featured projects is on his portfolio under "The work".'
  }
];
