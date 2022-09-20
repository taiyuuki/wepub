import { getImageFileName, isEmptyObj, genUuid } from "./utility";
import structuralFiles from "./constituents/structural";
import type {
  Metadata,
  EpubImage,
  ImageFile,
  Section,
  TOC,
  ContentsGenerate,
  SubFiLe,
  OnProgress,
} from "./dts";
import { getFilesForEPUB } from "./constituents/subfile";
import FileSaver from "file-saver";
import JSZip from "jszip";

function base64ToBlob(base64: string, mimeType?: string) {
  const arr = base64.split(",");
  mimeType = mimeType ?? arr[0].match(/:(.*?);/)?.[1];
  if (!mimeType) {
    throw new Error(
      "TypeError: image data should be a Blob/File or base64 dataURI"
    );
  }
  let baseStr = "";
  try {
    baseStr = atob(arr[1]);
  } catch (e) {
    throw new Error(
      "TypeError: image data should be a Blob/File or base64 dataURI"
    );
  }
  let len = baseStr.length;
  let u8arr = new Uint8Array(len);
  while (len--) {
    u8arr[len] = baseStr.charCodeAt(len);
  }
  return new Blob([u8arr], { type: mimeType });
}

export default class Wepub {
  metadata: Metadata;
  generateContentsCallback: ContentsGenerate | undefined;
  coverImage: EpubImage;
  showContents: boolean;
  sections: Section[];
  css: string;
  filesForTOC: TOC[];
  images: EpubImage[];
  runtime: string;
  constructor(metadata?: Metadata) {
    this.metadata = {} as Metadata;
    this.coverImage = {} as ImageFile;
    this.showContents = true;
    this.sections = [];
    this.css = "";
    this.filesForTOC = [];
    this.images = [];
    this.runtime = "browser";
    if (metadata) {
      this.setMeta(metadata);
    }
  }

  private _verify() {
    const required = ["id", "title", "author", "cover"];
    if (isEmptyObj(this.metadata)) {
      throw new Error(
        "Missing metadata, You can use the setMeta function to set it"
      );
    } else {
      const metadata = this.metadata;
      required.forEach((field) => {
        const prop = metadata[field as keyof Metadata];
        if (
          prop == null ||
          typeof prop === "undefined" ||
          prop.toString().trim() === ""
        )
          throw new Error(`Missing required metadata: ${field}`);
      });
    }
  }

  setMeta(metadata: Metadata) {
    Object.assign(this.metadata, metadata);
    Object.assign(this.showContents, metadata.showContents);
    if (metadata.cover) {
      this.addCover(metadata.cover);
    }
    if (metadata.images) {
      this.addImagesAll(metadata.images as ImageFile[]);
    }
  }

  addCover(cover: EpubImage) {
    if (typeof cover === "string") {
      this.coverImage = {
        name: getImageFileName(cover),
        data: cover,
      };
    } else {
      this.coverImage = cover;
    }
  }

  setContents(generateContentsCallback: ContentsGenerate) {
    this.generateContentsCallback = generateContentsCallback;
  }

  addImage(image: ImageFile) {
    if (typeof image.data === "string") {
      image.data = base64ToBlob(image.data);
      this.images.push(image);
    } else {
      this.images.push(image);
    }
  }

  addImagesAll(images: ImageFile[]) {
    images.forEach((image: ImageFile) => {
      this.addImage(image);
    });
  }

  addSection(section: Section) {
    let {
      title,
      overrideFilename,
      content,
      isFrontMatter,
      excludeFromContents,
    } = section;
    if (
      overrideFilename == null ||
      typeof overrideFilename === "undefined" ||
      overrideFilename.toString().trim() === ""
    ) {
      const i = this.sections.length + 1;
      overrideFilename = `s${i}`;
    }
    overrideFilename = `${overrideFilename}.xhtml`;
    this.sections.push({
      title,
      content,
      excludeFromContents: excludeFromContents || false,
      isFrontMatter: isFrontMatter || false,
      overrideFilename,
    });
  }

  addSectionsAll(sections: Section[]) {
    sections.forEach((section) => {
      this.addSection(section);
    });
  }

  getSectionsCount() {
    return this.sections.length;
  }

  addCss(css: string) {
    this.css = css;
  }

  genUuid() {
    return genUuid();
  }

  async build(filename: string, onprogess?: OnProgress) {
    this._verify();
    const zip = new JSZip();
    const files = getFilesForEPUB(this);
    files.forEach((file: SubFiLe) => {
      const path =
        file.folder.length > 0 ? `${file.folder}/${file.name}` : file.name;
      zip.file(path, file.content, {
        compression: file.compress ? "DEFLATE" : "STORE",
      });
    });
    const content = await zip.generateAsync(
      { type: "blob", mimeType: structuralFiles.getMimetype() },
      (meta) => {
        if (onprogess) onprogess(meta.percent);
      }
    );
    FileSaver(
      content,
      filename.endsWith(".epub") ? filename : `${filename}.epub`
    );
  }
}
