"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLessonRescheduleDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_lesson_reschedule_dto_1 = require("./create-lesson-reschedule.dto");
class UpdateLessonRescheduleDto extends (0, mapped_types_1.PartialType)(create_lesson_reschedule_dto_1.CreateLessonRescheduleDto) {
}
exports.UpdateLessonRescheduleDto = UpdateLessonRescheduleDto;
//# sourceMappingURL=update-lesson-reschedule.dto.js.map