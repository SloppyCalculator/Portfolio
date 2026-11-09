#!/usr/bin/env node
/**
 * sync-personal-info.js
 * Updates the `content` field of personal-info/data.js from .md files.
 * Layout config (row, col, dir, missing, icon) is PRESERVED — only content changes.
 *
 * Run: node sync-personal-info.js
 *
 * === .md FILE LOCATIONS ===
 *   BIOGRAPHY  → personal-info/bio/biography.md
 *   WEAKNESSES → personal-info/bio/weaknesses.md
 *   STRENGTHS  → personal-info/bio/strengths.md
 *   EDUCATION  → personal-info/education/university-of-colombo.md
 *   CONTACT    → personal-info/contact/contact-card.md
 *   VENTURES   → personal-info/ventures/liberty-trading.md
 *
 * Just edit the .md files in plain text, then run: node sync-personal-info.js
 * No need to touch HTML or data.js directly.
 *
 * === .md FORMAT ===
 * Plain markdown. Converted to styled HTML automatically.
 * - # Heading → styled heading
 * - ## Sub-heading → section heading
 * - **bold** → strong
 * - - bullet → list item
 * - `code` → inline code
 * - [text](url) → anchor link
 */

const fs   = require('fs');
const path = require('path');

const BASE        = path.join(__dirname, 'personal-info');
const OUT_FILE    = path.join(BASE, 'data.js');

// === Static layout config — only content is sourced from .md ===
// To change the Scrabble board layout, edit this directly.
const LAYOUT = [
    {
        id: 'weaknesses',
        text: 'WEAKNESSES',
        row: 7, col: 5, dir: 'h', missing: [1, 3, 6],
        category: 'Vulnerabilities',
        title: 'Weaknesses',
        icon: 'fa-shield-halved',
        folder: 'bio/',
        file: 'personal-info/bio/weaknesses.md'
    },
    {
        id: 'contact',
        text: 'CONTACT',
        row: 3, col: 7, dir: 'v', missing: [0, 3, 5],
        category: 'Comms Link',
        title: 'Contact',
        icon: 'fa-envelope',
        folder: 'contact/',
        file: 'personal-info/contact/contact-card.md'
    },
    {
        id: 'biography',
        text: 'BIOGRAPHY',
        row: 4, col: 5, dir: 'h', missing: [1, 4, 8],
        category: 'Identity',
        title: 'Biography',
        icon: 'fa-user',
        folder: 'bio/',
        file: 'personal-info/bio/biography.md'
    },
    {
        id: 'strengths',
        text: 'STRENGTHS',
        row: 9, col: 1, dir: 'h', missing: [2, 4, 7],
        category: 'Capabilities',
        title: 'Strengths',
        icon: 'fa-bolt',
        folder: 'bio/',
        file: 'personal-info/bio/strengths.md'
    },
    {
        id: 'education',
        text: 'EDUCATION',
        row: 4, col: 2, dir: 'v', missing: [1, 3, 7],
        category: 'Academic',
        title: 'Education',
        icon: 'fa-graduation-cap',
        folder: 'education/',
        file: 'personal-info/education/university-of-colombo.md'
    },
    {
        id: 'ventures',
        text: 'VENTURES',
        row: 6, col: 13, dir: 'v', missing: [0, 4, 6],
        category: 'Commercial',
        title: 'Ventures',
        icon: 'fa-briefcase',
        folder: 'ventures/',
        file: 'personal-info/ventures/liberty-trading.md'
    }
];

// Minimal markdown → HTML converter (no external deps)
function mdToHtml(md) {
    if (!md) return '';

    // Split into blocks separated by blank lines
    const lines = md.split('\n');
    const output = [];
    let i = 0;

    while (i < lines.length) {
        const raw = lines[i];
        const trimmed = raw.trim();

        if (!trimmed) { i++; continue; }

        // H1
        if (/^# /.test(raw)) {
            output.push(`<p class="mb-4"><strong class="text-white text-xl">${escInline(raw.slice(2).trim())}</strong></p>`);
            i++; continue;
        }
        // H2
        if (/^## /.test(raw) && !/^### /.test(raw)) {
            output.push(`<p class="font-semibold text-white mt-4 mb-2">${escInline(raw.slice(3).trim())}</p>`);
            i++; continue;
        }
        // H3
        if (/^### /.test(raw)) {
            output.push(`<p class="font-semibold text-gray-300 mt-3 mb-1">${escInline(raw.slice(4).trim())}</p>`);
            i++; continue;
        }
        // Horizontal rule
        if (/^---+$/.test(trimmed)) { i++; continue; }

        // Unordered list
        if (/^- /.test(trimmed)) {
            const items = [];
            while (i < lines.length && /^\s*- /.test(lines[i])) {
                items.push(`<li>${escInline(lines[i].replace(/^\s*- /, ''))}</li>`);
                i++;
            }
            output.push(`<ul class="list-disc pl-5 space-y-2 mb-3">${items.join('')}</ul>`);
            continue;
        }

        // Regular paragraph
        const paraLines = [];
        while (i < lines.length && lines[i].trim()) {
            if (/^#{1,3} /.test(lines[i]) || /^- /.test(lines[i].trim()) || /^---+$/.test(lines[i].trim())) break;
            paraLines.push(lines[i].trim());
            i++;
        }
        if (paraLines.length) {
            output.push(`<p class="mb-3">${escInline(paraLines.join(' '))}</p>`);
        }
    }

    return output.join('');
}

function escInline(text) {
    return text
        // Bold
        .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>')
        // Italic
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        // Code
        .replace(/`([^`]+)`/g, '<code class="text-neon bg-black px-1 rounded text-sm font-mono">$1</code>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-neon hover:underline" target="_blank" rel="noopener">$1</a>');
}

function generateDataJs(entries) {
    const items = entries.map(e => {
        const content = JSON.stringify(e.content);
        return `    {
        id: ${JSON.stringify(e.id)},
        text: ${JSON.stringify(e.text)},
        row: ${e.row},
        col: ${e.col},
        dir: ${JSON.stringify(e.dir)},
        missing: ${JSON.stringify(e.missing)},
        category: ${JSON.stringify(e.category)},
        title: ${JSON.stringify(e.title)},
        icon: ${JSON.stringify(e.icon)},
        content: ${content},
        folder: ${JSON.stringify(e.folder)},
        file: ${JSON.stringify(e.file)}
    }`;
    });

    return `/**
 * Personal Info Data Module
 * Powers the 6 Scrabble crossword words and decrypted dossiers in the portfolio.
 *
 * AUTO-GENERATED by sync-personal-info.js — do not edit by hand.
 * To update content:
 *   1. Edit the corresponding .md file (see file paths above each entry)
 *   2. Run: node sync-personal-info.js
 *
 * NOTE: Layout config (row, col, dir, missing, icon) is defined in sync-personal-info.js
 * and is NOT overwritten by editing .md files.
 */
window.personalInfoData = [
${items.join(',\n')}
];
`;
}

// Main
let synced = 0;
const entries = LAYOUT.map(layout => {
    const mdPath = path.join(__dirname, layout.file);
    let content = '';
    if (fs.existsSync(mdPath)) {
        const md = fs.readFileSync(mdPath, 'utf8');
        content = mdToHtml(md);
        synced++;
    } else {
        console.warn(`⚠️  Missing: ${layout.file} — keeping empty content`);
    }
    return { ...layout, content };
});

const output = generateDataJs(entries);
fs.writeFileSync(OUT_FILE, output, 'utf8');
console.log(`✅ personal-info/data.js updated — ${synced}/${LAYOUT.length} .md files synced:`);
entries.forEach(e => console.log(`   • [${e.id}] ${e.title}`));
