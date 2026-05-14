const Imagekit = require("@imagekit/nodejs/index.js").default;
const { toFile } = require("@imagekit/nodejs/index.js");



const client = new Imagekit({
  privateKey:process.env.IMAGE_KIT_KEY
});


async function uploadFile({buffer,filename,fileName,folder=""}){
  const rawName = fileName ?? filename;
  const resolvedFileName = typeof rawName === "string" ? rawName.trim() : "";

  if (!resolvedFileName) {
    throw new Error("filename is required for uploadFile");
  }

  const file = await client.files.upload({
    file: await toFile(Buffer.from(buffer), resolvedFileName),
    fileName: resolvedFileName,
    folder
  })
  return file;
}

module.exports = {uploadFile};
