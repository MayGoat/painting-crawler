"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.insertDB = exports.saveJsonToFile = exports.saveArtWorksToJSON = exports.downloadWikiTable = exports.WikiPage = exports.dataBasePath = void 0;
var cheerio = require("cheerio");
var https_js_1 = require("../utils/https.js");
var artwork_js_1 = require("./artwork.js");
var nedb_1 = require("nedb");
var fs = require("fs");
var path = require("path");
var db = new nedb_1["default"]({ filename: './nedb.db', autoload: true });
exports.dataBasePath = path.join(__dirname, '../../data/');
var filePath = path.join(__dirname, '../../data/data.json');
var WikiPage = /** @class */ (function () {
    function WikiPage() {
    }
    WikiPage.load = function (url) {
        return __awaiter(this, void 0, Promise, function () {
            var wikiPage, response, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wikiPage = new WikiPage();
                        return [4 /*yield*/, https_js_1.axiosAgented.get(url)];
                    case 1:
                        response = _a.sent();
                        html = response.data;
                        wikiPage.$ = cheerio.load(html);
                        return [2 /*return*/, wikiPage];
                }
            });
        });
    };
    //解析wikitable
    WikiPage.prototype.tables = function () {
        var _this = this;
        try {
            var tables = this.$('.wikitable');
            var result_1 = [];
            tables.each(function (tableIndex, table) {
                var tableData = [];
                var rows = _this.$(table).find('tr');
                rows.each(function (rowIndex, row) {
                    var rowData = [];
                    var tdList = _this.$(row).find('td');
                    if (tdList.length <= 1) {
                        return;
                    } //invalid wikitable
                    tdList.each(function (colIndex, td) {
                        var imgTag = _this.$(td).find('img');
                        if (imgTag.length > 0) { //image box
                            var imageBox = _this.extractImageInfo(imgTag, td);
                            rowData.push(imageBox);
                        }
                        else { //pure text
                            rowData.push(_this.$(td).text().trim());
                        }
                    });
                    if (rowData.length > 0) {
                        tableData.push(rowData);
                    }
                });
                if (tableData.length > 0) {
                    result_1.push(tableData);
                }
            });
            return result_1;
        }
        catch (error) {
            console.error('Failed to parse wikitable:', error);
            return [];
        }
    };
    WikiPage.prototype.extractImageInfo = function (imgTag, td) {
        var imageBox = {};
        var imgSrc = imgTag.attr('src');
        if (imgSrc && imgSrc.startsWith('//')) {
            imgSrc = 'https:' + imgSrc;
        }
        imageBox["src"] = imgSrc;
        if (imgTag.parent().is('a')) {
            var imageDetailUrl = imgTag.parent().attr('href');
            imageBox['href'] = imageDetailUrl;
        }
        var figcaption = this.$(td).find('figcaption');
        if (figcaption.length > 0) {
            imageBox['title'] = figcaption.text();
        }
        return imageBox;
    };
    return WikiPage;
}());
exports.WikiPage = WikiPage;
//下载wikitable
function downloadWikiTable(wikipageConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var wikiPage, tables, artworks_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(wikipageConfig.url);
                    return [4 /*yield*/, WikiPage.load(wikipageConfig.url)];
                case 1:
                    wikiPage = _a.sent();
                    try {
                        tables = wikiPage.tables();
                        artworks_1 = [];
                        tables[0].forEach(function (element) {
                            var _a, _b;
                            var artwork = artwork_js_1.createArtWorkFromWikiTable(element, wikipageConfig.config);
                            if (wikipageConfig.museum) {
                                artwork.museumLocation = (_a = wikipageConfig.museum) === null || _a === void 0 ? void 0 : _a.location;
                                artwork.museum = (_b = wikipageConfig.museum) === null || _b === void 0 ? void 0 : _b.name;
                            }
                            artworks_1.push(artwork);
                            console.log(JSON.stringify(artwork));
                        });
                        saveArtWorksToJSON(artworks_1);
                        console.log('Tables found:' + artworks_1.length);
                    }
                    catch (error) {
                        console.error('Error:', error);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.downloadWikiTable = downloadWikiTable;
function saveArtWorksToJSON(artworks) {
    var jsonData = JSON.stringify(artworks, null, 0);
    fs.writeFile(filePath, jsonData, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("JSON file has been saved.");
    });
}
exports.saveArtWorksToJSON = saveArtWorksToJSON;
function saveJsonToFile(jsonString, subPath) {
    // let jsonData = JSON.stringify(json, null, 0);
    var p = path.join(exports.dataBasePath, subPath);
    fs.writeFile(p, jsonString, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("JSON file has been saved.");
    });
}
exports.saveJsonToFile = saveJsonToFile;
function insertDB(artWork) {
    db.insert(artWork, function (err, newDoc) {
        if (err) {
            console.error('Error inserting document:', err);
            return;
        }
        console.log('Inserted', newDoc);
    });
}
exports.insertDB = insertDB;
