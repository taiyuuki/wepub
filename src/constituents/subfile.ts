import structuralFiles from "./structural";
import markupFiles from "./markup";
import type { EpubImage, ImageFile, SubFiLe } from "../dts";
import type Epub from "../dts";
import { getImageFileName } from "src/utility";

const getFilesForEPUB = (epub: Epub): SubFiLe[] => {
  const files = [];
  files.push({
    name: "mimetype",
    folder: "",
    compress: false,
    content: structuralFiles.getMimetype(),
  });
  files.push({
    name: "container.xml",
    folder: "META-INF",
    compress: true,
    content: structuralFiles.getContainer(),
  });
  files.push({
    name: "duokan-extension.xml",
    folder: "META-INF",
    compress: true,
    content: structuralFiles.getDuokanExtension(),
  });
  files.push({
    name: "ebook.opf",
    folder: "OEBPF",
    compress: true,
    content: structuralFiles.getOPF(epub),
  });
  files.push({
    name: "navigation.ncx",
    folder: "OEBPF",
    compress: true,
    content: structuralFiles.getNCX(epub),
  });
  files.push({
    name: "cover.xhtml",
    folder: "OEBPF",
    compress: true,
    content: markupFiles.getCover(epub),
  });
  // css
  files.push({
    name: "ebook.css",
    folder: "OEBPF/css",
    compress: true,
    content: markupFiles.getCss(epub),
  });

  // sections
  for (let i = 1; i <= epub.sections.length; i += 1) {
    const fname = epub.sections[i - 1].overrideFilename;
    files.push({
      name: `${fname}`,
      folder: "OEBPF/content",
      compress: true,
      content: markupFiles.getSection(epub, i),
    });
  }

  // toc
  if (epub.showContents) {
    files.push({
      name: "toc.xhtml",
      folder: "OEBPF/content",
      compress: true,
      content: markupFiles.getTOC(epub),
    });
  }

  // images
  const coverFilename = getImageFileName(epub.coverImage);
  const coverData = epub.coverImage as ImageFile;
  files.push({
    name: coverFilename,
    folder: "OEBPF/images",
    compress: true,
    content: coverData.data,
  });
  if (epub.images.length > 0) {
    epub.images.forEach((image: EpubImage) => {
      const imageData = image as ImageFile;
      const imageFilename = getImageFileName(image);
      files.push({
        name: imageFilename,
        folder: "OEBPF/images",
        compress: true,
        content: imageData.data,
      });
    });
  }

  return files;
};

export { getFilesForEPUB };
