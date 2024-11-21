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
const filteredDevResourcesAsync = (sceneNode) => __awaiter(void 0, void 0, void 0, function* () {
    // Matching URLs from codepen.io, jsfiddle.net and lottie.host
    const urlRegex = new RegExp(/https?:\/\/(.+?\.)?((codepen\.io|jsfiddle\.net|lottie\.host|pastebin\.com)(\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?)/);
    const devResources = (yield sceneNode.getDevResourcesAsync({ includeChildren: true })).filter((x) => x.url.match(urlRegex));
    return devResources;
});
const resolveResourceType = (url) => {
    if (url.includes("//codepen.io/")) {
        return "codepen";
    }
    else if (url.includes("//jsfiddle.net/")) {
        return "jsfiddle";
    }
    else if (url.includes("//lottie.host/")) {
        return "lottie";
    }
    else if (url.includes("//pastebin.com/")) {
        return "pastebin";
    }
    else {
        return "unknown";
    }
};
const getEmbedUrlAsync = (selectionIndex) => __awaiter(void 0, void 0, void 0, function* () {
    const unresolvedPromises = figma.currentPage.selection.map(filteredDevResourcesAsync);
    const results = yield Promise.all(unresolvedPromises);
    const devResources = results.flatMap((x) => x.flatMap((y) => {
        return Object.assign({}, y);
    }));
    if (figma.editorType === "dev" && devResources && devResources.length > 0) {
        if (typeof selectionIndex !== "undefined") {
            const url = devResources[selectionIndex].url;
            if (url.includes("//codepen.io/")) {
                const urlSplit = url
                    .substring(url.lastIndexOf("codepen.io/") + 11)
                    .split("/");
                figma.showUI(__uiFiles__.codepen.replace("{{svgIcons}}", __uiFiles__.icons), { themeColors: true });
                figma.ui.postMessage({ slugHash: urlSplit[2], user: urlSplit[1] });
            }
            else if (url.includes("//jsfiddle.net/")) {
                figma.showUI(__uiFiles__.jsfiddle.replace("{{svgIcons}}", __uiFiles__.icons), { themeColors: true });
                figma.ui.postMessage({ url });
            }
            else if (url.includes("//lottie.host/")) {
                figma.showUI(__uiFiles__.lottie.replace("{{svgIcons}}", __uiFiles__.icons), { themeColors: true });
                figma.ui.postMessage({ src: url });
            }
            else if (url.includes("//pastebin.com/")) {
                figma.showUI(__uiFiles__.pastebin.replace("{{svgIcons}}", __uiFiles__.icons), { themeColors: true });
                figma.ui.postMessage({ url });
            }
        }
        else {
            figma.showUI(__uiFiles__.navigation.replace("{{svgIcons}}", __uiFiles__.icons), { themeColors: true });
        }
        figma.ui.postMessage({ devResources });
    }
    else {
        figma.showUI(__uiFiles__.empty.replace("{{svgIcons}}", __uiFiles__.icons), {
            themeColors: true,
        });
    }
});
figma.ui.onmessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.type === "selection_change") {
        yield getEmbedUrlAsync(message.selectionIndex);
    }
    else if (message.type === "home") {
        yield getEmbedUrlAsync();
    }
});
figma.on("selectionchange", () => {
    getEmbedUrlAsync();
});
getEmbedUrlAsync();
