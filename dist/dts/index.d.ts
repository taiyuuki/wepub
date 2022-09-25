declare class Epub {
  constructor(metadata?: Metadata, generateContentsCallback?: ContentsGenerate);
  metadata: Metadata;
  coverImage: EpubImage;
  filesForTOC: TOC[];
  customFile: CustomFile[];
  showContents: boolean;
  sections: Section[];
  css: string;
  images: EpubImage[];
  runtime: string;
  _generateContentsCallback: ContentsGenerate | undefined;

  setMeta(metadata: Metadata): void;
  setContents(generateContentsCallback: ContentsGenerate): void;
  addCover(cover: EpubImage): void;
  addSection(section: Section): void;
  addSectionsAll(sections: Section[]): void;
  addCustomFile(subFile: CustomFile): void;
  getSectionsCount(): number;
  addCss(css: string): void;
  addImage(image: EpubImage): void;
  addImagesAll(images: EpubImage[]): void;
  build(filenames: string, onprogess?: OnProgress): Promise<void>;
  genUuid(): string;
}

type ContentsGenerate = (tocs: TOC[]) => string;

type OnProgress = (progress: number) => void;

type FileDate = File | Blob | Buffer | string;

type ImageFile = {
  name: string;
  data: FileDate;
};

type ImagePath = string;

type EpubImage = ImageFile | ImagePath;

type EpubFont = string;

interface Metadata {
  id: number | string;
  cover: EpubImage;
  title: string;
  author: string;
  images?: EpubImage[];
  series?: string;
  sequence?: number | string;
  fileAs?: string;
  genre?: string;
  tags?: string;
  copyright?: string;
  publisher?: string;
  published?: string;
  language?: string;
  description?: string;
  showContents?: boolean;
  contents?: string;
  source?: string;
  maker?: string;
}

interface Section {
  title: string;
  content: string;
  excludeFromContents?: boolean;
  isFrontMatter?: boolean;
  overrideFilename?: string;
}

interface TOC {
  title: string;
  link: string;
  itemType: string;
}

interface SubFiLe {
  name: string;
  folder: string;
  compress?: boolean;
  content: FileDate;
}

interface CustomFile extends SubFiLe {}

export { ContentsGenerate, CustomFile, EpubFont, EpubImage, FileDate, ImageFile, ImagePath, Metadata, OnProgress, Section, SubFiLe, TOC, Epub as default };
