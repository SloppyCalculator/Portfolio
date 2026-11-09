# Software Projects & Engineering Archives

This folder houses full-stack software deployments, 3D WebGL experiments, desktop utility suites, and architectural case studies by Johan Sofalas.

## Folder Structure

```
software/
├── README.md                           # This documentation file
├── data.js                             # Cassette tape manifest for the retro CRT player
├── complaint-management-system/        # Enterprise PHP/MySQL web application
│   └── README.md
├── 3d-coconut-runner/                  # Browser-based 3D runner game (Three.js/WebGL)
│   └── README.md
└── python-gui-utilities/               # Desktop UI tools (CustomTkinter/Flask)
    └── README.md
```

## How to Add a New Software Project

1. Create a new subfolder in `software/` for your project (e.g. `software/my-new-app/`).
2. Add your code, screenshots, and documentation inside that subfolder.
3. Open `data.js` in this folder.
4. Add a new cassette entry with a unique ID:

```javascript
window.softwareData["4"] = {
    title: "MY NEW APPLICATION",
    tech: "TypeScript, React, Tailwind, Node.js",
    content: "> BOOTING SYSTEM...\n> LOADING MY NEW APP...\n\n[ TECH STACK ]\nTypeScript, React, Node.js\n\n[ DESCRIPTION ]\nDetailed architectural overview and deployment highlights."
};
```

The retro cassette deck in the portfolio will automatically generate a new playable audio tape for it!
