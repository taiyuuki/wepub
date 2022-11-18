import structuralFiles from './structural'
import markupFiles from './markup'
import type { EpubImage, ImageFile, SubFiLe } from '../dts'
import type Epub from '../dts'
import { getImageFileName } from '../utility'

const getFilesForEPUB = (epub: Epub): SubFiLe[] => {
  const files = []
  if (epub.customFile.length > 0) {
    epub.customFile.forEach((subFile) => {
      files.push({
        name: subFile.name,
        folder: subFile.folder,
        compress: subFile.compress ?? true,
        content: subFile.content,
      })
    })
  }
  files.push({
    name: 'mimetype',
    folder: '',
    compress: false,
    content: structuralFiles.getMimetype(),
  })
  files.push({
    name: 'container.xml',
    folder: 'META-INF',
    compress: true,
    content: structuralFiles.getContainer(),
  })
  files.push({
    name: 'ebook.opf',
    folder: 'OEBPF',
    compress: true,
    content: structuralFiles.getOPF(epub),
  })
  files.push({
    name: 'navigation.ncx',
    folder: 'OEBPF',
    compress: true,
    content: structuralFiles.getNCX(epub),
  })
  files.push({
    name: 'cover.xhtml',
    folder: 'OEBPF',
    compress: true,
    content: markupFiles.getCover(epub),
  })
  // css
  files.push({
    name: 'ebook.css',
    folder: 'OEBPF/css',
    compress: true,
    content: markupFiles.getCss(epub),
  })

  // sections
  epub.sections.forEach((section) => {
    files.push({
      name: section.overrideFilename,
      folder: 'OEBPF/content',
      compress: true,
      content: markupFiles.getSection(epub, section),
    })
  })

  // toc
  if (epub.showContents) {
    files.push({
      name: 'toc.xhtml',
      folder: 'OEBPF/content',
      compress: true,
      content: markupFiles.getTOC(epub),
    })
  }

  // images
  const coverFilename = getImageFileName(epub.coverImage)
  const coverData = epub.coverImage as ImageFile
  files.push({
    name: coverFilename,
    folder: 'OEBPF/images',
    compress: true,
    content: coverData.data,
  })
  if (epub.images.length > 0) {
    epub.images.forEach((image: EpubImage) => {
      const imageData = image as ImageFile
      const imageFilename = getImageFileName(image)
      files.push({
        name: imageFilename,
        folder: 'OEBPF/images',
        compress: true,
        content: imageData.data,
      })
    })
  }

  return files
}

export { getFilesForEPUB }