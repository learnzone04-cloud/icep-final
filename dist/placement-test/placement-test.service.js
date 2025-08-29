"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlacementTestService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const placement_test_entity_1 = require("./placement-test.entity");
const Type_1 = require("../types/entity/Type");
const StudentType_1 = require("../student-type/entity/StudentType");
let PlacementTestService = class PlacementTestService {
    constructor(placementTestRepository, typeRepository, studentTypeRepository, httpService, configService) {
        this.placementTestRepository = placementTestRepository;
        this.typeRepository = typeRepository;
        this.studentTypeRepository = studentTypeRepository;
        this.httpService = httpService;
        this.configService = configService;
    }
    async generateQuestions(typeId) {
        let prompt;
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
        }
        else if (type && type.name.toLowerCase() === 'german') {
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
        }
        else {
            prompt = 'Build a general placement test.';
        }
        const apiKey = this.configService.get('OPENROUTER_API_KEY');
        console.log('OpenRouter API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
        try {
            const response = await this.httpService.post('https://openrouter.ai/api/v1/chat/completions', JSON.stringify({
                model: 'deepseek/deepseek-r1-0528:free',
                messages: [
                    { role: 'user', content: prompt }
                ]
            }), {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': process.env.FRONTEND_BASE_URL || 'https://icep2-production.up.railway.app',
                    'X-Title': 'ICEP Placement Test',
                },
            }).toPromise();
            return response.data;
        }
        catch (error) {
            console.error('OpenRouter error:', error.response?.data || error.message);
            throw error;
        }
    }
    async evaluateAnswers(studentId, answers, test, typeId) {
        const type = await this.typeRepository.findOneBy({ id: typeId });
        let prompt;
        if (type && type.name.toLowerCase() === 'english') {
            prompt = `Here is the placement test: ${JSON.stringify(test)}\nHere are the student's answers: ${JSON.stringify(answers)}. Based on the correct answers in the test, tell me the mark and the level (choose from 1A, 1B, 2A, 2B, 3A, 3B, 4A, 4B, 5A, 5B). Respond in JSON: {\"mark\": number, \"level\": string}`;
        }
        else if (type && type.name.toLowerCase() === 'german') {
            prompt = `Here is the placement test: ${JSON.stringify(test)}\nHere are the student's answers: ${JSON.stringify(answers)}. Based on the correct answers in the test, tell me the mark and the level (choose from 1A, A2, B1, B2, C1, C2). Respond in JSON: {\"mark\": number, \"level\": string};`;
        }
        else {
            prompt = 'Evaluate the answers and provide a mark.';
        }
        const apiKey = this.configService.get('OPENROUTER_API_KEY');
        console.log('OpenRouter API Key (evaluate):', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
        try {
            const response = await this.httpService.post('https://openrouter.ai/api/v1/chat/completions', {
                model: 'deepseek/deepseek-r1-0528:free',
                messages: [
                    { role: 'user', content: prompt }
                ]
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': process.env.FRONTEND_BASE_URL || 'https://icep2-production.up.railway.app',
                    'X-Title': 'ICEP Placement Test',
                },
            }).toPromise();
            let mark;
            let level;
            const content = response.data.choices[0].message.content;
            let jsonMatch = content.match(/```json\s*([\s\S]*?)```/i) || content.match(/({\s*"mark"[\s\S]*?})/);
            if (jsonMatch) {
                try {
                    ({ mark, level } = JSON.parse(jsonMatch[1]));
                }
                catch (e) { }
            }
            if (mark === undefined || level === undefined) {
                try {
                    ({ mark, level } = JSON.parse(content));
                }
                catch (e) { }
            }
            if (mark === undefined || level === undefined) {
                const markMatch = content.match(/mark\s*is\s*(\d+)/i);
                const levelMatch = content.match(/level\s*is\s*([1-5][AB]|A[12]|B[12]|C[12])/i);
                if (markMatch)
                    mark = parseInt(markMatch[1], 10);
                if (levelMatch)
                    level = levelMatch[1];
            }
            if (mark === undefined || level === undefined) {
                throw new Error('Could not extract mark and level from LLM response: ' + content);
            }
            if (type && (type.name.toLowerCase() === 'english' || type.name.toLowerCase() === 'german')) {
                const studentType = await this.studentTypeRepository.findOne({
                    where: { studentId, typeId },
                });
                if (studentType) {
                    studentType.level = level;
                    await this.studentTypeRepository.save(studentType);
                }
            }
            let levelEnum = level;
            if (type && type.name.toLowerCase() === 'english') {
                levelEnum = Object.values(placement_test_entity_1.PlacementLevel).includes(level) ? level : placement_test_entity_1.PlacementLevel['1A'];
            }
            const placementTest = this.placementTestRepository.create({ studentId, mark, level: levelEnum });
            return this.placementTestRepository.save(placementTest);
        }
        catch (error) {
            console.error('OpenRouter error:', error.response?.data || error.message);
            throw error;
        }
    }
};
exports.PlacementTestService = PlacementTestService;
exports.PlacementTestService = PlacementTestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(placement_test_entity_1.PlacementTest)),
    __param(1, (0, typeorm_1.InjectRepository)(Type_1.TypeEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(StudentType_1.StudentType)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        axios_1.HttpService,
        config_1.ConfigService])
], PlacementTestService);
//# sourceMappingURL=placement-test.service.js.map