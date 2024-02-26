const allCodepenDevResources = async (sceneNode: SceneNode) => {
  const urlRegex: RegExp = new RegExp(/(https?:\/\/(.+?\.)?codepen\.io(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/);
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
          const href = `https://codepen.io/${urlSplit[0]}/full/${urlSplit[2]}`;
          figma.showUI(`<script>window.location.href = "${href}";</script>`, { themeColors: true });
        } else {
          
          figma.showUI(`<p style="color: var(--figma-color-text); font-family: sans-serif; padding: 2rem; text-align: center;">No Codepen url found.<br>Please select a different frame or component.</p>`, { themeColors: true });
        }
      }
    }
  }
};

figma.on("selectionchange", () => { getCodepenUrlAsync(); })

getCodepenUrlAsync();