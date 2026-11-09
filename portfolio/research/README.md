# Research & Publications

This folder contains academic research, conference papers, journal articles, preprints, and dataset documentation for Johan Sofalas.

## Folder Structure

```
research/
├── README.md               # This documentation file
├── data.js                 # Data file consumed by the portfolio UI (Google Scholar browser)
├── papers/                 # Full papers, abstracts, and detailed case studies
│   ├── sinfos-sinhala-nlp.md
│   ├── edge-ai-audio-classification.md
│   ├── graph-rag-framework.md
│   └── pfas-toxicity-prediction.md
└── datasets/               # Dataset documentation, schemas, and benchmark links
    └── README.md
```

## How to Add a New Research Paper

1. Drop your paper notes, markdown, or PDF into the `papers/` subfolder.
2. Open `data.js` in this folder.
3. Add a new paper entry to `window.researchData`:

```javascript
{
    title: "Your Paper Title",
    authors: "J Sofalas, et al. - Conference/Journal Name, Year",
    snippet: "Brief 1-2 sentence overview shown in the search results list.",
    details: "<strong>Abstract & Methodology:</strong> Detailed abstract and results revealed when the user clicks the title in the Google Scholar UI.",
    link: "papers/your-paper-file.md" // optional file link
}
```

The portfolio's interactive Google Scholar browser automatically renders all items in `window.researchData`.
