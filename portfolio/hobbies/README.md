# Hobbies & Interests

This folder documents personal hobbies, creative works, and strategic play off-screen for Johan Sofalas.
In the portfolio, this section is presented as an interactive **Retro CRT Television & Handheld Remote Control** interface (Move: `2... Nc3`).

---

## Folder Structure

```
hobbies/
├── README.md                   # This documentation & channel guide
├── data.js                     # Channel definitions & configuration module
├── chess/                      # Competitive chess ratings, opening repertoires, annotated PGNs
│   ├── README.md
│   └── favorite-games.pgn
├── cricket-simulations/        # Statistical modeling and cricket tactical simulations
│   └── README.md
├── game-design/                # Tabletop board game prototypes and 3D WebGL game notes
│   └── README.md
└── songwriting/                # Lyrics, chord progressions, acoustic composition notes
    └── README.md
```

---

## How to Add or Update a Hobby Channel

Adding a new hobby channel is completely automated! Open [`hobbies/data.js`](file:///Users/johansofalas/Downloads/portfolio/hobbies/data.js) and add an entry to `window.hobbiesChannels`.

### Quick Example (Minimal):
```javascript
{
    title: "Astrophotography & Deep Space Imaging",
    category: "Astronomy",
    summary: "Capturing nebulae and star clusters with long-exposure cooled CMOS sensors."
}
```
*Channel numbers (`06`, `07`, ...), broadcast frequencies, codes, folder links, and remote dots are **automatically generated**!*

### Complete Example (With Custom Specs & Highlights):
```javascript
{
    title: "Woodworking & Joinery",
    category: "Traditional Crafts",
    badge: "JAPANESE JOINERY",
    summary: "Hand-carving hardwood furniture using mortise-and-tenon and dovetail joints.",
    specs: [
        { label: "PRIMARY WOOD", value: "Black Walnut & Oak" },
        { label: "FAVORITE TOOL", value: "Dozuki Pull Saw" }
    ],
    highlights: [
        "Hand-cut dovetail joints tuned with zero mechanical fasteners",
        "Natural hand-rubbed tung oil and beeswax finishes"
    ]
}
```

Or programmatically in any script:
```javascript
window.addHobbyChannel({
    title: "Robotics & Hardware Hacking",
    category: "Embedded Engineering",
    summary: "Tinkering with microcontrollers, Arduino, and custom sensor rigs."
});
```
The portfolio's TV display, remote controls, channel dots, and audio feedback will immediately adapt without any extra configuration!
