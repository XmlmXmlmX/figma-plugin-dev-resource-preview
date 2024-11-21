const filteredDevResourcesAsync = async (sceneNode: SceneNode) => {
  // Matching URLs from codepen.io, jsfiddle.net and lottie.host
  const urlRegex: RegExp = new RegExp(
    /https?:\/\/(.+?\.)?((codepen\.io|jsfiddle\.net|lottie\.host|pastebin\.com)(\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?)/
  );
  const devResources = (
    await sceneNode.getDevResourcesAsync({ includeChildren: true })
  ).filter((x) => x.url.match(urlRegex));
  return devResources;
};

const resolveResourceType = (url: string) => {
  if (url.includes("//codepen.io/")) {
    return "codepen";
  } else if (url.includes("//jsfiddle.net/")) {
    return "jsfiddle";
  } else if (url.includes("//lottie.host/")) {
    return "lottie";
  } else if (url.includes("//pastebin.com/")) {
    return "pastebin";
  } else {
    return "unknown";
  }
};

const getEmbedUrlAsync = async (selectionIndex?: number) => {
  const unresolvedPromises = figma.currentPage.selection.map(
    filteredDevResourcesAsync
  );
  const results = await Promise.all(unresolvedPromises);
  const devResources = results.flatMap((x) =>
    x.flatMap((y) => {
      return { ...y };
    })
  );

  if (figma.editorType === "dev" && devResources && devResources.length > 0) {
    if (typeof selectionIndex !== "undefined") {
      const url = devResources[selectionIndex].url;

      if (url.includes("//codepen.io/")) {
        const urlSplit = url
          .substring(url.lastIndexOf("codepen.io/") + 11)
          .split("/");
        figma.showUI(
          __uiFiles__.codepen.replace("{{svgIcons}}", __uiFiles__.icons),
          { themeColors: true }
        );
        figma.ui.postMessage({ slugHash: urlSplit[2], user: urlSplit[1] });
      } else if (url.includes("//jsfiddle.net/")) {
        figma.showUI(
          __uiFiles__.jsfiddle.replace("{{svgIcons}}", __uiFiles__.icons),
          { themeColors: true }
        );
        figma.ui.postMessage({ url });
      } else if (url.includes("//lottie.host/")) {
        figma.showUI(
          __uiFiles__.lottie.replace("{{svgIcons}}", __uiFiles__.icons),
          { themeColors: true }
        );
        figma.ui.postMessage({ src: url });
      } else if (url.includes("//pastebin.com/")) {
        figma.showUI(
          __uiFiles__.pastebin.replace("{{svgIcons}}", __uiFiles__.icons),
          { themeColors: true }
        );
        figma.ui.postMessage({ url });
      }
    } else {
      figma.showUI(
        __uiFiles__.navigation.replace("{{svgIcons}}", __uiFiles__.icons),
        { themeColors: true }
      );
    }
    figma.ui.postMessage({ devResources });
  } else {
    figma.showUI(__uiFiles__.empty.replace("{{svgIcons}}", __uiFiles__.icons), {
      themeColors: true,
    });
  }
};

figma.ui.onmessage = async (message) => {
  if (message.type === "selection_change") {
    await getEmbedUrlAsync(message.selectionIndex);
  } else if (message.type === "home") {
    await getEmbedUrlAsync();
  }
};

figma.on("selectionchange", () => {
  getEmbedUrlAsync();
});

getEmbedUrlAsync();
