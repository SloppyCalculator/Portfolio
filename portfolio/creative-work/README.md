# Creative Works

This folder contains novels, short stories, poetry, acoustic lyrics, and theological/philosophical studies for Johan Sofalas.
In the portfolio, this section is presented as an interactive **3D Bookshelf & Digital Reading Notebook** (Move: `1... e4`).

---

## Folder Structure

```
creative-work/
├── README.md               # This documentation and editing guide
├── data.js                 # Data module loaded by the portfolio 3D bookshelf
├── novels/                 # Novel manuscripts, chapters, and universe bibles
│   ├── alphas-ch1-awakening.md
│   └── alphas-ch2-breach.md
├── poetry/                 # Poems, song lyrics, and spoken-word pieces
│   ├── tribute-song-lyrics.md
│   └── silicon-dreams.md
├── stories/                # Standalone short stories
│   └── the-last-move.md
└── studies/                # Theological, philosophical, and architectural essays
    └── architecture-of-faith.md
```

---

## 1. How to Add a New Poem

You can add a poem in two quick steps:

### Step 1: Add a markdown copy in `poetry/` (Optional but recommended)
Create `creative-work/poetry/my-poem.md`.

### Step 2: Add the poem in [`creative-work/data.js`](file:///Users/johansofalas/Downloads/portfolio/creative-work/data.js)
Under `poetry.items`, append your poem:

```javascript
{
    id: "midnight-static",
    title: "Midnight Static",
    subtitle: "Rhythmic Verse / 90 BPM",
    form: "Free Verse",
    date: "2024",
    content: `<p>Silent copper lines<br>
Signals whisper in the dark<br>
Waiting for a spark.</p>
<p>Through the fiber and the stone,<br>
We are never quite alone.</p>`
}
```

Or call the helper function:
```javascript
window.addPoem({
    title: "Midnight Static",
    subtitle: "Rhythmic Verse",
    content: "<p>Poem lines here...</p>"
});
```

---

## 2. How to Add a Novel with Chapters Below It

Novels are structured hierarchically: each novel is its own entity, and its chapters live directly beneath it in the Table of Contents.

### Adding a New Novel with Chapters in [`creative-work/data.js`](file:///Users/johansofalas/Downloads/portfolio/creative-work/data.js)

Append a new novel object into `novels.novels`:

```javascript
{
    id: "the-second-signal",
    title: "The Second Signal",
    series: "Chronicles of the Core • Book 2",
    genre: "Speculative Cyberpunk",
    chapters: [
        {
            id: "signal-ch1",
            chapterNumber: "Chapter 1",
            title: "Packet Loss",
            readTime: "4 min read",
            content: `<p>It started as an unhandled exception in cluster 7...</p>`
        },
        {
            id: "signal-ch2",
            chapterNumber: "Chapter 2",
            title: "The Trace",
            readTime: "5 min read",
            content: `<p>Tracing the route through the subsea fiber...</p>`
        }
    ]
}
```

### Adding a Chapter to an Existing Novel:
Simply add a new chapter object to that novel's `chapters` array:

```javascript
{
    id: "alphas-3",
    chapterNumber: "Chapter 3",
    title: "The Perimeter",
    readTime: "5 min read",
    content: `<p>Rain fell hard against the perimeter fence...</p>`
}
```

Or programmatically:
```javascript
// 1. Add a novel
window.addNovel({
    id: "new-novel",
    title: "Novel Title",
    series: "Book 1",
    chapters: []
});

// 2. Add chapters beneath it
window.addChapter("new-novel", {
    chapterNumber: "Chapter 1",
    title: "The First Step",
    readTime: "3 min read",
    content: "<p>Chapter text here...</p>"
});
```
The portfolio's Table of Contents will automatically group chapters under their parent novel with book banners, chapter badges (`CH 01`, `CH 02`), and read times!
