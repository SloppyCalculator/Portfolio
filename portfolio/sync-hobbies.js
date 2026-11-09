#!/usr/bin/env node
/**
 * sync-hobbies.js
 * Scans hobbies/{folder}/README.md and regenerates hobbies/data.js
 *
 * Run: node sync-hobbies.js
 *
 * === .md FORMAT (in each hobby's README.md) ===
 *
 * # Channel Title
 * ## Category Name
 *
 * **Badge**: DISPLAY BADGE TEXT
 * **Tagline**: One-sentence tagline shown on TV.
 *
 * ### Summary
 * Full paragraph(s) describing the hobby.
 *
 * ### Specs
 * - LABEL: Value
 * - LABEL: Value
 *
 * ### Highlights
 * - Highlight bullet 1
 * - Highlight bullet 2
 *
 * === ADDING A NEW HOBBY ===
 * 1. Create a new folder under hobbies/   e.g. hobbies/cooking/
 * 2. Add a README.md using the format above
 * 3. Run: node sync-hobbies.js
 */

const fs   = require('fs');
const path = require('path');

const HOBBIES_DIR = path.join(__dirname, 'hobbies');
const OUT_FILE    = path.join(__dirname, 'hobbies', 'data.js');

// Folders that contain hobby README.md files (auto-discovered)
function discoverHobbyFolders() {
    return fs.readdirSync(HOBBIES_DIR, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name)
        .filter(name => fs.existsSync(path.join(HOBBIES_DIR, name, 'README.md')));
}

function extractSection(lines, sectionHeader) {
    const startIdx = lines.findIndex(l => new RegExp(`^###\\s+${sectionHeader}`, 'i').test(l));
    if (startIdx === -1) return [];
    const result = [];
    for (let i = startIdx + 1; i < lines.length; i++) {
        if (lines[i].startsWith('#')) break;
        result.push(lines[i]);
    }
    return result;
}

function extractField(lines, label) {
    const prefix = `**${label}**:`.toLowerCase();
    for (const l of lines) {
        if (l.toLowerCase().startsWith(prefix)) {
            return l.slice(prefix.length).replace(/\s+/g, ' ').trim();
        }
    }
    return '';
}

function parseHobbyReadme(folderName) {
    const filePath = path.join(HOBBIES_DIR, folderName, 'README.md');
    const raw   = fs.readFileSync(filePath, 'utf8');
    const lines = raw.split('\n');

    // Title
    const titleLine = lines.find(l => l.startsWith('# '));
    const title = titleLine ? titleLine.replace(/^#\s+/, '').trim() : folderName;

    // Category (## heading)
    const catLine = lines.find(l => l.startsWith('## ') && !l.startsWith('### '));
    const category = catLine ? catLine.replace(/^##\s+/, '').trim() : 'Hobbies & Interests';

    const badge   = extractField(lines, 'Badge')   || extractField(lines, 'badge');
    const tagline = extractField(lines, 'Tagline') || extractField(lines, 'tagline');

    // Summary section
    const summaryLines = extractSection(lines, 'Summary');
    const summary = summaryLines.map(l => l.trim()).filter(Boolean).join(' ').trim();

    // Specs section — lines like "- LABEL: Value"
    const specLines = extractSection(lines, 'Specs');
    const specs = specLines
        .map(l => l.trim())
        .filter(l => l.startsWith('- '))
        .map(l => {
            const body = l.slice(2).trim();
            const colonIdx = body.indexOf(':');
            if (colonIdx === -1) return { label: 'INFO', value: body };
            return {
                label: body.slice(0, colonIdx).trim().toUpperCase(),
                value: body.slice(colonIdx + 1).trim()
            };
        });

    // Highlights section — bullet lines
    const hlLines = extractSection(lines, 'Highlights');
    const highlights = hlLines
        .map(l => l.trim())
        .filter(l => l.startsWith('- '))
        .map(l => l.slice(2).trim());

    return {
        id: folderName,
        folder: `hobbies/${folderName}/`,
        file: `hobbies/${folderName}/README.md`,
        title,
        category,
        badge:    badge    || title.toUpperCase().split(' ').slice(0, 2).join(' '),
        tagline:  tagline  || (summary ? summary.split('.')[0] + '.' : ''),
        summary:  summary  || '',
        specs,
        highlights
    };
}

function jsStr(s) {
    return JSON.stringify(s);
}

function generateDataJs(channels) {
    const normalizeBlock = `/**
 * Normalizes any hobby channel object, ensuring complete resilience
 * and auto-filling missing fields (channel number, frequencies, specs, highlights).
 */
window.normalizeHobbyChannel = function(raw, index, total) {
    if (!raw) raw = {};
    const chNum = raw.channel ? String(raw.channel).padStart(2, '0') : String(index + 1).padStart(2, '0');
    const category = raw.category || "Hobbies & Interests";
    const title = raw.title || \`Hobby Channel \${chNum}\`;
    const slug = (raw.id || title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Auto-generate specs if omitted
    let specs = [];
    if (Array.isArray(raw.specs) && raw.specs.length > 0) {
        specs = raw.specs.map(s => ({
            label: (s.label || "INFO").toUpperCase(),
            value: String(s.value || "Active")
        }));
    } else {
        specs = [
            { label: "CHANNEL", value: \`CH \${chNum}\` },
            { label: "CATEGORY", value: category.split('&')[0].trim() },
            { label: "STATUS", value: "Active Pursuit" },
            { label: "BROADCAST", value: "Stereo 50Hz" }
        ];
    }

    // Auto-generate highlights if omitted
    let highlights = [];
    if (Array.isArray(raw.highlights) && raw.highlights.length > 0) {
        highlights = raw.highlights.map(h => String(h));
    } else if (raw.summary) {
        const sentences = raw.summary.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
        highlights = sentences.length > 0
            ? sentences.slice(0, 3)
            : ["Engaging in deep creative and strategic practice outside of technical work."];
    } else {
        highlights = ["Active personal interest and ongoing creative focus."];
    }

    return {
        id: raw.id || slug,
        channel: chNum,
        code: raw.code || \`CH-\${chNum} // \${category.split('&')[0].trim().toUpperCase()}\`,
        frequency: raw.frequency || \`\${(135.0 + index * 14.5).toFixed(1)} MHz\`,
        category: category,
        badge: raw.badge || (specs[0] ? specs[0].value : \`CH \${chNum}\`),
        title: title,
        folder: raw.folder || \`hobbies/\${slug}/\`,
        file: raw.file || \`hobbies/\${slug}/README.md\`,
        tagline: raw.tagline || (raw.summary ? raw.summary.split('.')[0] + '.' : "Strategic and creative exploration off-screen."),
        summary: raw.summary || raw.content || raw.description || "Detailed overview of this hobby and creative pursuit.",
        specs: specs,
        highlights: highlights
    };
};`;

    const channelEntries = channels.map(ch => {
        const specsStr = ch.specs.map(s =>
            `            { label: ${jsStr(s.label)}, value: ${jsStr(s.value)} }`
        ).join(',\n');
        const hlStr = ch.highlights.map(h =>
            `            ${jsStr(h)}`
        ).join(',\n');

        return `    {
        id: ${jsStr(ch.id)},
        category: ${jsStr(ch.category)},
        badge: ${jsStr(ch.badge)},
        title: ${jsStr(ch.title)},
        folder: ${jsStr(ch.folder)},
        file: ${jsStr(ch.file)},
        tagline: ${jsStr(ch.tagline)},
        summary: ${jsStr(ch.summary)},
        specs: [
${specsStr}
        ],
        highlights: [
${hlStr}
        ]
    }`;
    });

    return `/**
 * Hobbies & Interests Data Module
 * Powers the interactive Retro TV & Remote Channels in the portfolio.
 *
 * AUTO-GENERATED by sync-hobbies.js — do not edit by hand.
 * To add or edit a hobby:
 *   1. Create/edit hobbies/<folder>/README.md  (see format in sync-hobbies.js)
 *   2. Run: node sync-hobbies.js
 *
 * ==============================================================================
 * HOW TO ADD A NEW HOBBY CHANNEL:
 * ==============================================================================
 * 1. Create a folder: hobbies/my-hobby/
 * 2. Add hobbies/my-hobby/README.md using the format documented in sync-hobbies.js
 * 3. Run: node sync-hobbies.js
 * ==============================================================================
 */

${normalizeBlock}

/**
 * Array of all active TV hobby channels.
 * AUTO-GENERATED — edit via README.md files, then run sync-hobbies.js
 */
window.hobbiesChannels = [
${channelEntries.join(',\n')}
];

/**
 * Easy helper function to register a new channel dynamically:
 * window.addHobbyChannel({ title: "My New Hobby", summary: "..." });
 */
window.addHobbyChannel = function(channelData) {
    if (!channelData) return;
    window.hobbiesChannels.push(channelData);
    return window.hobbiesChannels.length - 1;
};

// Backwards-compatible map for legacy references
window.hobbiesData = {
    wk: window.hobbiesChannels[1],
    slip: window.hobbiesChannels[0],
    midoff: window.hobbiesChannels[2],
    silly: window.hobbiesChannels[3],
    deepcover: window.hobbiesChannels[1],
    fineleg: window.hobbiesChannels[4]
};
`;
}

// Main
const folders = discoverHobbyFolders().sort();
if (folders.length === 0) {
    console.error('No hobby folders with README.md found under hobbies/');
    process.exit(1);
}

const channels = folders.map(f => parseHobbyReadme(f));
const output   = generateDataJs(channels);

fs.writeFileSync(OUT_FILE, output, 'utf8');
console.log(`✅ hobbies/data.js updated — ${channels.length} channel(s) synced:`);
channels.forEach(ch => console.log(`   • [${ch.id}] ${ch.title}`));
