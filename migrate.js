const fs = require('fs');
const path = require('path');

const publicFiles = [
    'src/pages/Home.jsx',
    'src/pages/ServiceDetail.jsx',
    'src/pages/FAQ.jsx',
    'src/pages/Contact.jsx',
    'src/pages/BlogDetail.jsx',
    'src/pages/NotFound.jsx'
];

publicFiles.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) return;

    let content = fs.readFileSync(fullPath, 'utf8');
    let original = content;

    // 1. Add import if not exists
    if (!content.includes('AnimatedButton')) {
        // Find last import
        const lines = content.split('\n');
        let lastImportIndex = 0;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('import ')) {
                lastImportIndex = i;
            }
        }
        lines.splice(lastImportIndex + 1, 0, "import AnimatedButton from '../components/AnimatedButton';");
        content = lines.join('\n');
    }

    // Replace <Link to="..." className="btn..." ...>Text</Link>
    // Notice that buttons might cross multiple lines, but most are single line
    content = content.replace(/<Link ([^>]*)className=(['"])([\w\s-]*btn.*?)\2([^>]*)>([^<]*)<\/Link>/g, (match, p1, quote, classes, p4, text) => {
        return `<AnimatedButton ${p1}className=${quote}${classes}${quote}${p4}>${text}</AnimatedButton>`;
    });

    // Replace <a href="..." className="btn..." ...>Text</a>
    content = content.replace(/<a ([^>]*)className=(['"])([\w\s-]*btn.*?)\2([^>]*)>([^<]*)<\/a>/g, (match, p1, quote, classes, p4, text) => {
        return `<AnimatedButton ${p1}className=${quote}${classes}${quote}${p4}>${text}</AnimatedButton>`;
    });

    // Replace <button className="btn..." ...>Text</button>
    content = content.replace(/<button([^>]*)className=(['"])([\w\s-]*btn.*?)\2([^>]*)>([^<]*)<\/button>/g, (match, p1, quote, classes, p4, text) => {
        if (classes.includes('nav-btn')) return match; // Skip gallery nav buttons
        return `<AnimatedButton${p1}className=${quote}${classes}${quote}${p4}>${text}</AnimatedButton>`;
    });

    if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
