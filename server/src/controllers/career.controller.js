import { CareerGoal } from '../models/CareerGoal.js';
import { Profile } from '../models/Profile.js';
import { buildUserAIContext } from '../services/ai/context.service.js';

export const getCareerPaths = async (req, res, next) => {
  try {
    const predefinedPaths = [
      {
        role: 'AI Engineer',
        description: 'Design, train, and deploy production ML models, Transformers, and LLM pipelines.',
        requiredSkills: ['Python', 'PyTorch', 'Transformers', 'REST APIs', 'Docker', 'System Design'],
        averageSalary: '₹10–28 LPA',
        salaryBreakdown: { entry: '₹6–12 LPA', mid: '₹12–25 LPA', senior: '₹25–50+ LPA' },
        demandRating: 'Very High',
        stages: [
          { stageNumber: 1, title: 'Foundational Data & Math', focusArea: 'Python, NumPy, Pandas, Linear Algebra' },
          { stageNumber: 2, title: 'Machine Learning Algorithms', focusArea: 'Supervised/Unsupervised Learning, Scikit-Learn' },
          { stageNumber: 3, title: 'Deep Learning & Neural Networks', focusArea: 'PyTorch, CNNs, RNNs, Model Fine-Tuning' },
          { stageNumber: 4, title: 'LLM & Generative AI Systems', focusArea: 'LangChain, Vector DBs, RAG, Prompt Engineering' },
          { stageNumber: 5, title: 'Production AI Deployment', focusArea: 'FastAPI, Docker, ONNX, Model Monitoring' }
        ]
      },
      {
        role: 'Generative AI Engineer',
        description: 'Architect RAG workflows, fine-tune open-weights LLMs, vector search, and autonomous AI agents.',
        requiredSkills: ['Python', 'LangChain', 'LlamaIndex', 'Pinecone/Qdrant', 'PyTorch', 'FastAPI'],
        averageSalary: '₹12–35 LPA',
        salaryBreakdown: { entry: '₹8–15 LPA', mid: '₹15–30 LPA', senior: '₹30–60+ LPA' },
        demandRating: 'Extremely High',
        stages: [
          { stageNumber: 1, title: 'LLM Fundamentals & Prompting', focusArea: 'Prompt Engineering, Tokenization, OpenAI & Gemini APIs' },
          { stageNumber: 2, title: 'Vector Embeddings & RAG Systems', focusArea: 'Chunking Strategies, Hybrid Search, Vector Databases' },
          { stageNumber: 3, title: 'Model Fine-Tuning & Quantization', focusArea: 'PEFT, LoRA, QLoRA, Hugging Face Transformers' },
          { stageNumber: 4, title: 'Autonomous AI Agents', focusArea: 'Tool Calling, Agentic Workflows, LangGraph' }
        ]
      },
      {
        role: 'Machine Learning Engineer',
        description: 'Build scalable ML pipelines, feature stores, and automated model training architectures.',
        requiredSkills: ['Python', 'Scikit-Learn', 'TensorFlow', 'Feature Engineering', 'Docker', 'SQL'],
        averageSalary: '₹9–26 LPA',
        salaryBreakdown: { entry: '₹6–10 LPA', mid: '₹10–22 LPA', senior: '₹22–45+ LPA' },
        demandRating: 'Very High',
        stages: [
          { stageNumber: 1, title: 'Data Preprocessing & Math', focusArea: 'Pandas, Feature Scaling, Probability & Stats' },
          { stageNumber: 2, title: 'Core ML Algorithms', focusArea: 'Decision Trees, XGBoost, Clustering, SVMs' },
          { stageNumber: 3, title: 'Model Evaluation & Optimization', focusArea: 'Hyperparameter Tuning, Cross-Validation' },
          { stageNumber: 4, title: 'ML Pipeline Engineering', focusArea: 'Scikit-Learn Pipelines, MLflow tracking' }
        ]
      },
      {
        role: 'MLOps Engineer',
        description: 'Automate ML deployment, model drift monitoring, CI/CD pipelines, and cloud infra scaling.',
        requiredSkills: ['Python', 'Docker', 'Kubernetes', 'MLflow', 'Airflow', 'CI/CD', 'AWS/GCP'],
        averageSalary: '₹10–28 LPA',
        salaryBreakdown: { entry: '₹7–12 LPA', mid: '₹12–25 LPA', senior: '₹25–50+ LPA' },
        demandRating: 'High',
        stages: [
          { stageNumber: 1, title: 'Containerization & DevOps', focusArea: 'Docker, Linux Shell, Git Workflows' },
          { stageNumber: 2, title: 'Orchestration & Workflow Pipelines', focusArea: 'Apache Airflow, Prefect, Kubeflow' },
          { stageNumber: 3, title: 'Model Registry & Tracking', focusArea: 'MLflow, DVC Data Versioning' },
          { stageNumber: 4, title: 'Continuous Monitoring & Alerting', focusArea: 'Evidently AI, Prometheus, Grafana' }
        ]
      },
      {
        role: 'Data Scientist',
        description: 'Extract statistical insights, conduct experimentation, and build predictive algorithms from big data.',
        requiredSkills: ['Python', 'SQL', 'R', 'Pandas', 'Statistical Modeling', 'Tableau/Recharts'],
        averageSalary: '₹8–24 LPA',
        salaryBreakdown: { entry: '₹5–10 LPA', mid: '₹10–20 LPA', senior: '₹20–42+ LPA' },
        demandRating: 'High',
        stages: [
          { stageNumber: 1, title: 'Data Analysis & SQL Foundations', focusArea: 'Advanced SQL queries, Data Cleaning, Pandas' },
          { stageNumber: 2, title: 'Exploratory Data Analysis', focusArea: 'Matplotlib, Seaborn, Hypothesis Testing' },
          { stageNumber: 3, title: 'Predictive Modeling & ML', focusArea: 'Regression, Classification, Feature Selection' },
          { stageNumber: 4, title: 'Model Evaluation & Business Insights', focusArea: 'A/B Testing, Cross Validation, Executive Reporting' }
        ]
      },
      {
        role: 'Data Engineer',
        description: 'Construct data pipelines, data warehouses, ETL workflows, and big data infrastructure.',
        requiredSkills: ['SQL', 'Python', 'Apache Spark', 'Kafka', 'Airflow', 'Snowflake', 'PostgreSQL'],
        averageSalary: '₹7–22 LPA',
        salaryBreakdown: { entry: '₹5–9 LPA', mid: '₹9–18 LPA', senior: '₹18–38+ LPA' },
        demandRating: 'High',
        stages: [
          { stageNumber: 1, title: 'SQL & Database Systems', focusArea: 'PostgreSQL, Query Optimization, Normalization' },
          { stageNumber: 2, title: 'ETL Pipeline Design', focusArea: 'Python ETL Scripts, Airflow DAGs' },
          { stageNumber: 3, title: 'Big Data Processing', focusArea: 'Apache Spark, PySpark, Distributed Systems' },
          { stageNumber: 4, title: 'Data Warehousing & Streaming', focusArea: 'Snowflake, BigQuery, Apache Kafka' }
        ]
      },
      {
        role: 'Full Stack Developer',
        description: 'Architect complete Web applications from intuitive React UIs to scalable Node/Express microservices.',
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Tailwind CSS'],
        averageSalary: '₹6–20 LPA',
        salaryBreakdown: { entry: '₹4.5–9 LPA', mid: '₹9–18 LPA', senior: '₹18–35+ LPA' },
        demandRating: 'High',
        stages: [
          { stageNumber: 1, title: 'Modern Frontend & UX', focusArea: 'HTML5, ES6+ JS, Tailwind CSS, Responsive Layouts' },
          { stageNumber: 2, title: 'Interactive Single Page Apps', focusArea: 'React, React Router, Context API, Hooks' },
          { stageNumber: 3, title: 'Backend REST Architecture', focusArea: 'Node.js, Express, Middleware, JWT Security' },
          { stageNumber: 4, title: 'Database & Data Access Layer', focusArea: 'MongoDB, Mongoose, Aggregations, Indexing' },
          { stageNumber: 5, title: 'Full Stack Integration & CI/CD', focusArea: 'Full App Deployment, Docker, Vercel, Testing' }
        ]
      },
      {
        role: 'Software Engineer',
        description: 'Engineers core algorithms, data structures, backend microservices, and system design.',
        requiredSkills: ['Data Structures', 'Algorithms', 'Java/C++', 'System Design', 'Git', 'SQL'],
        averageSalary: '₹6–18 LPA',
        salaryBreakdown: { entry: '₹4.5–8.5 LPA', mid: '₹8.5–16 LPA', senior: '₹16–32+ LPA' },
        demandRating: 'High',
        stages: [
          { stageNumber: 1, title: 'Data Structures & Algorithms', focusArea: 'Arrays, Trees, Graphs, Dynamic Programming' },
          { stageNumber: 2, title: 'Object-Oriented Programming', focusArea: 'Java / C++, Design Patterns, SOLID Principles' },
          { stageNumber: 3, title: 'System Design Fundamentals', focusArea: 'Load Balancing, Caching, Database Indexing' }
        ]
      },
      {
        role: 'Data Analyst',
        description: 'Analyze business datasets, build executive dashboards, and derive actionable reporting.',
        requiredSkills: ['SQL', 'Excel', 'Python', 'Tableau', 'Power BI', 'Statistics'],
        averageSalary: '₹5–14 LPA',
        salaryBreakdown: { entry: '₹4–7 LPA', mid: '₹7–13 LPA', senior: '₹13–24+ LPA' },
        demandRating: 'Moderate',
        stages: [
          { stageNumber: 1, title: 'Advanced Excel & SQL Basics', focusArea: 'VLOOKUP, Pivot Tables, SQL Joins & Grouping' },
          { stageNumber: 2, title: 'Data Visualization & BI', focusArea: 'Tableau / Power BI Dashboards' },
          { stageNumber: 3, title: 'Python for Analysis', focusArea: 'Pandas, NumPy, Matplotlib' }
        ]
      }
    ];

    res.json({
      success: true,
      data: predefinedPaths,
    });
  } catch (error) {
    next(error);
  }
};

export const assessCareerPath = async (req, res, next) => {
  try {
    const { targetRole } = req.body;
    const userContext = await buildUserAIContext(req.user._id);

    const goal = await CareerGoal.findOneAndUpdate(
      { user: req.user._id },
      {
        targetRole: targetRole || 'Full Stack Developer',
        currentReadiness: userContext.profile.readinessScore || 70,
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      data: {
        goal,
        userContext,
      },
    });
  } catch (error) {
    next(error);
  }
};
