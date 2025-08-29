"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewWordModule = void 0;
const common_1 = require("@nestjs/common");
const new_word_service_1 = require("./new-word.service");
const new_word_controller_1 = require("./new-word.controller");
const typeorm_1 = require("@nestjs/typeorm");
const NewWord_1 = require("./entity/NewWord");
const student_module_1 = require("../student/student.module");
let NewWordModule = class NewWordModule {
};
exports.NewWordModule = NewWordModule;
exports.NewWordModule = NewWordModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([NewWord_1.NewWord]), student_module_1.StudentModule],
        providers: [new_word_service_1.NewWordService],
        controllers: [new_word_controller_1.NewWordController],
    })
], NewWordModule);
//# sourceMappingURL=new-word.module.js.map