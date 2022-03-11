"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 20:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChannelsController = void 0;
const common_1 = __webpack_require__(6);
let ChannelsController = class ChannelsController {
    getAllChannels() { }
    createChannels() { }
    getOneChannel() { }
    getChats(query, param) {
        console.log(query.perPage, query.page);
        console.log(param.id, param.url);
    }
    postChats(data) { }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "getAllChannels", null);
__decorate([
    (0, common_1.Post)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "createChannels", null);
__decorate([
    (0, common_1.Get)(':name'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "getOneChannel", null);
__decorate([
    (0, common_1.Get)(':name/chats'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "getChats", null);
__decorate([
    (0, common_1.Post)(':name/chats'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "postChats", null);
__decorate([
    (0, common_1.Get)(':name/member'),
    __metadata("design:type", Object)
], ChannelsController.prototype, "", void 0);
ChannelsController = __decorate([
    (0, common_1.Controller)('api/workspaces/:url/channels')
], ChannelsController);
exports.ChannelsController = ChannelsController;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("bcab37e2e8d68e9c68a2")
/******/ })();
/******/ 
/******/ }
;