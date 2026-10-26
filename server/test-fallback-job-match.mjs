import assert from 'node:assert/strict';
import { fallbackJobMatch } from './src/services/ai/ai.service.js';

const tests = [
  {
    name: 'Partial match',
    profile: { skills: ['Python', 'SQL'] },
    job: 'We need Python, SQL and React',
    score: 67,
    matching: ['Python', 'SQL'],
    missing: ['React']
  },
  {
    name: 'No matching skills',
    profile: { skills: ['Python'] },
    job: 'We need React and AWS',
    score: 0,
    matching: [],
    missing: ['React', 'AWS']
  },
  {
    name: 'All skills match',
    profile: { skills: ['Python', 'SQL', 'React'] },
    job: 'We need Python, SQL and React',
    score: 100,
    matching: ['Python', 'React', 'SQL'],
    missing: []
  },
  {
    name: 'Empty job description',
    profile: { skills: ['Python', 'React'] },
    job: '',
    score: 0,
    matching: [],
    missing: []
  },
  {
    name: 'Project technologies count as matching skills',
    profile: {
      skills: [],
      projects: [
        { techStack: ['React', 'Node.js'] }
      ]
    },
    job: 'We need React, Node.js and AWS',
    score: 67,
    matching: ['React', 'Node.js'],
    missing: ['AWS']
  },
  {
    name: 'Missing profile data',
    profile: {},
    job: 'We need React and AWS',
    score: 0,
    matching: [],
    missing: ['React', 'AWS']
  },
];

for (const test of tests) {
  const result = fallbackJobMatch(test.profile, test.job);
  assert.equal(result.matchScore, test.score, `${test.name}: score`);
  assert.deepEqual(result.matchingSkills, test.matching, `${test.name}: matching`);
  assert.deepEqual(result.missingSkills, test.missing, `${test.name}: missing`);

  console.log(`PASS: ${test.name}`);
}

console.log('\nAll 6 tests passed!');
