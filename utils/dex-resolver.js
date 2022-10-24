const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');

//script for generate dex images json paths

async function getFilesRelativePath(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);

      return dirent.isDirectory() ? getFilesRelativePath(res) : `/${path.relative(__dirname, res)}`;
    })
  );

  return [...files.flat()];
}

async function convertPng(imagePath, outDirPath) {
  const pngOptions = {
    palette: true,
    compressionLevel: 6, // 0 (fastest, largest) .. 9 (slowest, smallest)
  };

  let buffer = await sharp(imagePath).resize(48, 48).png(pngOptions).toBuffer();

  return sharp(buffer).toFile(path.join(outDirPath));
}

async function main() {
  const result = await getFilesRelativePath(path.join(__dirname, '../public/images/dex'));

  await Promise.all(
    result
      .filter((path) => path.extname === '.png')
      .map((imagePath) => {
        convertPng(path.join(__dirname, imagePath), path.join(__dirname, imagePath));
      })
  );

  const data = result.reduce((acc, cur) => {
    const fileName = path.basename(cur).split('.')[0];

    return { ...acc, [fileName]: cur.replace('../public/', '') };
  }, {});

  fs.writeFile(path.join(__dirname, '../app/resolve-dex-img.json'), JSON.stringify(data, null, 2));
}

try {
  main();
} catch (err) {
  console.error('Failed to write relative DEX file', err);
}
