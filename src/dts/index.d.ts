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

export type ContentsGenerate = (tocs: TOC[]) => string;

export type OnProgress = (progress: number) => void;

export type FileDate = File | Blob | Buffer | string;

export type ImageFile = {
  name: string;
  data: FileDate;
};

export type ImagePath = string | { name: string; path: string };

export type EpubImage = ImageFile | ImagePath;

export type EpubFont = string;

export interface Metadata {
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

export interface Section {
  title: string;
  content: string;
  excludeFromContents?: boolean;
  isFrontMatter?: boolean;
  overrideFilename?: string;
}

export interface TOC {
  title: string;
  link: string;
  itemType: string;
}

export interface SubFiLe {
  name: string;
  folder: string;
  compress?: boolean;
  content: FileDate;
}

export interface CustomFile extends SubFiLe {}

export { Epub as default };
