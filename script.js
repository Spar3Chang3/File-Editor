const FILE_TYPES = {
  json: ".json",
  toml: ".toml",
  yaml: ".yml",
  txt: ".txt",
  xml: ".xml",
};

const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const fileList = document.getElementById("file-list");
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
  //  file index (index)
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

jsonBtn.addEventListener("click", () => {
  if (jsonEditor.classList.contains("hidden")) {
    jsonEditor.classList.remove("hidden");
  } else {
    jsonEditor.classList.add("hidden");
  }
});

// TODO: add event listeners and logic for hidden/unhidden;

// Handle manual file selection
fileInput.addEventListener("change", () => {
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
  if (selectedFile) {
    const list = fileList.querySelectorAll("li");
    if (list.length > 0) {
      for (const li of list) {
        li.innerHTML += " &#x2713;";
        li.style = "color: green";
      }
    }
    loadEditors();
  } else {
    const list = fileList.querySelector("li");
    list.style =
      "color: lightcoral; transform: scale(1.15); transition: 0.5s ease;";
    setTimeout(() => {
      list.style = "transform: scale(1.0); transition: 0.5s ease;";
    }, 1000);
  }
});

// Utils
function handleFiles(files) {
  if (files.length > 0) {
    fileList.innerHTML = "";
    for (const file of files) {
      const ext = file.name.lastIndexOf(".");
      const fileToStore = {
        name: file.name,
        index: 0,
        elementId: `file-container`,
        file: file,
      };
      const li = document.createElement("li");
      li.innerHTML = file.name;
      fileList.appendChild(li);
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
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (err) => reject(err);

    reader.readAsText(file);
  });
}

function parseToml(tomlData) {
  
}

function parseYaml(yamlData) {}

function parseText(textData) {}

function parseXml(xmlData) {}

function processJsonObject(field, parentContainer, key, fileObj) {
  const childContainer = document.createElement("details");
  const fieldName = document.createElement("summary");

  if (!key) {
    key = `${fileObj.name}`;
    childContainer.open = true; // Open the root element by default
  }
  if (!parentContainer) {
    parentContainer = document.createElement("div");
    parentContainer.id = fileObj.elementId;
    // This is now just a wrapper. The .main-prop-drpdwn handles the padding.
    parentContainer.className = "json-file-container-wrapper";
    jsonEditor.appendChild(parentContainer);

    childContainer.className = "main-prop-drpdwn";
    fieldName.className = "main-prop-sum";
  }
  fieldName.innerHTML = `${key}`;

  childContainer.appendChild(fieldName);

  // --- Case 1: Field is an Object or Array ---
  if (typeof field === "object" && field !== null) {
    // CHANGED: Create the property list that will act as the grid container.
    const propertyList = document.createElement("div");
    propertyList.className = "property-list";
    // CHANGED: Append the grid container to the details element.
    childContainer.appendChild(propertyList);

    if (Array.isArray(field)) {
      fieldName.innerHTML = `[${fieldName.innerHTML}] <small>(click to expand)</small>`;
      fieldName.style = "color: var(--arry-clr); text-decoration: underline;";
      for (let i = 0; i < field.length; i++) {
        const item = field[i];
        // CHANGED: The recursive call now appends to `propertyList`, not `childContainer`.
        processJsonObject(item, propertyList, `Index ${i}`, fileObj);
      }
    } else {
      // It's an object
      fieldName.innerHTML = `{${fieldName.innerHTML}} <small>(click to expand)</small>`;
      fieldName.style = "color: var(--prop-clr); text-decoration: underline;";
      for (const childKey in field) {
        // CHANGED: Added a safety check to ensure the key belongs to the object.
        if (Object.prototype.hasOwnProperty.call(field, childKey)) {
          // CHANGED: The recursive call now also appends to `propertyList`.
          processJsonObject(field[childKey], propertyList, childKey, fileObj);
        }
      }
    }
    parentContainer.appendChild(childContainer);
  }
  // --- Case 2: Field is a Primitive (String, Number, etc.) ---
  else {
    const entry = document.createElement("div");
    entry.className = "json-entry"; // This will have `display: contents`.

    // CHANGED: This is now a LABEL for the property, not a span for the value.
    const labelSpan = document.createElement("span");
    labelSpan.className = "json-entry-label";
    labelSpan.textContent = key; // Use the key for the label.

    const dataInput = document.createElement("input");
    dataInput.className = "json-entry-input";
    dataInput.value = field; // CHANGED: Set the input's value to the field data.

    // Your existing type logic is perfect.
    if (typeof field === "number") {
      dataInput.type = "number";
    } else if (field === null || field === undefined) {
      dataInput.type = "text";
      dataInput.placeholder = String(field); // Show null/undefined as placeholder
    } else {
      dataInput.type = "text";
    }

    // CHANGED: Append the new label and the input.
    entry.append(labelSpan, dataInput);
    parentContainer.appendChild(entry);
  }
}

function loadEditors() {
  jsonBtn.textContent = `JSON (${fileStore.json.length})`;
  tomlBtn.textContent = `TOML (${fileStore.toml.length})`;
  yamlBtn.textContent = `YML (${fileStore.yaml.length})`;
  textBtn.textContent = `TXT (${fileStore.txt.length})`;
  xmlBtn.textContent = `XML (${fileStore.xml.length})`;
  if (fileStore.json.length === 0) {
    jsonBtn.style = "background-color: var(--muted); cursor: not-allowed;";
    jsonBtn.disabled = true;
  }
  if (fileStore.toml.length === 0) {
    tomlBtn.style = "background-color: var(--muted); cursor: not-allowed;";
    tomlBtn.disabled = true;
  }
  if (fileStore.yaml.length === 0) {
    yamlBtn.style = "background-color: var(--muted); cursor: not-allowed;";
    yamlBtn.disabled = true;
  }
  if (fileStore.txt.length === 0) {
    textBtn.style = "background-color: var(--muted); cursor: not-allowed;";
    textBtn.disabled = true;
  }
  if (fileStore.xml.length === 0) {
    xmlBtn.style = "background-color: var(--muted); cursor: not-allowed;";
    xmlBtn.disabled = true;
  }

  for (const fileObj of fileStore.json) {
    readFile(fileObj.file)
      .then((data) => {
        const jsonFields = JSON.parse(data);
        processJsonObject(jsonFields, null, null, fileObj);
      })
      .catch((err) => {
        alert(err);
        console.error(err);
        // TODO: implement better error handling, likely a notification thing
      });
  }
}
