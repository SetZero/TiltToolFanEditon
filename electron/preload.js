// preload.js


// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");

// As an example, here we use the exposeInMainWorld API to expose the IPC renderer 
// to the main window. They'll be accessible at "window.ipcRenderer".
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);
});

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency]);
    }
});

ipcRenderer.on("tilttool/match/playerinfo", (event, arg) => {
    document.dispatchEvent(new CustomEvent("tilttool/match/playerinfo", { detail: arg }));
});

ipcRenderer.on("tilttool/match/quitchampselect", (event, arg) => {
    document.dispatchEvent(new CustomEvent("tilttool/match/quitchampselect", { detail: undefined }));
});