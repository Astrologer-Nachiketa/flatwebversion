const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');
const { parse } = require('node-html-parser');

const inputFile = 'index.html';
const outputFile = 'indexprotect.html';

// Very light obfuscation - should work with any code
const safeObfuscationOptions = {
    compact: true,
    controlFlowFlattening: false,
    deadCodeInjection: false,
    debugProtection: false,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: false,
    renameGlobals: false,
    selfDefending: false,
    simplify: false,
    splitStrings: false,
    stringArray: false,
    unicodeEscapeSequence: false
};

// Light obfuscation with string array
const lightObfuscationOptions = {
    compact: true,
    controlFlowFlattening: false,
    deadCodeInjection: false,
    debugProtection: false,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: false,
    renameGlobals: false,
    selfDefending: false,
    simplify: true,
    splitStrings: false,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayEncoding: ['none'],
    stringArrayThreshold: 0.5,
    unicodeEscapeSequence: false
};

// Medium obfuscation - balanced protection
const mediumObfuscationOptions = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.3,
    deadCodeInjection: false,
    debugProtection: false,
    disableConsoleOutput: true,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: false,
    renameGlobals: false,
    selfDefending: false,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 5,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.6,
    unicodeEscapeSequence: false
};

function obfuscateScript(content, options, description) {
    try {
        console.log(`  Trying ${description}...`);
        const result = JavaScriptObfuscator.obfuscate(content, options);
        console.log(`  ✓ ${description} succeeded`);
        return result.getObfuscatedCode();
    } catch (err) {
        console.log(`  ✗ ${description} failed: ${err.message.split('\n')[0]}`);
        return null;
    }
}

try {
    const htmlContent = fs.readFileSync(inputFile, 'utf-8');
    const root = parse(htmlContent);
    const scripts = root.querySelectorAll('script');

    console.log(`Found ${scripts.length} script tag(s).\n`);

    let obfuscatedCount = 0;
    let failedCount = 0;

    scripts.forEach((script, index) => {
        // Use rawText to avoid HTML entity decoding (textContent decodes &amp; -> &, &#39; -> ', etc.)
        const content = script.rawText || script.textContent;

        if (content && content.trim().length > 0 && !script.getAttribute('src') &&
            (!script.getAttribute('type') || script.getAttribute('type') === 'text/javascript' || script.getAttribute('type') === 'module')) {

            console.log(`Processing inline script #${index + 1} (${content.length} chars)...`);

            let obfuscatedCode = null;

            // Try progressively lighter obfuscation
            obfuscatedCode = obfuscateScript(content, mediumObfuscationOptions, 'medium protection');

            if (!obfuscatedCode) {
                obfuscatedCode = obfuscateScript(content, lightObfuscationOptions, 'light protection');
            }

            if (!obfuscatedCode) {
                obfuscatedCode = obfuscateScript(content, safeObfuscationOptions, 'safe protection');
            }

            if (obfuscatedCode) {
                // Use innerHTML to set content without re-encoding special chars
                script.innerHTML = obfuscatedCode;
                obfuscatedCount++;
                console.log(`  ✓ Script obfuscated successfully\n`);
            } else {
                console.log(`  ⚠ Keeping original code (all obfuscation methods failed)\n`);
                failedCount++;
            }
        }
    });

    fs.writeFileSync(outputFile, root.toString());
    console.log(`✓ Successfully created ${outputFile}`);
    console.log(`  - Scripts obfuscated: ${obfuscatedCount}`);
    console.log(`  - Scripts failed: ${failedCount}`);

} catch (err) {
    console.error('Error processing file:', err);
}
