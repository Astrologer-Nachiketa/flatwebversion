const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

// Extract script from HTML
const html = fs.readFileSync('index.html', 'utf8');
const match = html.match(/<script[^>]*>([\s\S]*?)<\/script>/i);

if (!match) {
    console.log('No script found');
    process.exit(1);
}

const fullScript = match[1];
const lines = fullScript.split('\n');
console.log(`Total lines in script: ${lines.length}`);

// Test each section to find the error
function testSection(startLine, endLine, name) {
    const section = lines.slice(startLine, endLine).join('\n');
    try {
        JavaScriptObfuscator.obfuscate(section, { compact: true });
        console.log(`✓ ${name} (lines ${startLine+1}-${endLine}) - OK`);
        return true;
    } catch(e) {
        console.log(`✗ ${name} (lines ${startLine+1}-${endLine}) - FAILED: ${e.message.split('\n')[0]}`);
        return false;
    }
}

console.log('\nTesting sections...\n');

// Binary search to find problematic section
const totalLines = lines.length;
const midPoint = Math.floor(totalLines / 2);

// Test first half
const firstHalfOK = testSection(0, midPoint, 'First half');

// Test second half  
const secondHalfOK = testSection(midPoint, totalLines, 'Second half');

if (!firstHalfOK) {
    console.log('\nError is in first half');
    // Further divide first half
    const quarter = Math.floor(midPoint / 2);
    testSection(0, quarter, 'First quarter');
    testSection(quarter, midPoint, 'Second quarter');
}

if (!secondHalfOK) {
    console.log('\nError is in second half');
    // Further divide second half
    const threeQuarters = midPoint + Math.floor((totalLines - midPoint) / 2);
    testSection(midPoint, threeQuarters, 'Third quarter');
    testSection(threeQuarters, totalLines, 'Fourth quarter');
}
