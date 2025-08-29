"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFollowerDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_follower_dto_1 = require("./create-follower.dto");
class UpdateFollowerDto extends (0, mapped_types_1.PartialType)(create_follower_dto_1.CreateFollowerDto) {
}
exports.UpdateFollowerDto = UpdateFollowerDto;
//# sourceMappingURL=update-follower.dto.js.map