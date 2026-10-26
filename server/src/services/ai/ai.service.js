import { GoogleGenerativeAI } from '@google/generative-ai';

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key')) {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

// Generic JSON completion helper with AI Key or Fallback rule execution
export const generateAIResponse = async (prompt, fallbackFn) => {
  const genAI = getGeminiClient();

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Clean JSON formatting if model returns markdown ticks
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.warn(`[AI Service Warning] Gemini API call failed or returned unparseable output: ${error.message}. Running fallback engine.`);
    }
  }

  // Execute Fallback Engine if API key missing or call fails
  return fallbackFn();
};

// Generic Text/Chat completion helper
export const generateAIChatResponse = async (systemPrompt, fallbackText) => {
  const genAI = getGeminiClient();

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(systemPrompt);
      return result.response.text();
    } catch (error) {
      console.warn(`[AI Service Warning] Gemini Chat API call failed: ${error.message}. Using fallback engine.`);
    }
  }

  return fallbackText;
};

// Specialized Fallback Generators for High Reliability

export const fallbackResumeAnalysis = (extractedText, targetRole) => {
  const text = (extractedText || '').toLowerCase();
  
  const commonSkills = ['javascript', 'react', 'node', 'express', 'python', 'sql', 'mongodb', 'git', 'docker', 'aws', 'rest api', 'java', 'c++', 'html', 'css', 'typescript', 'machine learning'];
  const detected = commonSkills.filter(s => text.includes(s));
  const missing = ['Docker', 'System Design', 'CI/CD Pipelines', 'Unit Testing (Jest/Vitest)', 'Redis Caching'].filter(s => !text.includes(s.toLowerCase()));

  const baseScore = Math.min(92, Math.max(55, detected.length * 9 + 40));

  return {
    score: baseScore,
    atsCompatibility: baseScore > 80 ? 'High' : baseScore > 65 ? 'Moderate' : 'Needs Work',
    detectedSkills: detected.length > 0 ? detected.map(s => s.toUpperCase()) : ['JAVASCRIPT', 'REACT', 'GIT'],
    missingKeywords: missing.slice(0, 4),
    strengths: [
      'Clear project impact metrics and concise bullet points',
      'Solid foundational tech stack for full-stack & software engineering roles',
      'Clean structural layout and standard header hierarchy'
    ],
    weaknesses: [
      'Lacks explicit Cloud/DevOps infrastructure highlights (e.g. AWS/Docker)',
      'Limited quantitative results on scalability or performance optimization'
    ],
    recommendations: [
      `Add 2-3 bullet points showcasing metric improvements (e.g. "Improved load times by 35%")`,
      `Incorporate key target role keywords: ${missing.slice(0, 2).join(', ')}`,
      `Add a dedicated "Cloud & Tools" section to pass ATS keyword filters for ${targetRole || 'Software Engineer'}`
    ],
    roleMatchPercentage: Math.min(95, baseScore + 5)
  };
};


export const fallbackJobMatch = (userContext, jobDescriptionText) => {
  const text = (jobDescriptionText || '').toLowerCase();

  // 1. Known technical skills and their aliases
  const skillAliases = {
    JavaScript: ['javascript', 'java script'],
    TypeScript: ['typescript', 'type script'],
    Python: ['python'],
    Java: ['java'],
    'C++': ['c++'],
    React: ['react', 'react.js', 'reactjs'],
    'Node.js': ['node.js', 'nodejs', 'node js'],
    Express: ['express.js', 'expressjs', 'express'],
    MongoDB: ['mongodb', 'mongo db'],
    SQL: ['sql', 'mysql', 'postgresql', 'postgres'],
    'REST APIs': ['rest api', 'rest apis', 'restful api', 'restful apis'],
    GraphQL: ['graphql'],
    Git: ['git', 'github'],
    Docker: ['docker'],
    Kubernetes: ['kubernetes', 'k8s'],
    AWS: ['aws', 'amazon web services'],
    Azure: ['azure'],
    'Google Cloud': ['google cloud', 'gcp'],
    Redis: ['redis'],
    HTML: ['html'],
    CSS: ['css'],
    'Tailwind CSS': ['tailwind css', 'tailwind'],
    Redux: ['redux'],
    'Data Structures and Algorithms': ['data structures', 'algorithms', 'dsa'],
    'System Design': ['system design'],
    Microservices: ['microservices', 'microservice architecture'],
    'CI/CD': ['ci/cd', 'continuous integration', 'continuous deployment']
  };

  // Avoid matching a short skill inside an unrelated word.
  const containsTerm = (source, term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = escaped.replace(/\s+/g, '\\s+');

    return new RegExp(
      `(^|[^a-z0-9+#])${pattern}(?=$|[^a-z0-9+#])`,
      'i'
    ).test(source);
  };

  // 2. Extract recognized skills required by the job.
  const requiredSkills = Object.entries(skillAliases)
    .filter(([, aliases]) =>
      aliases.some(alias => containsTerm(text, alias))
    )
    .map(([skill]) => skill);

  // 3. Read skills and project technologies from the user's profile.
  const profileSkills = [
    ...(Array.isArray(userContext?.skills)
      ? userContext.skills.map(skill =>
          typeof skill === 'string'
            ? skill
            : skill?.name || skill?.skill || ''
        )
      : []),

    ...(Array.isArray(userContext?.projects)
      ? userContext.projects.flatMap(project => {
          const technologies = project?.techStack ?? project?.technologies ?? [];

          if (Array.isArray(technologies)) {
            return technologies.map(tech =>
              typeof tech === 'string'
                ? tech
                : tech?.name || tech?.technology || ''
            );
          }

          if (typeof technologies === 'string') {
            return technologies.split(/[,|]/);
          }

          return [];
        })
      : [])
  ].filter(Boolean);

  const profileText = profileSkills.join(' ').toLowerCase();

  // 4. Compare profile skills with job requirements.
  const matchingSkills = requiredSkills.filter(skill => {
    const aliases = skillAliases[skill];

    return aliases.some(alias => containsTerm(profileText, alias)) ||
      containsTerm(profileText, skill.toLowerCase());
  });

  const missingSkills = requiredSkills.filter(
    skill => !matchingSkills.includes(skill)
  );

  // 5. Calculate score dynamically.
  const matchScore = requiredSkills.length === 0
    ? 0
    : Math.round(
        (matchingSkills.length / requiredSkills.length) * 100
      );

  // 6. Generate recommendations based on actual gaps.
  const recommendations = missingSkills.length > 0
    ? missingSkills.map(
        skill => `Learn and practice ${skill} to improve your job match.`
      )
    : requiredSkills.length > 0
      ? ['Review the job description and strengthen your existing skills with practical projects.']
      : ['No recognized technical skills were detected in this job description. Review the requirements manually.'];

  // 7. Infer a basic role label from the job description.
  const jobTitle = /\b(ai|machine learning|deep learning)\b/i.test(text)
    ? 'AI / Machine Learning Engineer'
    : /\b(frontend|front-end|react developer|ui developer)\b/i.test(text)
      ? 'Frontend Developer'
      : /\b(backend|back-end|server-side)\b/i.test(text)
        ? 'Backend Developer'
        : /\b(full stack|full-stack|mern)\b/i.test(text)
          ? 'Full Stack Developer'
          : 'Software Developer';

  return {
    jobTitle,
    companyName: 'Not specified',
    matchScore,
    matchingSkills,
    partialMatches: [],
    missingSkills,
    experienceGaps: [],
    recommendations
  };
};


export const fallbackRoadmap = (targetRole = 'Full Stack Developer') => {
  return {
    targetRole,
    totalMilestones: 12,
    phases: [
      {
        phaseNumber: 1,
        phaseTitle: 'Core Foundation & Modern Stack Mastery',
        description: 'Strengthen JavaScript fundamentals, async programming, React state management, and semantic UI/UX styling.',
        items: [
          { title: 'Master ES6+ Async/Await & Event Loop', category: 'Concept', resources: ['MDN Web Docs', 'JavaScript.info'] },
          { title: 'React Hooks & Context API Architecture', category: 'Skill', resources: ['React Official Docs'] },
          { title: 'Build Responsive Component Library with Tailwind CSS', category: 'Project', resources: ['Tailwind UI Patterns'] }
        ]
      },
      {
        phaseNumber: 2,
        phaseTitle: 'Backend Architecture & Database Design',
        description: 'Build robust REST APIs with Node.js, Express, and MongoDB schema design.',
        items: [
          { title: 'Express Middleware & JWT Authentication Pipeline', category: 'Skill', resources: ['Express Guide'] },
          { title: 'MongoDB Data Modeling & Indexing', category: 'Skill', resources: ['MongoDB University'] },
          { title: 'Build Full-Stack REST Application', category: 'Project', resources: ['Nexus AI Blueprint'] }
        ]
      },
      {
        phaseNumber: 3,
        phaseTitle: 'AI Integration & Advanced Engineering',
        description: 'Incorporate Large Language Model APIs, context awareness, and intelligent search into applications.',
        items: [
          { title: 'Prompt Engineering & Context Aggregation', category: 'Concept', resources: ['DeepLearning.AI'] },
          { title: 'Build Modular AI Service Abstraction Layer', category: 'Project', resources: ['Google GenAI SDK Docs'] },
          { title: 'Implement Vector Embeddings & RAG Concepts', category: 'Skill', resources: ['LangChain / Pinecone Guide'] }
        ]
      },
      {
        phaseNumber: 4,
        phaseTitle: 'Production Deployment & Career Preparation',
        description: 'Deploy web apps, optimize performance, refine resume ATS compliance, and prepare for technical interviews.',
        items: [
          { title: 'Docker Containerization & Vercel/Render Deployment', category: 'Skill', resources: ['Docker Handbook'] },
          { title: 'System Design Interview Prep (Load Balancing & Caching)', category: 'Concept', resources: ['ByteByteGo'] },
          { title: 'Portfolio Project Presentation & Mock Interview', category: 'Certification', resources: ['Nexus AI Review'] }
        ]
      }
    ]
  };
};
