import {
  getFileName,
  getImageFileName,
  isEmptyObj,
  getFolder,
  genUuid,
} from "./utility";
import type {
  Metadata,
  EpubImage,
  ImageFile,
  Section,
  TOC,
  ContentsGenerate,
  ImagePath,
  OnProgress,
} from "./dts";
import { getFilesForEPUB } from "./constituents/subfile";
import fs, { promises as fsPromises } from "fs";
import archiver from "archiver";

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
    this.runtime = "node";
    if (metadata) {
      this.setMeta(metadata);
    }
  }

  private _verify() {
    const required = ["id", "title", "author", "cover"];
    if (isEmptyObj(this.metadata)) {
      throw new Error(
        "Missing metadata, You can use the setMeta function to set it."
      );
    } else {
      const metadata = this.metadata;
      required.forEach((field) => {
        const prop = metadata[field as keyof Metadata];
        if (
          prop == null ||
          typeof prop === "undefined" ||
          prop.toString().trim() === ""
        ) {
          throw new Error(`Missing required metadata: ${field}`);
        }
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
      this.addImagesAll(metadata.images as ImagePath[]);
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

  addImage(image: ImagePath) {
    this.images.push({
      name: getFileName(image),
      data: image,
    });
  }

  addImagesAll(images: ImagePath[]) {
    images.forEach((image: ImagePath) => {
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

  async build(fullPath: string, onprogess?: OnProgress) {
    this._verify();
    const files = getFilesForEPUB(this);
    const folder = getFolder(fullPath);
    let fileName = getFileName(fullPath);
    if (!fileName.endsWith(".epub")) {
      fileName += ".epub";
    }
    await fsPromises.mkdir(folder).catch((err: { code: string }) => {
      if (err && err.code !== "EEXIST") {
        throw err;
      }
    });
    const output = fs.createWriteStream(`${folder}/${fileName}`);
    const zip = archiver("zip", {
      store: false,
    });
    zip.on("error", (archiveErr: Error) => {
      throw archiveErr;
    });
    if (onprogess) {
      zip.on("progress", (progressData) => {
        onprogess((progressData.entries.processed * 100) / files.length);
      });
    }

    await new Promise(async (resolveWrite) => {
      zip.pipe(output);
      output.on("close", () => resolveWrite(true));
      for await (let file of files) {
        if (file.folder === "OEBPF/images") {
          file.content = await fsPromises.readFile(file.content as string);
        }
        const fileFolder =
          file.folder.length > 0 ? `${file.folder}/${file.name}` : file.name;
        zip.append(file.content as string | Buffer, {
          name: fileFolder,
          store: !file.compress,
        });
      }
      // Done.
      zip.finalize();
    });
  }
}
