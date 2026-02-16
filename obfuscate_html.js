const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');
const { parse } = require('node-html-parser');

const inputFile = 'index.html';
const outputFile = 'index_obfuscated.html';

// Configuration for javascript-obfuscator
const obfuscationOptions = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false,
    debugProtectionInterval: 0,
    disableConsoleOutput: true,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    selfDefending: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayEncoding: ['base64'],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 1,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 2,
    stringArrayWrappersType: 'variable',
    stringArrayThreshold: 0.75,
    unicodeEscapeSequence: false
};

try {
    const htmlContent = fs.readFileSync(inputFile, 'utf-8');
    const root = parse(htmlContent);
    const scripts = root.querySelectorAll('script');

    console.log(`Found ${scripts.length} script tags.`);

    scripts.forEach((script, index) => {
        const content = script.textContent;
        // Only obfuscate if there is content (inline script) and it's not JSON (e.g. type="application/json")
        // and doesn't have a src attribute (external script)
        if (content && content.trim().length > 0 && !script.getAttribute('src') && (!script.getAttribute('type') || script.getAttribute('type') === 'text/javascript' || script.getAttribute('type') === 'module')) {
            console.log(`Obfuscating inline script #${index + 1}...`);
            try {
                const obfuscationResult = JavaScriptObfuscator.obfuscate(content, obfuscationOptions);
                script.textContent = obfuscationResult.getObfuscatedCode();
            } catch (err) {
                console.error(`Error obfuscating script #${index + 1}:`, err.message);
            }
        }
    });

    fs.writeFileSync(outputFile, root.toString());
    console.log(`Successfully created ${outputFile}`);

} catch (err) {
    console.error('Error processing file:', err);
}
