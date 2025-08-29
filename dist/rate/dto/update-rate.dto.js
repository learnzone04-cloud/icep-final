"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRateDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_rate_dto_1 = require("./create-rate.dto");
class UpdateRateDto extends (0, mapped_types_1.PartialType)(create_rate_dto_1.CreateRateDto) {
}
exports.UpdateRateDto = UpdateRateDto;
//# sourceMappingURL=update-rate.dto.js.map