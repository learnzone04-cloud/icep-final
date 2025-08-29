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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlacementTest = exports.PlacementLevel = void 0;
const typeorm_1 = require("typeorm");
var PlacementLevel;
(function (PlacementLevel) {
    PlacementLevel["1A"] = "1A";
    PlacementLevel["1B"] = "1B";
    PlacementLevel["2A"] = "2A";
    PlacementLevel["2B"] = "2B";
    PlacementLevel["3A"] = "3A";
    PlacementLevel["3B"] = "3B";
    PlacementLevel["4A"] = "4A";
    PlacementLevel["4B"] = "4B";
    PlacementLevel["5A"] = "5A";
    PlacementLevel["5B"] = "5B";
    PlacementLevel["A1"] = "A1";
    PlacementLevel["A2"] = "A2";
    PlacementLevel["B1"] = "B1";
    PlacementLevel["B2"] = "B2";
    PlacementLevel["C1"] = "C1";
    PlacementLevel["C2"] = "C2";
})(PlacementLevel || (exports.PlacementLevel = PlacementLevel = {}));
let PlacementTest = class PlacementTest {
};
exports.PlacementTest = PlacementTest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PlacementTest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PlacementTest.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], PlacementTest.prototype, "mark", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], PlacementTest.prototype, "level", void 0);
exports.PlacementTest = PlacementTest = __decorate([
    (0, typeorm_1.Entity)()
], PlacementTest);
//# sourceMappingURL=placement-test.entity.js.map