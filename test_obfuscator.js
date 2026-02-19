const JavaScriptObfuscator = require('javascript-obfuscator');

// Test the problematic code
const testCode = `
function escapeTooltip(text) {
    if (!text) return '';
    return text.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
`;

try {
    const result = JavaScriptObfuscator.obfuscate(testCode, { compact: true });
    console.log('SUCCESS: Basic obfuscation works');
    console.log(result.getObfuscatedCode().substring(0, 200));
} catch(e) {
    console.log('FAILED:', e.message);
}
