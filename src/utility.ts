import { EpubImage } from "./dts";

const getSpiltPosition = (path: string): number => {
  const pos1 = path.lastIndexOf("/");
  const pos2 = path.lastIndexOf("\\");
  const pos = Math.max(pos1, pos2);
  return pos;
};

export const getFileName = function (path: string): string {
  const pos = getSpiltPosition(path);
  if (pos < 0) return path;
  else return path.substring(pos + 1);
};

export const getFolder = function (path: string): string {
  const pos = getSpiltPosition(path);
  return path.substring(0, pos);
};

export const getImageFileName = function (image: EpubImage): string {
  if (typeof image === "string") {
    return getFileName(image);
  } else {
    return getFileName(image.name);
  }
};

// image mimetype
export const getImageType = (filename: string) => {
  const imageExt = filename.substring(filename.lastIndexOf("."));
  let imageType = "";
  imageType = imageExt === ".svg" ? "image/svg+xml" : imageType;
  imageType = imageExt === ".png" ? "image/png" : imageType;
  imageType =
    imageExt === ".jpg" || imageExt === ".jpeg" ? "image/jpeg" : imageType;
  imageType = imageExt === ".gif" ? "image/gif" : imageType;
  imageType =
    imageExt === ".tif" || imageExt === ".tiff" ? "image/tiff" : imageType;
  return imageType;
};

// uuid
function getRandom(digit: number) {
  let result = "";
  for (let i = 1; i <= digit; i++) {
    result += Math.floor(Math.random() * 16).toString(16);
  }
  return result;
}
export const genUuid = (): string => {
  let uuid = "";
  if (typeof Blob !== "undefined") {
    const url_uuid = URL.createObjectURL(new Blob());
    uuid = url_uuid.toString().substring(url_uuid.lastIndexOf("/") + 1);
    URL.revokeObjectURL(url_uuid);
  } else {
    uuid = `${getRandom(8)}-${getRandom(4)}-${getRandom(4)}-${getRandom(
      4
    )}-${getRandom(12)}`;
  }
  return uuid;
};

export const isEmptyObj = (obj: object) => {
  return Object.keys(obj).length === 0;
};
