import { GeminiService} from "../services/gemini.service";

async function testGemini() {
  const gemini = new GeminiService();

  console.log('Testing question generation...');
  const questions = await gemini.generateQuestions('Frontend Developer', 'INTERMEDIATE', 3);
  console.log('Questions:', questions);

  console.log('\nTesting answer evaluation...');
  const evaluation = await gemini.evaluateAnswer(
    'What is React?',
    'React is a JavaScript library for building user interfaces. It uses a component-based architecture.'
  );
  console.log('Evaluation:', evaluation);

  console.log('\nTesting report generation...');
  const report = await gemini.generateReport(
    ['What is your experience with JavaScript?', 'Tell me about a challenging project.'],
    ['I have 3 years of experience with JavaScript', 'I built an e-commerce website using React']
  );
  console.log('Report:', report);
}

testGemini().catch(console.error);