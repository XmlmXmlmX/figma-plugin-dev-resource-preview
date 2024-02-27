const allCodepenDevResources = async (sceneNode: SceneNode) => {
  const urlRegex: RegExp = new RegExp(/(https?:\/\/(.+?\.)?codepen\.io(\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?)/);
  const devResources = (await sceneNode.getDevResourcesAsync({includeChildren: true})).filter(x => x.url.match(urlRegex));
  return devResources;
};

const getCodepenUrlAsync = async() => {
  const unresolvedPromises = figma.currentPage.selection.map(allCodepenDevResources);
  const results = await Promise.all(unresolvedPromises);
  const src = results[0][0];

  if (figma.editorType === "dev") {
    switch (figma.mode) {
      default: {
        if (src) {
          const urlSplit = src.url.substring(src.url.lastIndexOf('codepen.io/') + 11).split('/')
          figma.showUI(__uiFiles__.codepen, { themeColors: true });
          figma.ui.postMessage({ slugHash: urlSplit[2], user: urlSplit[1] });
        } else {
          figma.showUI(__uiFiles__.empty, { themeColors: true });
        }
      }
    }
  }
};

figma.on("selectionchange", () => { getCodepenUrlAsync(); })

getCodepenUrlAsync();
