#!/usr/bin/env node
/**
 * sync-creative.js
 * Automatically scans markdown (.md) files in the creative-work/ directory
 * and synchronizes them into creative-work/data.js.
 * 
 * Usage:
 *   node sync-creative.js
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'creative-work');
const DATA_FILE = path.join(BASE_DIR, 'data.js');

function parseMarkdownFile(filePath) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const lines = raw.trim().split('\n');
    let title = '';
    let subtitle = '';
    let bodyLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!title && line.startsWith('# ')) {
            title = line.replace(/^#\s+/, '').trim();
        } else if (!subtitle && line.startsWith('## ')) {
            subtitle = line.replace(/^##\s+/, '').trim();
        } else {
            bodyLines.push(line);
        }
    }

    const bodyText = bodyLines.join('\n').trim();

    // Convert to clean HTML
    const html = bodyText
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-white mt-6 mb-2">$1</h3>')
        .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/^\> (.*$)/gim, '<blockquote class="border-l-2 border-neon pl-4 italic text-gray-400 my-4">$1</blockquote>')
        .split(/\n\s*\n/)
        .map(p => {
            const trimmed = p.trim();
            if (!trimmed) return '';
            if (trimmed.startsWith('<h') || trimmed.startsWith('<blockquote')) return trimmed;
            return `<p class="mb-4 leading-relaxed">${trimmed.replace(/\n/g, '<br>')}</p>`;
        })
        .filter(Boolean)
        .join('');

    const relativePath = path.relative(__dirname, filePath).replace(/\\/g, '/');
    const basename = path.basename(filePath, '.md');

    return {
        id: basename,
        title: title || basename,
        subtitle: subtitle || 'Creative Piece',
        file: relativePath,
        content: html
    };
}

console.log('Scanning creative-work markdown files...');

// 1. Novels
const novelsDir = path.join(BASE_DIR, 'novels');
const novelFiles = fs.existsSync(novelsDir) ? fs.readdirSync(novelsDir).filter(f => f.endsWith('.md')) : [];
const chapters = novelFiles.map(f => {
    const parsed = parseMarkdownFile(path.join(novelsDir, f));
    // Extract chapter number from subtitle or title
    let chNum = 'Chapter 1';
    let cleanTitle = parsed.title;
    if (parsed.subtitle && parsed.subtitle.toLowerCase().includes('chapter')) {
        chNum = parsed.subtitle.split(':')[0].trim();
        cleanTitle = parsed.subtitle.includes(':') ? parsed.subtitle.split(':')[1].trim() : parsed.title;
    }
    return {
        id: parsed.id,
        chapterNumber: chNum,
        title: cleanTitle,
        subtitle: `${parsed.title} • ${chNum}`,
        file: parsed.file,
        readTime: `${Math.max(2, Math.round(parsed.content.length / 300))} min read`,
        content: parsed.content
    };
});

// Group chapters by Novel (e.g. Alphas)
const novelTitle = chapters.length > 0 ? chapters[0].subtitle.split('•')[0].trim() : "Alphas";
const novelsList = [
    {
        id: "alphas",
        title: novelTitle || "Alphas",
        series: "Alphas Series • Book 1",
        genre: "Sci-Fi Speculative Thriller",
        synopsis: "When rewritten genetics meet synthetic isolation, humanity encounters its next predator.",
        chapters: chapters
    }
];

// 2. Poetry
const poetryDir = path.join(BASE_DIR, 'poetry');
const poetryFiles = fs.existsSync(poetryDir) ? fs.readdirSync(poetryDir).filter(f => f.endsWith('.md')) : [];
const poems = poetryFiles.map(f => {
    const parsed = parseMarkdownFile(path.join(poetryDir, f));
    return {
        id: parsed.id,
        title: parsed.title,
        subtitle: parsed.subtitle,
        form: parsed.subtitle || "Poem",
        file: parsed.file,
        content: parsed.content
    };
});

// 3. Short Stories
const storiesDir = path.join(BASE_DIR, 'stories');
const storyFiles = fs.existsSync(storiesDir) ? fs.readdirSync(storiesDir).filter(f => f.endsWith('.md')) : [];
const stories = storyFiles.map(f => {
    const parsed = parseMarkdownFile(path.join(storiesDir, f));
    return {
        id: parsed.id,
        title: parsed.title,
        subtitle: parsed.subtitle,
        file: parsed.file,
        content: parsed.content
    };
});

// 4. Bible Studies
const studiesDir = path.join(BASE_DIR, 'studies');
const studyFiles = fs.existsSync(studiesDir) ? fs.readdirSync(studiesDir).filter(f => f.endsWith('.md')) : [];
const studies = studyFiles.map(f => {
    const parsed = parseMarkdownFile(path.join(studiesDir, f));
    return {
        id: parsed.id,
        title: parsed.title,
        subtitle: parsed.subtitle,
        file: parsed.file,
        content: parsed.content
    };
});

console.log(`- Found ${chapters.length} novel chapter(s)`);
console.log(`- Found ${poems.length} poem(s)`);
console.log(`- Found ${stories.length} short story(ies)`);
console.log(`- Found ${studies.length} study essay(s)`);

// Build the data.js content
const output = `/**
 * Creative Works Data Module
 * Auto-generated by sync-creative.js or edited manually.
 * Supports both direct .md file loading via fetch() and cached content fallback!
 */

window.creativeWorksData = {
    novels: {
        title: "Novels",
        novels: ${JSON.stringify(novelsList, null, 4)},
        items: []
    },
    poetry: {
        title: "Poetry & Lyrics",
        items: ${JSON.stringify(poems, null, 4)}
    },
    stories: {
        title: "Short Stories",
        items: ${JSON.stringify(stories, null, 4)}
    },
    studies: {
        title: "Bible Studies",
        items: ${JSON.stringify(studies, null, 4)}
    }
};

/**
 * Synchronize flattened items for novels for backwards compatibility
 */
function syncNovelItems() {
    if (!window.creativeWorksData || !window.creativeWorksData.novels) return;
    const novelsList = window.creativeWorksData.novels.novels || [];
    const flattened = [];
    novelsList.forEach(novel => {
        (novel.chapters || []).forEach(ch => {
            flattened.push({
                id: ch.id,
                title: ch.title,
                subtitle: \`\${novel.title} • \${ch.chapterNumber || 'Chapter'}\`,
                file: ch.file,
                content: ch.content
            });
        });
    });
    window.creativeWorksData.novels.items = flattened;
}
syncNovelItems();

window.addPoem = function(poem) {
    if (!poem || !poem.title) return;
    if (!poem.id) poem.id = poem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    window.creativeWorksData.poetry.items.push(poem);
    return poem;
};

window.addNovel = function(novel) {
    if (!novel || !novel.title) return;
    if (!novel.id) novel.id = novel.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!novel.chapters) novel.chapters = [];
    window.creativeWorksData.novels.novels.push(novel);
    syncNovelItems();
    return novel;
};

window.addChapter = function(novelId, chapter) {
    if (!novelId || !chapter || !chapter.title) return;
    const novel = (window.creativeWorksData.novels.novels || []).find(n => n.id === novelId);
    if (!novel) return;
    if (!chapter.id) chapter.id = \`\${novelId}-\${novel.chapters.length + 1}\`;
    novel.chapters.push(chapter);
    syncNovelItems();
    return chapter;
};
`;

fs.writeFileSync(DATA_FILE, output, 'utf-8');
console.log('Successfully updated creative-work/data.js directly from markdown files!');
