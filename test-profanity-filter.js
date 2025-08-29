// Test script for profanity filter
const { Filter } = require('glin-profanity');
const { checkGermanText } = require('bad-words-checker');

// Test the profanity filter logic
function testProfanityFilter() {
  console.log('🧪 Testing Profanity Filter...\n');

  // Initialize glin-profanity filter
  const glin = new Filter({
    languages: ['english', 'german'],
    caseSensitive: false,
    wordBoundaries: true,
    allowObfuscatedMatch: true,
  });

  const HIDDEN = '(this message is hidden due to inappropriate content )';

  function normalizeLanguage(typeName) {
    const n = (typeName || '').toLowerCase();
    if (n.includes('german') || n === 'de' || n === 'ger' || n === 'de-de') return 'german';
    return 'english';
  }

  function check(text, lang) {
    // 1) bad-words-checker (priority) - only for German
    if (lang === 'german') {
      if (checkGermanText(text)) return true;
    }

    // 2) glin-profanity for both English and German
    return glin.isProfane(text);
  }

  function sanitize(text, lang) {
    const prof = check(text, lang);
    return prof ? { isProfane: true, result: HIDDEN } : { isProfane: false, result: text };
  }

  // Test cases
  const testCases = [
    { text: 'Hello world', type: 'English', expected: false },
    { text: 'This is a test message', type: 'English', expected: false },
    { text: 'Hallo Welt', type: 'German', expected: false },
    { text: 'Das ist ein Test', type: 'German', expected: false },
    // Add some potentially profane words for testing
    { text: 'bad word here', type: 'English', expected: true },
    { text: 'schlechtes Wort hier', type: 'German', expected: true },
  ];

  testCases.forEach((testCase, index) => {
    const lang = normalizeLanguage(testCase.type);
    const result = sanitize(testCase.text, lang);
    
    console.log(`Test ${index + 1}:`);
    console.log(`  Text: "${testCase.text}"`);
    console.log(`  Type: ${testCase.type} (${lang})`);
    console.log(`  Result: ${result.isProfane ? 'PROFANE' : 'CLEAN'}`);
    console.log(`  Content: "${result.result}"`);
    console.log(`  Expected: ${testCase.expected ? 'PROFANE' : 'CLEAN'}`);
    console.log(`  Status: ${result.isProfane === testCase.expected ? '✅ PASS' : '❌ FAIL'}`);
    console.log('');
  });

  console.log('🎯 Profanity filter test completed!');
}

// Run the test
testProfanityFilter();
