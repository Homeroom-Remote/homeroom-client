const { contextBridge } = require("electron");
const { readFileSync } = require("fs");
const { join } = require("path");

const { ipcRenderer } = require("electron");

const desktopCapturer = {
  getSources: (opts) =>
    ipcRenderer.invoke("DESKTOP_CAPTURER_GET_SOURCES", opts),
};

// inject renderer.js into the web page
window.addEventListener("DOMContentLoaded", () => {
  const rendererScript = document.createElement("script");
  rendererScript.text = readFileSync(join(__dirname, "renderer.js"), "utf8");
  document.body.appendChild(rendererScript);
});

contextBridge.exposeInMainWorld("myCustomGetDisplayMedia", async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sources = await desktopCapturer.getSources({
        types: ["screen", "window"],
      });

      const selectionElem = document.createElement("div");
      selectionElem.classList = "desktop-capturer-selection";
      selectionElem.innerHTML = `
        <div class="desktop-capturer-selection__scroller">
          <span class="desktop-capturer-close">x</span>
          <ul class="desktop-capturer-selection__list">
            ${sources
              .map(
                ({ id, name, thumbnail, display_id, appIcon }) => `
              <li class="desktop-capturer-selection__item">
                <button class="desktop-capturer-selection__btn" data-id="${id}" title="${name}">
                  <img class="desktop-capturer-selection__thumbnail" src="${thumbnail.toDataURL()}" />
                  <span class="desktop-capturer-selection__name">${name}</span>
                </button>
              </li>
            `
              )
              .join("")}
          </ul>
        </div>
      `;
      document.body.appendChild(selectionElem);

      const removeSelectionElement = () => selectionElem.remove();

      document
        .querySelector(".desktop-capturer-close")
        .addEventListener("click", removeSelectionElement);
      document
        .querySelectorAll(".desktop-capturer-selection__btn")
        .forEach((button) => {
          button.addEventListener("click", async () => {
            removeSelectionElement();
            const id = button.getAttribute("data-id");
            resolve(id);
          });
        });
    } catch (err) {
      reject("Error displaying desktop capture sources:", err);
    }
  });
});
