// const fs = require("fs");
// const path = require("path");
import fs from "fs";
import path from "path";

function generateRandomFile(filePath, size) {
  const stream = fs.createWriteStream(filePath);
  const chunkSize = 1024 * 1024; // 1MB
  let written = 0;

  function writeChunk() {
    while (written < size) {
      const remaining = size - written;
      const buffer = Buffer.alloc(Math.min(chunkSize, remaining));
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = Math.floor(Math.random() * 256);
      }
      if (!stream.write(buffer)) {
        stream.once("drain", writeChunk);
        return;
      }
      written += buffer.length;
    }
    stream.end();
  }

  writeChunk();
}

const [, , filePath, sizeStr] = process.argv;
if (!filePath || !sizeStr) {
  console.log("用法: node generate-file.js <文件名> <字节数>");
  process.exit(1);
}

const size = parseInt(sizeStr, 10);
if (isNaN(size) || size <= 0) {
  console.log("请输入有效的文件大小（字节）");
  process.exit(1);
}

generateRandomFile(filePath, size);
console.log(`正在生成文件 ${filePath}，大小 ${size} 字节...`);
