import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlacementTest, PlacementLevel } from './placement-test.entity';
import { TypeEntity } from '../types/entity/Type';
import { StudentType } from '../student-type/entity/StudentType';

@Injectable()
export class PlacementTestService {
  constructor(
    @InjectRepository(PlacementTest)
    private readonly placementTestRepository: Repository<PlacementTest>,
    @InjectRepository(TypeEntity)
    private readonly typeRepository: Repository<TypeEntity>,
    @InjectRepository(StudentType)
    private readonly studentTypeRepository: Repository<StudentType>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async generateQuestions(typeId: number): Promise<any> {
    let prompt: string;
    // Fetch type name
    const type = await this.typeRepository.findOneBy({ id: typeId });
    if (type && type.name.toLowerCase() === 'english') {
      prompt = `
Build a comprehensive English placement test. The response should include:
- **Total Questions**: 40 questions in total.
  - **Grammar Questions**: 20 questions focused on various aspects of grammar.
  - **Vocabulary Questions**: 10 questions assessing vocabulary knowledge.
  - **Idiom Questions**: 10 questions related to idioms and their meanings.
- **Format**: Return the test in JSON format with the following structure:
  - \`test_title\`: (String) Title of the test.
  - \`questions\`: (Array of Objects) Each object should represent a question with the following fields:
    - \`question_number\`: (Integer) The number of the question.
    - \`question\`: (String) The text of the question.
    - \`options\`: (Array of Strings) Four multiple-choice answer options, labeled A, B, C, and D.
    - \`correct_answer\`: (String) The letter corresponding to the correct answer (A, B, C, or D).
- **Example Structure**: Please follow this example format for the JSON:
\`\`\`json
{
  "test_title": "English Placement Test",
  "questions": [
    {
      "question_number": 1,
      "question": "What is the past tense of 'go'?",
      "options": [
        "A) goed",
        "B) going",
        "C) went",
        "D) gone"
      ],
      "correct_answer": "C"
    }
  ]
}
\`\`\`
Make sure the questions cover a range of difficulties and adhere to the specified categories.
`;
    } else if (type && type.name.toLowerCase() === 'german') {
      prompt = `Build a comprehensive German placement test. The response should include:
- **Total Questions**: 40 questions in total.
  - **Grammar Questions**: 20 questions focused on various aspects of grammar.
  - **Vocabulary Questions**: 10 questions assessing vocabulary knowledge.
  - **Idiom Questions**: 10 questions related to idioms and their meanings.
- **Format**: Return the test in JSON format with the following structure:
  - \`test_title\`: (String) Title of the test.
  - \`questions\`: (Array of Objects) Each object should represent a question with the following fields:
    - \`question_number\`: (Integer) The number of the question.
    - \`question\`: (String) The text of the question.
    - \`options\`: (Array of Strings) Four multiple-choice answer options, labeled A, B, C, and D.
    - \`correct_answer\`: (String) The letter corresponding to the correct answer (A, B, C, or D).
- **Example Structure**: Please follow this example format for the JSON:
\`\`\`json  
{  
  "test_title": "German Placement Test",  
  "questions": [  
    {  
      "question_number": 1,  
      "question": "Was ist das richtige Verb? 'Ich ____ einen Kaffee.'",  
      "options": [  
        "A) habe",  
        "B) hat",  
        "C) hast",  
        "D) haben"  
      ],  
      "correct_answer": "A"  
    }  
  ]  
}   
\`\`\`
Make sure the questions cover a range of difficulties and adhere to the specified categories.`;
    } else {
      prompt = 'Build a general placement test.';
    }
    
    // Debug: Log the API key being used
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');
    console.log('OpenRouter API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
    
    try {
      const response = await this.httpService.post(
        'https://openrouter.ai/api/v1/chat/completions',
        JSON.stringify({
          model: 'deepseek/deepseek-r1-0528:free',
          messages: [
            { role: 'user', content: prompt }
          ]
        }),
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.FRONTEND_BASE_URL || 'https://icep2-production.up.railway.app',
            'X-Title': 'ICEP Placement Test',
          },
        },
      ).toPromise();
      return response.data;
    } catch (error) {
      console.error('OpenRouter error:', error.response?.data || error.message);
      throw error;
    }
  }

  async evaluateAnswers(studentId: number, answers: any, test: any, typeId: number): Promise<PlacementTest> {
    // Fetch type name
    const type = await this.typeRepository.findOneBy({ id: typeId });
    let prompt: string;
    if (type && type.name.toLowerCase() === 'english') {
      prompt = `Here is the placement test: ${JSON.stringify(test)}\nHere are the student's answers: ${JSON.stringify(answers)}. Based on the correct answers in the test, tell me the mark and the level (choose from 1A, 1B, 2A, 2B, 3A, 3B, 4A, 4B, 5A, 5B). Respond in JSON: {\"mark\": number, \"level\": string}`;
    } else if (type && type.name.toLowerCase() === 'german') {
      prompt = `Here is the placement test: ${JSON.stringify(test)}\nHere are the student's answers: ${JSON.stringify(answers)}. Based on the correct answers in the test, tell me the mark and the level (choose from 1A, A2, B1, B2, C1, C2). Respond in JSON: {\"mark\": number, \"level\": string};`;
    } else {
      prompt = 'Evaluate the answers and provide a mark.';
    }
    
    // Debug: Log the API key being used
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');
    console.log('OpenRouter API Key (evaluate):', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
    
    try {
      const response = await this.httpService.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'deepseek/deepseek-r1-0528:free',
          messages: [
            { role: 'user', content: prompt }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.FRONTEND_BASE_URL || 'https://icep2-production.up.railway.app',
            'X-Title': 'ICEP Placement Test',
          },
        },
      ).toPromise();
      let mark: number;
      let level: string;
      const content = response.data.choices[0].message.content;
      // Try to extract JSON from code block or anywhere in the text
      let jsonMatch = content.match(/```json\s*([\s\S]*?)```/i) || content.match(/({\s*"mark"[\s\S]*?})/);
      if (jsonMatch) {
        try {
          ({ mark, level } = JSON.parse(jsonMatch[1]));
        } catch (e) {}
      }
      if (mark === undefined || level === undefined) {
        // Try to parse as JSON (if the whole content is JSON)
        try {
          ({ mark, level } = JSON.parse(content));
        } catch (e) {}
      }
      if (mark === undefined || level === undefined) {
        // Fallback: extract from plain text
        const markMatch = content.match(/mark\s*is\s*(\d+)/i);
        const levelMatch = content.match(/level\s*is\s*([1-5][AB]|A[12]|B[12]|C[12])/i);
        if (markMatch) mark = parseInt(markMatch[1], 10);
        if (levelMatch) level = levelMatch[1];
      }
      if (mark === undefined || level === undefined) {
        throw new Error('Could not extract mark and level from LLM response: ' + content);
      }
      // Save the level in StudentType if type is english or german
      if (type && (type.name.toLowerCase() === 'english' || type.name.toLowerCase() === 'german')) {
        // Find the StudentType record for this student and type
        const studentType = await this.studentTypeRepository.findOne({
          where: { studentId, typeId },
        });
        if (studentType) {
          studentType.level = level;
          await this.studentTypeRepository.save(studentType);
        }
      }
      // Ensure level is a valid PlacementLevel enum value (for english), otherwise just save as is
      let levelEnum: string = level;
      if (type && type.name.toLowerCase() === 'english') {
        levelEnum = (Object.values(PlacementLevel) as string[]).includes(level) ? level as PlacementLevel : PlacementLevel['1A'];
      }
      const placementTest = this.placementTestRepository.create({ studentId, mark, level: levelEnum });
      return this.placementTestRepository.save(placementTest);
    } catch (error) {
      console.error('OpenRouter error:', error.response?.data || error.message);
      throw error;
    }
  }
}