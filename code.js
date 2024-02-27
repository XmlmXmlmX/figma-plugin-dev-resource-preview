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
const allCodepenDevResources = (sceneNode) => __awaiter(void 0, void 0, void 0, function* () {
    const urlRegex = new RegExp(/(https?:\/\/(.+?\.)?codepen\.io(\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?)/);
    const devResources = (yield sceneNode.getDevResourcesAsync({ includeChildren: true })).filter(x => x.url.match(urlRegex));
    return devResources;
});
const getCodepenUrlAsync = () => __awaiter(void 0, void 0, void 0, function* () {
    const unresolvedPromises = figma.currentPage.selection.map(allCodepenDevResources);
    const results = yield Promise.all(unresolvedPromises);
    const src = results[0][0];
    if (figma.editorType === "dev") {
        switch (figma.mode) {
            default: {
                if (src) {
                    const urlSplit = src.url.substring(src.url.lastIndexOf('codepen.io/') + 11).split('/');
                    figma.showUI(__uiFiles__.codepen, { themeColors: true });
                    figma.ui.postMessage({ slugHash: urlSplit[2], user: urlSplit[1] });
                }
                else {
                    figma.showUI(__uiFiles__.empty, { themeColors: true });
                }
            }
        }
    }
});
figma.on("selectionchange", () => { getCodepenUrlAsync(); });
getCodepenUrlAsync();
