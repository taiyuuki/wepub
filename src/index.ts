import {
  getFileName,
  getImageFileName,
  isEmptyObj,
  getFolder,
  genUuid,
} from './utility'
import type {
  Metadata,
  EpubImage,
  Section,
  TOC,
  ContentsGenerate,
  ImagePath,
  OnProgress,
  CustomFile,
} from './dts'
import { getFilesForEPUB } from './constituents/subfile'
import fs, { promises as fsPromises } from 'fs'
import archiver from 'archiver'

export default class Wepub {
  metadata: Metadata
  coverImage: EpubImage
  showContents: boolean
  sections: Section[]
  css: string
  filesForTOC: TOC[]
  customFile: CustomFile[]
  images: EpubImage[]
  runtime: string
  _generateContentsCallback: ContentsGenerate | undefined
  constructor(metadata?: Metadata) {
    this.metadata = {} as Metadata
    this.coverImage = {} as EpubImage
    this.showContents = true
    this.sections = []
    this.css = ''
    this.filesForTOC = []
    this.customFile = []
    this.images = []
    this.runtime = 'node'
    if (metadata) {
      this.setMeta(metadata)
    }
  }

  private _verify() {
    const required = ['id', 'title', 'author', 'cover']
    if (isEmptyObj(this.metadata)) {
      throw new Error(
        'Missing metadata, You can use the setMeta function to set it.'
      )
    }
    else {
      const metadata = this.metadata
      required.forEach((field) => {
        const prop = metadata[field as keyof Metadata]
        if (
          prop == null
          || typeof prop === 'undefined'
          || prop.toString().trim() === ''
        ) {
          throw new Error(`Missing required metadata: ${field}`)
        }
      })
    }
  }

  setMeta(metadata: Metadata) {
    Object.assign(this.metadata, metadata)
    this.showContents = metadata.showContents ?? true
    if (metadata.cover) {
      this.addCover(metadata.cover as ImagePath)
    }
    if (metadata.images) {
      this.addImagesAll(metadata.images as ImagePath[])
    }
  }

  addCover(cover: ImagePath) {
    if (typeof cover === 'string') {
      this.coverImage = {
        name: getImageFileName(cover),
        data: cover,
      }
    }
    else {
      this.coverImage = {
        name: cover.name,
        data: cover.path,
      }
    }
  }

  setContents(generateContentsCallback: ContentsGenerate) {
    this._generateContentsCallback = generateContentsCallback
  }

  addImage(image: ImagePath) {
    if (typeof image === 'string') {
      this.images.push({
        name: getFileName(image),
        data: image,
      })
    }
    else {
      this.images.push({
        name: image.name,
        data: image.path,
      })
    }
  }

  addImagesAll(images: ImagePath[]) {
    images.forEach((image: ImagePath) => {
      this.addImage(image)
    })
  }

  addSection(section: Section) {
    let {
      title,
      overrideFilename,
      content,
      isFrontMatter,
      excludeFromContents,
    } = section
    if (
      overrideFilename == null
      || typeof overrideFilename === 'undefined'
      || overrideFilename.toString().trim() === ''
    ) {
      const i = this.sections.length + 1
      overrideFilename = `s${i}`
    }
    overrideFilename = `${overrideFilename}.xhtml`
    this.sections.push({
      title,
      content,
      excludeFromContents: excludeFromContents || false,
      isFrontMatter: isFrontMatter || false,
      overrideFilename,
    })
  }

  addSectionsAll(sections: Section[]) {
    sections.forEach((section) => {
      this.addSection(section)
    })
  }

  addCustomFile(customFile: CustomFile) {
    this.customFile.push(customFile)
  }

  getSectionsCount() {
    return this.sections.length
  }

  addCss(css: string) {
    this.css = css
  }

  genUuid() {
    return genUuid()
  }

  async build(fullPath: string, onprogess?: OnProgress) {
    this._verify()
    const files = getFilesForEPUB(this)
    const folder = getFolder(fullPath)
    let fileName = getFileName(fullPath)
    if (!fileName.endsWith('.epub')) {
      fileName += '.epub'
    }
    await fsPromises.mkdir(folder).catch((err: { code: string }) => {
      if (err && err.code !== 'EEXIST') {
        throw err
      }
    })
    const output = fs.createWriteStream(`${folder}/${fileName}`)
    const zip = archiver('zip', { store: false })
    zip.on('error', (archiveErr: Error) => {
      throw archiveErr
    })
    if (onprogess) {
      zip.on('progress', (progressData) => {
        onprogess((progressData.entries.processed * 100) / files.length)
      })
    }

    zip.pipe(output)
    for await (const file of files) {
      if (file.folder === 'OEBPF/images') {
        file.content = await fsPromises.readFile(file.content as string)
      }
      const fileFolder
        = file.folder.length > 0 ? `${file.folder}/${file.name}` : file.name
      zip.append(file.content as string | Buffer, {
        name: fileFolder,
        store: !file.compress,
      })
    }
    // Done.
    zip.finalize()
  }
}