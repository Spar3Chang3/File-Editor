const FILE_TYPES = {
  json: ".json",
  toml: ".toml",
  yaml: ".yml",
  txt: ".txt",
  xml: ".xml",
};

const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const output = document.getElementById("output");
const dropZone = document.getElementById("dropZone");

const jsonBtn = document.getElementById("json-switch-btn");
const tomlBtn = document.getElementById("toml-switch-btn");
const yamlBtn = document.getElementById("yaml-switch-btn");
const textBtn = document.getElementById("text-switch-btn");
const xmlBtn = document.getElementById("xml-switch-btn");

const jsonEditor = document.getElementById("json-editor-container");
const tomlEditor = document.getElementById("toml-editor-container");
const yamlEditor = document.getElementById("yaml-editor-container");
const textEditor = document.getElementById("text-editor-container");
const xmlEditor = document.getElementById("xml-editor-container");

let selectedFile = false;
let fileStore = {
  // "filetype": [
  // {
  //  file name (name)
  //  file index (inex)
  //  element id (elementId)
  //  file (file)
  // }
  // ]
  json: [],
  toml: [],
  yaml: [],
  txt: [],
  xml: [],
};

// Handle manual file selection
fileInput.addEventListener("change", () => {
  console.log(fileInput.files);
  handleFiles(fileInput.files);
});

// Drag & drop events
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  handleFiles(e.dataTransfer.files);
});

// Upload button logic
uploadBtn.addEventListener("click", () => {
  // if (!selectedFile) {
  //   output.textContent = "Please select or drop a JSON file.";
  //   return;
  // }
  console.log(fileStore);
  loadEditors();
});

// Utils
function handleFiles(files) {
  if (files.length > 0) {
    for (const file of files) {
      const ext = file.name.lastIndexOf(".");
      console.log(ext);
      const fileToStore = {
        name: file.name,
        index: 0,
        elementId: "",
        file: file,
      };
      switch (file.name.substring(ext)) {
        case FILE_TYPES.json:
          fileToStore.index = fileStore.json.length;
          fileToStore.elementId = `json-file-${fileToStore.index}`;
          fileStore.json.push(fileToStore);
          break;
        case FILE_TYPES.toml:
          fileToStore.index = fileStore.toml.length;
          fileToStore.elementId = `toml-file-${fileToStore.index}`;
          fileStore.toml.push(fileToStore);
          break;
        case FILE_TYPES.yaml:
          fileToStore.index = fileStore.yaml.length;
          fileToStore.elementId = `yaml-file-${fileToStore.index}`;
          fileStore.yaml.push(fileToStore);
          break;
        case FILE_TYPES.txt:
          fileToStore.index = fileStore.txt.length;
          fileToStore.elementId = `txt-file-${fileToStore.index}`;
          fileStore.txt.push(fileToStore);
          break;
        case FILE_TYPES.xml:
          fileToStore.index = fileStore.xml.length;
          fileToStore.elementId = `xml-file-${fileToStore.index}`;
          fileStore.xml.push(fileToStore);
          break;
        default:
          console.error(`Could not identify file type for ${file.name}!`);
      }
    }
    selectedFile = true;
  }
}

function readFile(file) {
  console.log(file);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (err) => reject(err);

    reader.readAsText(file);
  });
}

function parseToml(tomlData) {}

function parseYaml(yamlData) {}

function parseText(textData) {}

function parseXml(xmlData) {}

function processJsonObject(field, parentContainer, key) {
  if (!key) {
    key = "[data]";
  }
  if (!parentContainer) {
    parentContainer = document.createElement("div");
    jsonEditor.appendChild(parentContainer);
  }
  const childContainer = document.createElement("details");
  const fieldName = document.createElement("summary");
  fieldName.textContent = `${key}`;

  childContainer.appendChild(fieldName);

  if (typeof field === "object" && data !== null) {
    if (Array.isArray(field)) {
      fieldName.textContent += `[Array, ${field.length} items]`;
      for (const [item, index] of field) {
        processJsonObject(item, childContainer, `Index ${index}`);
      }
    } else {
      fieldName.textContent += `[Object]`;
      for (const childKey of Object.keys(field)) {
        processJsonObject(field[childKey], childContainer, childKey);
      }
    }
    parentContainer.appendChild(childContainer);
  } else {
    const entry = document.createElement("div");
    entry.className = "json-entry";
    const valueSpan = document.createElement("span");
    const dataInput = document.createElement("input");

    valueSpan.textContent = String(field);
    if (typeof field === "number") {
      dataInput.type = "number";
    } else if (field === null || field === undefined) {
      dataInput.type = "text";
    } else {
      dataInput.type = "text";
    }
    entry.append(valueSpan, dataInput);
    parentContainer.appendChild(entry);
  }
}

function loadEditors() {
  for (const fileObj of fileStore.json) {
    readFile(fileObj.file)
      .then((data) => {
        const jsonFields = JSON.parse(data);
        processJsonObject(jsonFields);
      })
      .catch((err) => {
        alert(err);
        // TODO: implement better error handling, likely a notification thing
      });
  }
}
