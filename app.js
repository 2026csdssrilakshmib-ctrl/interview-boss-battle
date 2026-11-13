/**
 * Interview Boss Battle - Interactive Gamified Interview Simulator
 * 4-Paths Portal, Judge Verification Path, & Engine
 */

// Sound Synthesizer (Web Audio API - zero external assets needed)
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playBossRoar() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.35);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  playDamage() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.12);
    });
  }

  playStartBattle() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [261.63, 329.63, 392.00, 523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.06, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.08);
    });
  }

  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const notes = [
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.15 },
      { f: 1046.5, d: 0.45 }
    ];
    let time = this.ctx.currentTime;
    notes.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = note.f;
      gain.gain.setValueAtTime(0.09, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + note.d);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + note.d);
      time += note.d * 0.85;
    });
  }
}

const sfx = new SoundFX();

// 10 Detailed Questions
const QUESTIONS_DB = [
  {
    id: 1,
    category: "The Elevator Pitch",
    bossDialogue: "Let's see if you can introduce yourself without reading your entire resume from birth to present.",
    question: "The hiring manager asks: 'Tell me about yourself and why you're interested in this role.' How do you open the conversation?",
    isStar: false,
    tipKey: "intro",
    options: [
      {
        key: "A",
        text: "I was born in Chicago, always loved video games since elementary school, graduated with 3.4 GPA, worked at company X fixing random bugs for two years, and I really need this job because I want remote flexibility.",
        isCorrect: false,
        candidateHpChange: -20,
        bossHpChange: 0,
        bossReaction: "Too personal and unstructured! An interview opener should focus on professional value, not your life biography.",
        feedback: "Poor opener: Sharing childhood hobbies and personal convenience needs fails to show what value you provide to the team."
      },
      {
        key: "B",
        text: "I am a full-stack engineer with 4 years specializing in high-throughput APIs. Recently led a migration that cut latency by 35%. I'm excited about your scale and here to build resilient payment pipelines.",
        isCorrect: true,
        candidateHpChange: 10,
        bossHpChange: -15,
        bossReaction: "Sharp, concise, and focused on business value! You've captured my attention.",
        feedback: "Excellent! The Present-Past-Future framework: state who you are, highlight a recent measurable win, and connect your goals directly to the company's mission."
      },
      {
        key: "C",
        text: "I can literally do everything. Frontend, backend, machine learning, DevOps, blockchain. Whatever stack you throw at me, I will conquer it overnight.",
        isCorrect: false,
        candidateHpChange: -10,
        bossHpChange: 0,
        bossReaction: "Overpromising red flag. Jack of all trades usually means surface-level knowledge.",
        feedback: "Overpromising damages credibility. Senior interviewers value focused depth and self-awareness over claims of mastering every technology."
      },
      {
        key: "D",
        text: "My resume details all of that. Did the recruiting team forward you my full portfolio?",
        isCorrect: false,
        candidateHpChange: -25,
        bossHpChange: 0,
        bossReaction: "Defensive right at the start? That's an immediate teamwork red flag.",
        feedback: "Never tell an interviewer to 'read your resume'. This question tests verbal clarity, executive presence, and communication style."
      }
    ]
  },
  {
    id: 2,
    category: "Scalability & Architecture",
    bossDialogue: "A marketing campaign just went viral! Traffic spiked 10x in 2 minutes, and database CPU is at 99%. Defend the system!",
    question: "During a flash sale spike, your database CPU hits 99% and checkout API requests are timing out. What is your immediate and architectural mitigation?",
    isStar: false,
    tipKey: "tech",
    options: [
      {
        key: "A",
        text: "Add read replicas, route read-heavy catalog queries away from the primary DB, enable Redis caching for hot products, and activate rate limiting on non-critical endpoints.",
        isCorrect: true,
        candidateHpChange: 10,
        bossHpChange: -20,
        bossReaction: "A layered, pragmatic defense! You relieved the DB bottleneck without dropping purchases.",
        feedback: "Outstanding system design move: Offloading reads to replicas/cache, shielding the primary write node, and graceful degradation protect revenue."
      },
      {
        key: "B",
        text: "Immediately vertically upgrade the primary database machine to the maximum cloud tier and restart the database service.",
        isCorrect: false,
        candidateHpChange: -15,
        bossHpChange: 0,
        bossReaction: "Restarting during an active flash sale drops every active customer cart! Ouch.",
        feedback: "Vertical scaling during a live outage causes downtime and drops ongoing transactions. Layered caching and read isolation are much safer."
      },
      {
        key: "C",
        text: "Immediately message the marketing team and demand they pause the promo campaign until we refactor the backend.",
        isCorrect: false,
        candidateHpChange: -20,
        bossHpChange: 0,
        bossReaction: "Engineering serves business velocity, not the other way around. You can't just kill revenue.",
        feedback: "Blaming marketing creates siloed friction. Engineers must anticipate spikes and implement graceful degradation instead of shutting down sales."
      },
      {
        key: "D",
        text: "Rewrite the database access layer in Rust or Go right now on the production server.",
        isCorrect: false,
        candidateHpChange: -25,
        bossHpChange: 0,
        bossReaction: "Live code rewriting during peak outage?! That's catastrophic chaos!",
        feedback: "Never perform unvalidated rewrites during an active production emergency. Stick to proven traffic shedding and caching controls."
      }
    ]
  },
  {
    id: 3,
    category: "Incident Response",
    bossDialogue: "Tick tock... 15 minutes before the Friday evening deployment freeze, a critical vulnerability is detected.",
    question: "A high-severity data leakage bug is found in staging right before the Friday 5 PM release freeze. What is your sequence of actions?",
    isStar: false,
    tipKey: "incident",
    options: [
      {
        key: "A",
        text: "Push a quick untested hotfix straight to production main branch to beat the 5 PM cutoff.",
        isCorrect: false,
        candidateHpChange: -25,
        bossHpChange: 0,
        bossReaction: "Bypassing CI/CD pipeline on a Friday night? That's how multi-million dollar outages are born!",
        feedback: "Risky heroics: Unvetted hotfixes bypass safety guards and almost always trigger secondary cascade failures."
      },
      {
        key: "B",
        text: "Halt the release, notify release incident command, isolate the affected module, verify on staging, and schedule a calm deployment after full regression testing.",
        isCorrect: true,
        candidateHpChange: 10,
        bossHpChange: -20,
        bossReaction: "Calm, disciplined, and prioritizing system safety over rushed deadlines.",
        feedback: "Spot on! Respecting deployment freezes and incident protocols preserves stability and builds stakeholder trust."
      },
      {
        key: "C",
        text: "Pretend not to see the notification until Monday morning so the team doesn't have their weekend disrupted.",
        isCorrect: false,
        candidateHpChange: -30,
        bossHpChange: 0,
        bossReaction: "Zero ownership! Integrity failure deals severe damage to candidate trust.",
        feedback: "Failing to report security bugs violates engineering ethics and leaves customer data exposed."
      },
      {
        key: "D",
        text: "Tag the engineer whose commit introduced the bug in Slack and let them deal with it alone.",
        isCorrect: false,
        candidateHpChange: -15,
        bossHpChange: 0,
        bossReaction: "Blameless culture is non-negotiable here. We solve problems as an engineering collective.",
        feedback: "Incidents are systemic, not individual blame games. Modern high-performing teams practice blameless collaboration."
      }
    ]
  },
  {
    id: 4,
    category: "Trade-offs & Technical Debt",
    bossDialogue: "Management wants 3 new features this month, but your codebase has accumulated technical debt. Prove your negotiation chops!",
    question: "The Product Manager pushes to deliver 3 critical features in two weeks, but technical debt in that service is slowing down PRs and increasing error rates. How do you handle this?",
    isStar: false,
    tipKey: "tradeoff",
    options: [
      {
        key: "A",
        text: "Refuse to write a single line of feature code until leadership grants a 2-month complete refactoring freeze.",
        isCorrect: false,
        candidateHpChange: -15,
        bossHpChange: 0,
        bossReaction: "A total freeze is unrealistic. Companies lose market share when feature delivery stops completely.",
        feedback: "Blanket refactoring ultimatums fail because business cannot halt. Technical improvements must be incremental."
      },
      {
        key: "B",
        text: "Ignore the tech debt, write rushed code, and leave comments saying '// TODO: fix this later' for future developers.",
        isCorrect: false,
        candidateHpChange: -20,
        bossHpChange: 0,
        bossReaction: "Technical debt bankruptcy! That '// TODO' will haunt this codebase for 5 years.",
        feedback: "Piling on debt without mitigation leads to brittle software and inevitable team burnout."
      },
      {
        key: "C",
        text: "Translate the technical debt into business impact (e.g. bug risk & release cycle time), negotiate feature scope, and allocate 20% of capacity to refactor critical bottlenecks alongside top features.",
        isCorrect: true,
        candidateHpChange: 10,
        bossHpChange: -20,
        bossReaction: "Translating technical risk into business metrics is true senior engineer leadership!",
        feedback: "Top tier: Framing tech debt as business risk (reliability, sprint velocity) allows healthy compromise and sustainable delivery."
      },
      {
        key: "D",
        text: "Work 80-hour weeks in secret to fix all the technical debt and deliver the features simultaneously.",
        isCorrect: false,
        candidateHpChange: -15,
        bossHpChange: 0,
        bossReaction: "Hero syndrome leads to burnout and unvetted code. We build sustainable teams.",
        feedback: "Hero culture is an anti-pattern. Sustainable engineering relies on clear capacity planning and transparent communication."
      }
    ]
  },
  {
    id: 5,
    category: "⭐ BEHAVIORAL BOSS ROUND: STAR METHOD",
    bossDialogue: "Time for the behavioral trial! Structure your answer with Situation, Task, Action, and Result (STAR) or face heavy resistance!",
    question: "Behavioral Challenge: 'Tell me about a time you had a strong technical disagreement with a team member or lead. How did you resolve it?'",
    isStar: true,
    tipKey: "star",
    options: [
      {
        key: "A",
        text: "A peer wanted to use MongoDB for relational banking transactions. I argued in Slack for 3 days until he gave up because I had more years of experience.",
        isCorrect: false,
        candidateHpChange: -25,
        bossHpChange: 0,
        bossReaction: "No STAR structure! Ego-driven, combative, and lacks objective technical evaluation.",
        feedback: "Unstructured answer: Relies on arguing and authority rather than objective benchmarks and measurable results."
      },
      {
        key: "B",
        text: "[S] At my last company, our API needed an event queue for high-volume orders. The lead favored custom polling scripts.\n[T] My responsibility was ensuring we handled 5,000 TPS with zero dropped events.\n[A] I built a 1-day benchmark POC comparing polling vs RabbitMQ with latency telemetry and presented the data in a collaborative 1-on-1.\n[R] The lead embraced the data; we launched with RabbitMQ handling 12M daily events with 99.99% reliability and zero message drops.",
        isCorrect: true,
        candidateHpChange: 15,
        bossHpChange: -30,
        bossReaction: "CRITICAL HIT! Flawless STAR formulation: Situation, Task, data-driven Action, and quantifiable Result!",
        feedback: "Masterclass STAR answer! Notice how it defines the context (S), ownership (T), constructive data-backed steps (A), and measurable business impact (R)."
      },
      {
        key: "C",
        text: "We disagreed on whether to use GraphQL or REST. We debated in a meeting, decided on GraphQL, and the project went pretty smoothly overall.",
        isCorrect: false,
        candidateHpChange: -10,
        bossHpChange: 0,
        bossReaction: "Too vague. What was your specific action? What was the quantifiable result?",
        feedback: "Lacks depth: The STAR model requires detailing your personal action and concrete, measurable outcomes."
      },
      {
        key: "D",
        text: "I disagreed, but since the lead was higher rank, I just stayed quiet. When the service crashed 2 months later, I reminded everyone I had doubted it.",
        isCorrect: false,
        candidateHpChange: -30,
        bossHpChange: 0,
        bossReaction: "'I told you so' is the ultimate culture poison. Passive-aggressive behavior deals critical confidence loss!",
        feedback: "Severe red flag: Passive compliance followed by blame damages team psychological safety and trust."
      }
    ]
  },
  {
    id: 6,
    category: "Ownership & Failure",
    bossDialogue: "Nobody has an unblemished record. Let's see how you talk about mistakes without deflecting blame.",
    question: "Interviewer asks: 'Tell me about a project that failed or missed its promised delivery deadline. What happened and what did you learn?'",
    isStar: false,
    tipKey: "ownership",
    options: [
      {
        key: "A",
        text: "Honestly, none of my projects have ever failed. When team members slip up, I usually step in and ensure complete success.",
        isCorrect: false,
        candidateHpChange: -20,
        bossHpChange: 0,
        bossReaction: "Everyone makes mistakes. Claiming perfection signals lack of self-awareness or lack of real experience.",
        feedback: "Avoid claiming you've never failed. Hiring managers look for vulnerability, self-awareness, and lessons learned from setbacks."
      },
      {
        key: "B",
        text: "We underestimated third-party API latency, causing a 3-week delay. I owned the estimation gap, implemented contract testing and circuit mocks, and delivered our next two milestones 10% ahead of schedule.",
        isCorrect: true,
        candidateHpChange: 10,
        bossHpChange: -20,
        bossReaction: "Honest ownership, clear root-cause analysis, and permanent process improvement. Well played!",
        feedback: "Exemplary reflection: Acknowledge the shortfall without excuses, explain the root cause, and prove how you upgraded your workflow."
      },
      {
        key: "C",
        text: "The product manager kept changing specifications every week, and the frontend engineers were too slow to execute my backend design.",
        isCorrect: false,
        candidateHpChange: -20,
        bossHpChange: 0,
        bossReaction: "Blaming cross-functional colleagues makes you appear difficult to work with.",
        feedback: "Pointing fingers at product managers or teammates indicates defensive habits rather than leadership."
      },
      {
        key: "D",
        text: "We failed because Agile methodology is inherently flawed. If the company used Waterfall, everything would have worked.",
        isCorrect: false,
        candidateHpChange: -15,
        bossHpChange: 0,
        bossReaction: "Blaming broad methodologies distracts from tactical execution lessons.",
        feedback: "Focus on execution levers within your influence rather than criticizing abstract frameworks."
      }
    ]
  },
  {
    id: 7,
    category: "Ambiguity & Execution",
    bossDialogue: "Real-world engineering specs are never clean. How do you move when the requirements are foggy?",
    question: "You receive a 1-page spec with vague requirements stating: 'Make our search experience 10x faster and more intuitive.' What is your first step?",
    isStar: false,
    tipKey: "ambiguity",
    options: [
      {
        key: "A",
        text: "Start coding immediately and build what you think 'intuitive' means based on your personal preferences.",
        isCorrect: false,
        candidateHpChange: -20,
        bossHpChange: 0,
        bossReaction: "Coding without alignment leads to massive rework when stakeholders disagree with your assumptions.",
        feedback: "Premature implementation based on assumptions is a common trap. Clarify criteria before writing code."
      },
      {
        key: "B",
        text: "Define measurable metrics (e.g. p95 search latency < 150ms, conversion rate +8%), gather user drop-off data, interview stakeholders, and write an RFC with clear non-goals.",
        isCorrect: true,
        candidateHpChange: 10,
        bossHpChange: -20,
        bossReaction: "You transformed subjective wishes into quantifiable engineering milestones! That's senior maturity.",
        feedback: "Senior impact: Turn ambiguous phrases like 'faster and intuitive' into hard KPIs, customer data, and an aligned RFC."
      },
      {
        key: "C",
        text: "Reject the ticket back to the product team with a comment: 'Spec incomplete, rejected.'",
        isCorrect: false,
        candidateHpChange: -15,
        bossHpChange: 0,
        bossReaction: "Bureaucratic gatekeeping slows down the entire organization.",
        feedback: "Senior engineers collaborate to flesh out ambiguity rather than acting as adversarial ticket bouncers."
      },
      {
        key: "D",
        text: "Wait silently until next month's quarterly planning meeting to ask for clarification.",
        isCorrect: false,
        candidateHpChange: -15,
        bossHpChange: 0,
        bossReaction: "Passivity stalls company momentum.",
        feedback: "High-agency engineers drive clarity proactively instead of waiting weeks for others to resolve blockers."
      }
    ]
  },
  {
    id: 8,
    category: "The 'I Don't Know' Test",
    bossDialogue: "Let's test your intellectual honesty. How do you react when you don't know the exact answer?",
    question: "The interviewer asks you an intricate question about internal consensus mechanics of a protocol you have never worked with. How do you respond?",
    isStar: false,
    tipKey: "honesty",
    options: [
      {
        key: "A",
        text: "I haven't implemented that specific protocol in production, but from consensus principles: it balances leader election with quorum replication to prevent split-brain. I'd love to learn how your team applies it here.",
        isCorrect: true,
        candidateHpChange: 10,
        bossHpChange: -20,
        bossReaction: "Honest humility paired with first-principles reasoning! Much better than bluffing.",
        feedback: "Admitting knowledge limits while demonstrating foundational logic and curiosity is a huge green flag for interviewers."
      },
      {
        key: "B",
        text: "Pretend you know it completely and invent technical buzzwords like 'quantum sharding algorithms' hoping they won't notice.",
        isCorrect: false,
        candidateHpChange: -30,
        bossHpChange: 0,
        bossReaction: "BLUFF DETECTED! Fabricating answers destroys all technical credibility in seconds.",
        feedback: "Never bluff an experienced interviewer. They will probe deeper, and catching a fabrication is an automatic reject."
      },
      {
        key: "C",
        text: "Why are you asking trivia questions? In real life, everyone just uses Google and ChatGPT.",
        isCorrect: false,
        candidateHpChange: -20,
        bossHpChange: 0,
        bossReaction: "Defensiveness under pressure shows low resilience.",
        feedback: "Even if a question feels like trivia, responding defensively signals friction in difficult discussions."
      },
      {
        key: "D",
        text: "Just say 'I don't know' and stay completely silent until the interviewer moves on.",
        isCorrect: false,
        candidateHpChange: -10,
        bossHpChange: 0,
        bossReaction: "Honest, but misses the opportunity to demonstrate your problem-solving thought process.",
        feedback: "While honesty is good, add your adjacent knowledge or ask clarifying questions to show how you explore unknowns."
      }
    ]
  },
  {
    id: 9,
    category: "Team Culture & Mentorship",
    bossDialogue: "You notice a team member struggling with code standards. How do you uplift the team without crushing morale?",
    question: "A mid-level engineer on your team submits a 2,500-line pull request with zero automated tests, and this is their third time doing it. What do you do?",
    isStar: false,
    tipKey: "mentorship",
    options: [
      {
        key: "A",
        text: "Reject the PR in public Slack with: 'This is unacceptable. Did you even test this?'",
        isCorrect: false,
        candidateHpChange: -20,
        bossHpChange: 0,
        bossReaction: "Public shaming destroys psychological safety and breeds team fear.",
        feedback: "Public callouts alienate peers. Constructive feedback should always be shared privately with empathy."
      },
      {
        key: "B",
        text: "Silently approve the PR to avoid interpersonal friction, then stay up late fixing their bugs yourself.",
        isCorrect: false,
        candidateHpChange: -20,
        bossHpChange: 0,
        bossReaction: "Enabling bad habits damages code health and guarantees your own burnout.",
        feedback: "Avoid conflict avoidance. Leaders address root issues collaboratively rather than absorbing others' work."
      },
      {
        key: "C",
        text: "Hold a friendly 1-on-1: discuss how smaller atomic PRs accelerate reviews, pair with them to break down this branch, and establish team CI lint/test gates together.",
        isCorrect: true,
        candidateHpChange: 10,
        bossHpChange: -20,
        bossReaction: "Empathetic coaching plus automated guardrails! That builds enduring engineering culture.",
        feedback: "Exemplary mentorship: Pair private coaching with systemic solutions (automated CI checks, small PR conventions)."
      },
      {
        key: "D",
        text: "Leave 75 nitpick comments on the GitHub pull request criticizing their coding style.",
        isCorrect: false,
        candidateHpChange: -15,
        bossHpChange: 0,
        bossReaction: "Nitpick bombardment overwhelms developers without teaching the underlying principles.",
        feedback: "Automate style formatting with linters; reserve human code review for architecture, logic, and tests."
      }
    ]
  },
  {
    id: 10,
    category: "The Reverse Interview",
    bossDialogue: "The interview clock is winding down. The final question belongs to you: 'Do you have any questions for me?'",
    question: "You have 5 minutes left at the end of the final boss interview. What question do you ask the engineering director to close strong?",
    isStar: false,
    tipKey: "closing",
    options: [
      {
        key: "A",
        text: "No questions, I think you covered everything. When can I expect the written salary offer?",
        isCorrect: false,
        candidateHpChange: -15,
        bossHpChange: 0,
        bossReaction: "Shows zero curiosity about our architecture, engineering challenges, or team culture.",
        feedback: "Never say 'no questions'. Asking no questions signals disinterest or lack of intellectual engagement."
      },
      {
        key: "B",
        text: "What does success look like for this role in the first 6 months, and what is currently the biggest technical bottleneck holding your team back from scaling?",
        isCorrect: true,
        candidateHpChange: 15,
        bossHpChange: -30,
        bossReaction: "DECISIVE BLOW! That question shows strategic foresight, business empathy, and high agency!",
        feedback: "Winning reverse-interview question! It signals that you are already thinking about delivering value and tackling their hardest pain points."
      },
      {
        key: "C",
        text: "How strictly do you monitor mouse movement and bathroom breaks during remote work?",
        isCorrect: false,
        candidateHpChange: -25,
        bossHpChange: 0,
        bossReaction: "A very odd final question that raises immediate suspicion about your work ethic.",
        feedback: "Questions about surveillance or minimal effort create awkward doubts in the final minutes."
      },
      {
        key: "D",
        text: "What does this company actually do again? I applied to 50 jobs this week so I forgot.",
        isCorrect: false,
        candidateHpChange: -30,
        bossHpChange: 0,
        bossReaction: "You made it to the final director boss battle without knowing what we build?! Fatal flaw!",
        feedback: "Demonstrating lack of basic company research in the final round is an immediate deal-breaker."
      }
    ]
  }
];

// Motivational Quotes Database
const MOTIVATIONAL_QUOTES = [
  {
    quote: "Interviews are not an interrogation of your perfection; they are a collaborative audition of how you think, adapt, and build under uncertainty.",
    author: "Senior Engineering Leadership Principle"
  },
  {
    quote: "The goal of an interview is not to possess every answer, but to prove you have the resilience and curiosity to solve problems you've never seen before.",
    author: "Grace Hopper Legacy Mindset"
  },
  {
    quote: "Clarity of thought beats encyclopedic memorization every single time. Structure your story, own your learnings, and let your genuine craft shine.",
    author: "Modern Tech Interview Philosophy"
  },
  {
    quote: "Every 'No' in an interview is just calibrated feedback preparing you for the right team where your superpowers will actually be appreciated.",
    author: "Career Growth Maxim"
  },
  {
    quote: "In a world full of buzzwords, the engineer who speaks with honest humility, data-backed results, and genuine empathy will always stand out.",
    author: "Principal Architect Advisory"
  }
];

// Improvement Tips Library
const TIPS_LIBRARY = {
  star: {
    title: "Master the STAR Method for Behavioral Questions",
    text: "Always organize past stories into Situation (10%), Task (10%), Action (60%), and Result (20%). Focus predominantly on YOUR direct actions and quantify the final impact with measurable metrics (e.g. latency cut by 35%, 0 dropped events)."
  },
  tech: {
    title: "Frame Architecture via Trade-offs & Layered Defense",
    text: "Never offer silver bullets or claim one tool fixes all. Discuss trade-offs (e.g. consistency vs latency, operational complexity vs quick delivery) and layered mitigations like caching, rate limiting, and graceful degradation."
  },
  tradeoff: {
    title: "Translate Technical Debt into Business Risk",
    text: "Avoid emotional refactoring demands. Frame technical debt in business terms: release velocity drag, incident frequency, and dollar costs. Propose allocating consistent capacity (15-20%) alongside new feature delivery."
  },
  honesty: {
    title: "Embrace 'I Don't Know' with First-Principles Logic",
    text: "Never bluff technical buzzwords. Confidently state the limits of your direct experience, then reason through the underlying fundamentals (networking, data structures, consensus) and ask how their team solves it."
  },
  intro: {
    title: "Use the Present-Past-Future Formula for Introductions",
    text: "Hook the interviewer in 60-90 seconds: Where you are right now and your core superpower, a marquee past project with measurable numbers, and why their company is the natural next chapter in your trajectory."
  },
  closing: {
    title: "Treat the Closing Questions as a Strategy Audit",
    text: "Use your questions to uncover team health, current bottlenecks, and criteria for success in the first 90 days. This shifts the dynamic from test-taker to a future strategic partner."
  }
};

// Application State
const state = {
  currentPage: 'portal', // 'portal', 'battle', 'results'
  currentQuestionIndex: 0,
  candidateHp: 100,
  bossHp: 100,
  score: 0,
  userAnswers: [],
  soundEnabled: true,
  currentQuoteIndex: 0,
  playerClass: '⚔️ Full-Stack Warrior'
};

// DOM Elements Cache
const elements = {
  portalLandingPage: document.getElementById('portalLandingPage'),
  battlePage: document.getElementById('battlePage'),
  resultsPage: document.getElementById('resultsPage'),
  battleMetersRow: document.getElementById('battleMetersRow'),
  bossArenaRow: document.getElementById('bossArenaRow'),
  candidateHpFill: document.getElementById('candidateHpFill'),
  candidateHpVal: document.getElementById('candidateHpVal'),
  bossHpFill: document.getElementById('bossHpFill'),
  bossHpVal: document.getElementById('bossHpVal'),
  bossAvatarBox: document.getElementById('bossAvatarBox'),
  bossBubbleText: document.getElementById('bossBubbleText'),
  roundTracker: document.getElementById('roundTracker'),
  categoryTag: document.getElementById('categoryTag'),
  questionText: document.getElementById('questionText'),
  starHelperBox: document.getElementById('starHelperBox'),
  choicesContainer: document.getElementById('choicesContainer'),
  feedbackBox: document.getElementById('feedbackBox'),
  feedbackStatus: document.getElementById('feedbackStatus'),
  hpChangePill: document.getElementById('hpChangePill'),
  feedbackBody: document.getElementById('feedbackBody'),
  nextBtn: document.getElementById('nextBtn'),
  homePortalBtn: document.getElementById('homePortalBtn'),
  soundToggleBtn: document.getElementById('soundToggleBtn'),
  playerClassHudBadge: document.getElementById('playerClassHudBadge'),
  footerClassStatus: document.getElementById('footerClassStatus'),
  pixelEmojiBtn: document.getElementById('pixelEmojiBtn'),
  rankBadge: document.getElementById('rankBadge'),
  scorecardTitle: document.getElementById('scorecardTitle'),
  finalScoreVal: document.getElementById('finalScoreVal'),
  finalHpVal: document.getElementById('finalHpVal'),
  starGradeVal: document.getElementById('starGradeVal'),
  tipsContainer: document.getElementById('tipsContainer'),
  quoteText: document.getElementById('quoteText'),
  quoteAuthor: document.getElementById('quoteAuthor'),
  quoteRefreshBtn: document.getElementById('quoteRefreshBtn'),
  reviewToggleBtn: document.getElementById('reviewToggleBtn'),
  reviewContent: document.getElementById('reviewContent'),
  gameContainer: document.getElementById('gameContainer')
};

// Initialization
function init() {
  bindEvents();
  updateSoundIcon();
  renderQuote();
}

function bindEvents() {
  // 4 Paths Navigation Tabs
  const tabBtns = document.querySelectorAll('.path-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.playClick();
      switchTab(btn.dataset.target);
    });
  });

  // Jump directly to Judge Tab from hero
  const jumpJudgeBtn = document.getElementById('jumpJudgePathBtn');
  if (jumpJudgeBtn) {
    jumpJudgeBtn.addEventListener('click', () => {
      sfx.playClick();
      switchTab('pathJudge');
    });
  }

  // Jump to Docs Vault from hero & judge tab
  const jumpDocsBtn = document.getElementById('jumpDocsVaultBtn');
  if (jumpDocsBtn) {
    jumpDocsBtn.addEventListener('click', () => {
      sfx.playClick();
      switchTab('pathDocsVault');
    });
  }

  const goToDocsLink = document.getElementById('goToDocsVaultLinkBtn');
  if (goToDocsLink) {
    goToDocsLink.addEventListener('click', () => {
      sfx.playClick();
      switchTab('pathDocsVault');
    });
  }

  // Start Full Game
  const startBtns = [
    document.getElementById('startFullGameBtn'),
    ...document.querySelectorAll('.btn-start-game-from-tab')
  ];
  startBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        sfx.playStartBattle();
        startBattle(0);
      });
    }
  });

  // Home / Return to Portal Buttons
  elements.homePortalBtn.addEventListener('click', () => {
    sfx.playClick();
    returnToPortal();
  });

  const returnFromResults = document.getElementById('returnToPortalFromResultsBtn');
  if (returnFromResults) {
    returnFromResults.addEventListener('click', () => {
      sfx.playClick();
      returnToPortal();
    });
  }

  // Pixel Emoji Click Easter Egg
  if (elements.pixelEmojiBtn) {
    elements.pixelEmojiBtn.addEventListener('click', () => {
      sfx.playBossRoar();
      elements.pixelEmojiBtn.style.transform = 'scale(1.2) rotate(-6deg)';
      setTimeout(() => {
        elements.pixelEmojiBtn.style.transform = '';
      }, 300);
    });
  }

  // Candidate Class Selection
  const classPills = document.querySelectorAll('.class-pill');
  classPills.forEach(pill => {
    pill.addEventListener('click', () => {
      sfx.playClick();
      classPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.playerClass = pill.dataset.class;
      elements.playerClassHudBadge.textContent = state.playerClass;
      elements.footerClassStatus.textContent = `Active Class: ${state.playerClass.replace(/^[^\s]+\s/, '')}`;
    });
  });

  // ==========================================
  // JUDGE DEMO & 3-STEP VERIFICATION BUTTONS
  // ==========================================
  
  // Step 01: Answer question & verify HP/confidence change
  const judgeStep1 = document.getElementById('judgeStep1Btn');
  if (judgeStep1) {
    judgeStep1.addEventListener('click', () => {
      sfx.playStartBattle();
      startBattle(0); // Jump to Question 1
    });
  }

  // Step 02: Open behavioural question & inspect STAR helper
  const judgeStep2 = document.getElementById('judgeStep2Btn');
  if (judgeStep2) {
    judgeStep2.addEventListener('click', () => {
      sfx.playStartBattle();
      startBattle(4); // Jump directly to Question 5 (STAR Behavioral)
    });
  }

  // Step 03: Reach result screen & verify rank/tips
  const judgeStep3 = document.getElementById('judgeStep3Btn');
  if (judgeStep3) {
    judgeStep3.addEventListener('click', () => {
      sfx.playFanfare();
      simulateAndShowResults(90); // 90% Rank S demo
    });
  }

  // Preview Results button from Path 2
  const previewResults = document.getElementById('previewResultsBtn');
  if (previewResults) {
    previewResults.addEventListener('click', () => {
      sfx.playFanfare();
      simulateAndShowResults(80); // 80% Rank A demo
    });
  }

  // Next Question Button
  elements.nextBtn.addEventListener('click', () => {
    sfx.playClick();
    goToNextQuestion();
  });

  // Sound Toggle
  elements.soundToggleBtn.addEventListener('click', () => {
    sfx.enabled = !sfx.enabled;
    state.soundEnabled = sfx.enabled;
    updateSoundIcon();
    if (sfx.enabled) sfx.playClick();
  });

  // Restart Button
  document.getElementById('restartBtn').addEventListener('click', () => {
    sfx.playClick();
    resetGame();
  });

  // Refresh Quote Button
  elements.quoteRefreshBtn.addEventListener('click', () => {
    sfx.playClick();
    state.currentQuoteIndex = (state.currentQuoteIndex + 1) % MOTIVATIONAL_QUOTES.length;
    renderQuote();
  });

  // Review Toggle Accordion
  elements.reviewToggleBtn.addEventListener('click', () => {
    sfx.playClick();
    const isOpen = elements.reviewContent.classList.toggle('open');
    elements.reviewToggleBtn.innerHTML = isOpen 
      ? '<span>Hide Detailed Answers Breakdown</span> <span>▲</span>' 
      : '<span>Review All 10 Questions & Hiring Insights</span> <span>▼</span>';
  });
}

function switchTab(targetId) {
  const tabBtns = document.querySelectorAll('.path-tab-btn');
  const panels = document.querySelectorAll('.path-panel');

  tabBtns.forEach(btn => {
    if (btn.dataset.target === targetId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  panels.forEach(panel => {
    if (panel.id === targetId) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });
}

function updateSoundIcon() {
  elements.soundToggleBtn.innerHTML = sfx.enabled ? '🔊' : '🔇';
  elements.soundToggleBtn.title = sfx.enabled ? 'Mute Sound FX' : 'Enable Sound FX';
}

function startBattle(startIndex = 0) {
  state.currentPage = 'battle';
  state.currentQuestionIndex = startIndex;
  state.candidateHp = 100;
  state.bossHp = 100;
  state.score = startIndex * 10;
  state.userAnswers = [];

  // Hide Portal, show Battle, HUD meters, and Home button
  elements.portalLandingPage.style.display = 'none';
  elements.resultsPage.style.display = 'none';
  elements.battleMetersRow.style.display = 'grid';
  elements.bossArenaRow.style.display = 'flex';
  elements.battlePage.style.display = 'flex';
  elements.homePortalBtn.style.display = 'flex';

  updateMeters();
  renderQuestion(state.currentQuestionIndex);
}

function returnToPortal() {
  state.currentPage = 'portal';
  elements.battlePage.style.display = 'none';
  elements.resultsPage.style.display = 'none';
  elements.battleMetersRow.style.display = 'none';
  elements.bossArenaRow.style.display = 'none';
  elements.homePortalBtn.style.display = 'none';
  elements.portalLandingPage.style.display = 'flex';
  updateMeters();
}

function renderQuestion(index) {
  const q = QUESTIONS_DB[index];
  if (!q) return;

  // Header tags
  elements.roundTracker.textContent = `Question ${index + 1} of ${QUESTIONS_DB.length}`;
  elements.categoryTag.textContent = q.category;
  elements.questionText.textContent = q.question;

  // Boss speech & avatar state
  elements.bossBubbleText.textContent = `"${q.bossDialogue}"`;
  setBossMood('neutral');

  // STAR helper display for Question 5
  if (q.isStar) {
    elements.starHelperBox.style.display = 'block';
  } else {
    elements.starHelperBox.style.display = 'none';
  }

  // Render choices
  elements.choicesContainer.innerHTML = '';
  q.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.dataset.key = opt.key;

    let contentHtml = '';
    if (q.isStar && opt.text.includes('[S]')) {
      const parts = opt.text.split('\n');
      contentHtml = `<div class="star-structured-preview">`;
      parts.forEach(part => {
        contentHtml += `<div class="star-row">${escapeHtml(part)}</div>`;
      });
      contentHtml += `</div>`;
    } else {
      contentHtml = `<div>${escapeHtml(opt.text)}</div>`;
    }

    btn.innerHTML = `
      <div class="choice-key">${opt.key}</div>
      <div class="choice-content">${contentHtml}</div>
    `;

    btn.addEventListener('click', () => handleChoiceSelect(opt, btn, q));
    elements.choicesContainer.appendChild(btn);
  });

  // Hide feedback until answered
  elements.feedbackBox.style.display = 'none';
}

function handleChoiceSelect(chosenOpt, chosenBtn, question) {
  const allBtns = elements.choicesContainer.querySelectorAll('.choice-btn');
  allBtns.forEach(b => b.disabled = true);

  const isCorrect = chosenOpt.isCorrect;
  let candidateDelta = chosenOpt.candidateHpChange;
  let bossDelta = chosenOpt.bossHpChange;

  state.candidateHp = Math.min(100, Math.max(10, state.candidateHp + candidateDelta));
  state.bossHp = Math.min(100, Math.max(0, state.bossHp + bossDelta));

  if (isCorrect) {
    state.score += 10;
    chosenBtn.classList.add('selected-correct');
    sfx.playSuccess();
    setBossMood('damaged');
    triggerDamageFloatingNumber(bossDelta, 'boss', false);
    triggerDamageFloatingNumber(`+${candidateDelta}`, 'candidate', true);
  } else {
    chosenBtn.classList.add('selected-wrong');
    const correctOpt = question.options.find(o => o.isCorrect);
    allBtns.forEach(b => {
      if (b.dataset.key === correctOpt.key) {
        b.classList.add('reveal-correct');
      }
    });

    sfx.playDamage();
    setBossMood('smug');
    triggerDamageFloatingNumber(candidateDelta, 'candidate', false);
    shakeArena();
  }

  state.userAnswers.push({
    questionId: question.id,
    chosenKey: chosenOpt.key,
    isCorrect: isCorrect,
    tipKey: question.tipKey
  });

  updateMeters();

  elements.bossBubbleText.textContent = `"${chosenOpt.bossReaction}"`;

  elements.feedbackBox.style.display = 'block';
  if (isCorrect) {
    elements.feedbackStatus.innerHTML = `<span class="status-win">✓ CRITICAL HIT / STRONG ANSWER!</span>`;
    elements.hpChangePill.className = 'hp-change-pill hp-gain';
    elements.hpChangePill.textContent = `+${candidateDelta} Confidence / Boss HP ${bossDelta}`;
  } else {
    elements.feedbackStatus.innerHTML = `<span class="status-loss">✗ MISSED OPP / VULNERABILITY!</span>`;
    elements.hpChangePill.className = 'hp-change-pill hp-loss';
    elements.hpChangePill.textContent = `${candidateDelta} Confidence Loss`;
  }

  elements.feedbackBody.textContent = chosenOpt.feedback;

  if (state.currentQuestionIndex === QUESTIONS_DB.length - 1) {
    elements.nextBtn.textContent = 'View Final Results & Score Card →';
  } else {
    elements.nextBtn.textContent = 'Continue to Next Round →';
  }
}

function goToNextQuestion() {
  if (state.currentQuestionIndex < QUESTIONS_DB.length - 1) {
    state.currentQuestionIndex++;
    renderQuestion(state.currentQuestionIndex);
  } else {
    finishBattle();
  }
}

function updateMeters() {
  elements.candidateHpFill.style.width = `${state.candidateHp}%`;
  elements.candidateHpVal.textContent = `${state.candidateHp}/100`;

  if (state.candidateHp > 65) {
    elements.candidateHpFill.style.background = 'linear-gradient(90deg, #16a34a, #22c55e)';
  } else if (state.candidateHp > 35) {
    elements.candidateHpFill.style.background = 'linear-gradient(90deg, #ca8a04, #eab308)';
  } else {
    elements.candidateHpFill.style.background = 'linear-gradient(90deg, #dc2626, #ef4444)';
  }

  elements.bossHpFill.style.width = `${state.bossHp}%`;
  elements.bossHpVal.textContent = `${state.bossHp}/100`;
}

function setBossMood(mood) {
  const avatar = elements.bossAvatarBox;
  if (mood === 'damaged') {
    avatar.style.transform = 'scale(0.92) rotate(-4deg)';
    avatar.style.borderColor = '#ef4444';
  } else if (mood === 'smug') {
    avatar.style.transform = 'scale(1.08) translateY(-2px)';
    avatar.style.borderColor = '#f59e0b';
  } else {
    avatar.style.transform = 'scale(1)';
    avatar.style.borderColor = 'var(--boss-hp-purple)';
  }
}

function shakeArena() {
  elements.gameContainer.classList.add('shake');
  setTimeout(() => {
    elements.gameContainer.classList.remove('shake');
  }, 350);
}

function triggerDamageFloatingNumber(val, target, isPositive) {
  const floatEl = document.createElement('div');
  floatEl.className = `damage-number ${isPositive ? 'damage-green' : 'damage-red'}`;
  floatEl.textContent = val;

  const rect = target === 'boss' 
    ? elements.bossHpVal.getBoundingClientRect() 
    : elements.candidateHpVal.getBoundingClientRect();
  const containerRect = elements.gameContainer.getBoundingClientRect();

  floatEl.style.left = `${rect.left - containerRect.left + 20}px`;
  floatEl.style.top = `${rect.top - containerRect.top - 10}px`;

  elements.gameContainer.appendChild(floatEl);
  setTimeout(() => floatEl.remove(), 1000);
}

function simulateAndShowResults(scorePercent = 90) {
  state.currentPage = 'results';
  state.score = (scorePercent / 100) * (QUESTIONS_DB.length * 10);
  state.candidateHp = Math.max(70, scorePercent);
  
  // Seed answers if empty for test mode
  if (state.userAnswers.length === 0) {
    QUESTIONS_DB.forEach((q, idx) => {
      state.userAnswers.push({
        questionId: q.id,
        chosenKey: q.options.find(o => o.isCorrect).key,
        isCorrect: idx < (scorePercent / 10),
        tipKey: q.tipKey
      });
    });
  }

  finishBattle();
}

function finishBattle() {
  state.currentPage = 'results';
  elements.portalLandingPage.style.display = 'none';
  elements.battlePage.style.display = 'none';
  elements.bossArenaRow.style.display = 'none';
  elements.battleMetersRow.style.display = 'grid';
  elements.resultsPage.style.display = 'flex';
  elements.homePortalBtn.style.display = 'flex';

  sfx.playFanfare();

  const scorePercent = Math.round((state.score / (QUESTIONS_DB.length * 10)) * 100);
  let rank = 'C';
  let rankClass = 'rank-c';
  let title = 'Honorable Contender / Growth Track';
  let subtitle = `${state.playerClass}: You held your ground against Lord Syntax, but sharpening your answers will unlock top-tier offers!`;

  if (scorePercent >= 90) {
    rank = 'S';
    rankClass = 'rank-s';
    title = 'Principal / Staff Engineer Offer Extended!';
    subtitle = `${state.playerClass}: Flawless strategic vision, STAR mastery, and bulletproof architectural intuition!`;
  } else if (scorePercent >= 75) {
    rank = 'A';
    rankClass = 'rank-a';
    title = 'Senior Engineer Fast-Track Offer!';
    subtitle = `${state.playerClass}: Impressive performance across technical trade-offs and behavioral leadership.`;
  } else if (scorePercent >= 60) {
    rank = 'B';
    rankClass = 'rank-b';
    title = 'Mid-Level Specialist Offer!';
    subtitle = `${state.playerClass}: Solid technical foundations. Polishing quantifiable results in STAR will elevate you to Senior.`;
  }

  elements.rankBadge.textContent = `RANK ${rank}`;
  elements.rankBadge.className = `rank-badge-large ${rankClass}`;
  elements.scorecardTitle.textContent = title;
  elements.scorecardSubtitle = subtitle;
  elements.finalScoreVal.textContent = `${scorePercent}%`;
  elements.finalHpVal.textContent = `${state.candidateHp}%`;

  const starAnswer = state.userAnswers.find(a => a.questionId === 5);
  elements.starGradeVal.textContent = starAnswer && starAnswer.isCorrect ? 'Master (S)' : 'Needs Polish';

  renderImprovementTips();
  renderReviewList();
}

function renderImprovementTips() {
  elements.tipsContainer.innerHTML = '';

  const missedTips = state.userAnswers
    .filter(a => !a.isCorrect && TIPS_LIBRARY[a.tipKey])
    .map(a => TIPS_LIBRARY[a.tipKey]);

  let selectedTips = [];
  if (missedTips.length >= 2) {
    selectedTips = missedTips.slice(0, 2);
  } else if (missedTips.length === 1) {
    selectedTips.push(missedTips[0]);
    const fallback = TIPS_LIBRARY.star.title === missedTips[0].title 
      ? TIPS_LIBRARY.tech 
      : TIPS_LIBRARY.star;
    selectedTips.push(fallback);
  } else {
    selectedTips = [TIPS_LIBRARY.star, TIPS_LIBRARY.tech];
  }

  selectedTips.forEach((tip, idx) => {
    const card = document.createElement('div');
    card.className = 'tip-card';
    card.innerHTML = `
      <div class="tip-title">Tip #${idx + 1}: ${escapeHtml(tip.title)}</div>
      <div class="tip-text">${escapeHtml(tip.text)}</div>
    `;
    elements.tipsContainer.appendChild(card);
  });
}

function renderQuote() {
  const q = MOTIVATIONAL_QUOTES[state.currentQuoteIndex];
  if (q) {
    elements.quoteText.textContent = `"${q.quote}"`;
    elements.quoteAuthor.textContent = `— ${q.author}`;
  }
}

function renderReviewList() {
  elements.reviewContent.innerHTML = '';
  QUESTIONS_DB.forEach((q, idx) => {
    const bestOpt = q.options.find(o => o.isCorrect);
    const userAns = state.userAnswers.find(a => a.questionId === q.id);
    const userCorrect = userAns ? userAns.isCorrect : false;

    const item = document.createElement('div');
    item.className = 'review-item';
    item.innerHTML = `
      <div class="review-item-title">Q${idx + 1}: ${escapeHtml(q.category)} ${userCorrect ? '✓' : '✗'}</div>
      <div style="font-weight: 600; margin-bottom: 4px; color: var(--text-main); font-size: 13.5px;">${escapeHtml(q.question)}</div>
      <div class="review-item-best"><strong>Winning Approach:</strong> Option ${bestOpt.key} — ${escapeHtml(bestOpt.text)}</div>
      <div class="review-item-why"><strong>Hiring Rationale:</strong> ${escapeHtml(bestOpt.feedback)}</div>
    `;
    elements.reviewContent.appendChild(item);
  });
}

function resetGame() {
  state.currentPage = 'battle';
  state.currentQuestionIndex = 0;
  state.candidateHp = 100;
  state.bossHp = 100;
  state.score = 0;
  state.userAnswers = [];

  elements.portalLandingPage.style.display = 'none';
  elements.resultsPage.style.display = 'none';
  elements.battleMetersRow.style.display = 'grid';
  elements.bossArenaRow.style.display = 'flex';
  elements.battlePage.style.display = 'flex';
  elements.homePortalBtn.style.display = 'flex';

  updateMeters();
  renderQuestion(0);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', init);
