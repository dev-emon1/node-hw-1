const fs = require("fs/promises");
const path = require("path");

(async () => {
  const CREATE_BUTTON = "create button";
  const CREATE_LINK = "create link";
  const CREATE_HERO = "create hero";
  const CREATE_NAVBAR = "create navbar";
  const DELETE_FILE = "delete file";
  const DELETE_BUTTON = "delete button";
  const DELETE_HERO = "delete hero";
  const DELETE_NAVBAR = "delete navbar"; // New command for deleting navbar

  const indexPath = "./index.html";

  const initializeHTMLFile = async () => {
    try {
      await fs.access(indexPath);
    } catch (e) {
      const initialContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dynamic HTML Elements</title>
  <style>
    /* General Styles */
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      background-color: #f4f4f9;
    }
    .custom-button {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      margin:10px 0;
      transition: transform 0.3s ease, background-color 0.3s ease;
    }
    .custom-button:hover {
      transform: scale(1.1);
    }
    .custom-button:focus {
      outline: none;
    }

    /* Hero Section */
    .hero {
      width: 100%;
      height: 300px;
      background-color: #333;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 2rem;
      text-align: center;
      margin-bottom: 20px;
    }

    /* Navbar */
    .navbar {
      width: 100%;
      background-color: #333;
      overflow: hidden;
    }
    .navbar a {
      float: left;
      display: block;
      color: white;
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;
    }
    .navbar a:hover {
      background-color: #ddd;
      color: black;
    }
  </style>
</head>
<body>
</body>
</html>`;
      await fs.writeFile(indexPath, initialContent, "utf-8");
    }
  };

  const appendToBody = async (content) => {
    const html = await fs.readFile(indexPath, "utf-8");
    const updatedHTML = html.replace("</body>", `${content}\n</body>`);
    await fs.writeFile(indexPath, updatedHTML, "utf-8");
  };

  const addButton = async (color) => {
    const button = `
<button class="custom-button" style="background-color: ${color}; color: white;">
  Custom Button
</button>`;
    await appendToBody(button);
    console.log(`Button added`);
  };

  const deleteFile = async (filename) => {
    const filePath = path.join(__dirname, filename);
    try {
      await fs.unlink(filePath);
      console.log(`File ${filename} has been deleted.`);
    } catch (err) {
      console.log(`Error deleting file: ${err}`);
    }
  };

  const deleteButton = async () => {
    const html = await fs.readFile(indexPath, "utf-8");
    const start = '<button class="custom-button"';
    const end = "</button>";

    const buttonIndexStart = html.indexOf(start);
    const buttonIndexEnd = html.indexOf(end, buttonIndexStart);

    if (buttonIndexStart !== -1 && buttonIndexEnd !== -1) {
      const updatedHTML =
        html.slice(0, buttonIndexStart) +
        html.slice(buttonIndexEnd + end.length);
      await fs.writeFile(indexPath, updatedHTML, "utf-8");
      console.log("Button has been deleted.");
    } else {
      console.log("No button found to delete.");
    }
  };

  const addHero = async () => {
    const hero = `
<div class="hero">
  Welcome to My Website!
</div>`;
    await appendToBody(hero);
    console.log("Hero section added");
  };

  const deleteHero = async () => {
    const html = await fs.readFile(indexPath, "utf-8");
    const start = '<div class="hero">';
    const end = "</div>";

    const heroIndexStart = html.indexOf(start);
    const heroIndexEnd = html.indexOf(end, heroIndexStart);

    if (heroIndexStart !== -1 && heroIndexEnd !== -1) {
      const updatedHTML =
        html.slice(0, heroIndexStart) + html.slice(heroIndexEnd + end.length);
      await fs.writeFile(indexPath, updatedHTML, "utf-8");
      console.log("Hero section has been deleted.");
    } else {
      console.log("No hero section found to delete.");
    }
  };

  const addNavbar = async () => {
    const navbar = `
<div class="navbar">
  <a href="#home">Home</a>
  <a href="#about">About</a>
  <a href="#services">Services</a>
  <a href="#contact">Contact</a>
</div>`;
    await appendToBody(navbar);
    console.log("Navbar added");
  };

  const deleteNavbar = async () => {
    const html = await fs.readFile(indexPath, "utf-8");

    const navbarStart = '<div class="navbar">';
    const navbarEnd = "</div>";

    const navbarIndexStart = html.indexOf(navbarStart);
    const navbarIndexEnd = html.indexOf(navbarEnd, navbarIndexStart);

    if (navbarIndexStart !== -1 && navbarIndexEnd !== -1) {
      const updatedHTML =
        html.slice(0, navbarIndexStart) +
        html.slice(navbarIndexEnd + navbarEnd.length);
      await fs.writeFile(indexPath, updatedHTML, "utf-8");
      console.log("Navbar has been deleted.");
    } else {
      console.log("No navbar found to delete.");
    }
  };

  // read the files
  const myFileSystem = await fs.open("./command.txt", "r");
  myFileSystem.on("change", async function () {
    let size = (await myFileSystem.stat()).size;
    let buffer = Buffer.alloc(size);
    let offset = 0;
    let length = buffer.byteLength;
    let position = 0;

    await myFileSystem.read(buffer, offset, length, position);

    const command = buffer.toString("utf-8");

    await initializeHTMLFile();

    // all commands
    if (command.startsWith(CREATE_BUTTON)) {
      const color = command.split(" ").slice(2).join(" ") || "#4CAF50";
      await addButton(color);
    } else if (command.startsWith(DELETE_FILE)) {
      const filename = command.split(" ").slice(2).join(" ");
      await deleteFile(filename);
    } else if (command.startsWith(DELETE_BUTTON)) {
      await deleteButton();
    } else if (command.startsWith(CREATE_HERO)) {
      await addHero();
    } else if (command.startsWith(DELETE_HERO)) {
      await deleteHero();
    } else if (command.startsWith(CREATE_NAVBAR)) {
      await addNavbar();
    } else if (command.startsWith(DELETE_NAVBAR)) {
      await deleteNavbar();
    } else {
      console.log("Invalid Command");
    }
  });

  // watcher
  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType == "change") {
      myFileSystem.emit("change");
    }
  }
})();
