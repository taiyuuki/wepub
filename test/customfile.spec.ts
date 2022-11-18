import { describe, it, expect } from 'vitest'
import structuralFiles from '../src/constituents/structural'
import Epub from '../src/index'
import { getFilesForEPUB } from '../src/constituents/subfile'

describe('sub file', () => {
  const epub = new Epub({
    title: 'test',
    id: 1001,
    cover: 'C:/A/B/C.jpg',
    author: 'wepub',
  })
  epub.addCustomFile({
    name: 'duokan-extension.xml',
    folder: 'META-INF',
    compress: true,
    content: structuralFiles.getDuokanExtension(),
  })
  it('add sub file', () => {
    expect(getFilesForEPUB(epub)).toMatchInlineSnapshot(`
      [
        {
          "compress": true,
          "content": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>
      <duokan-extension version=\\"2.4.0\\">
        <display-options layout=\\"vertical-comic\\"/>
        <writing-options>
          <option name=\\"writing-mode\\">horizontal-tb</option>
          <option name=\\"direction\\">ltr</option>
        </writing-options>
      </duokan-extension>
      ",
          "folder": "META-INF",
          "name": "duokan-extension.xml",
        },
        {
          "compress": false,
          "content": "application/epub+zip",
          "folder": "",
          "name": "mimetype",
        },
        {
          "compress": true,
          "content": "<?xml version='1.0' encoding='UTF-8' ?>
      <container version='1.0' xmlns='urn:oasis:names:tc:opendocument:xmlns:container'>
        <rootfiles>
          <rootfile full-path='OEBPF/ebook.opf' media-type='application/oebps-package+xml'/>
        </rootfiles>
      </container>",
          "folder": "META-INF",
          "name": "container.xml",
        },
        {
          "compress": true,
          "content": "<?xml version='1.0' encoding='utf-8'?>
      <package xmlns='http://www.idpf.org/2007/opf' version='2.0' unique-identifier='duokan-book-id'>
        <metadata xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:opf='http://www.idpf.org/2007/opf'>
          <dc:title>test</dc:title>
          <dc:identifier id='duokan-book-id' opf:scheme='URI'>1001</dc:identifier>
          <dc:language>undefined</dc:language>
          <dc:creator opf:role='aut' opf:file-as='undefined'>wepub</dc:creator>
          <dc:publisher>undefined</dc:publisher>
          <dc:description>undefined</dc:description>
          <dc:coverage></dc:coverage>
          <dc:source>undefined</dc:source>
          <dc:date opf:event='publication'>undefined</dc:date>
          <dc:date opf:event='modification'>2022-11-18</dc:date>
          <dc:rights>undefined</dc:rights>
          <meta name='cover' content='cover-image'/>
        </metadata>
        <manifest>
          <item id='cover-image' media-type='image/jpeg' href='images/C.jpg'/>
          <item id='cover' media-type='application/xhtml+xml' href='cover.xhtml'/>
          <item id='navigation' media-type='application/x-dtbncx+xml' href='navigation.ncx'/>
          <item id='toc' media-type='application/xhtml+xml' href='content/toc.xhtml'/>
          <item id='css' media-type='text/css' href='css/ebook.css'/>
        </manifest>
        <spine toc='navigation'>
          <itemref idref='cover' linear='yes' properties='duokan-page-fullscreen'/>
          <itemref idref='toc'/>
        </spine>
        <guide>
          <reference type='toc' title='Contents' href='content/toc.xhtml'></reference>
        </guide>
      </package>
      ",
          "folder": "OEBPF",
          "name": "ebook.opf",
        },
        {
          "compress": true,
          "content": "<?xml version='1.0' encoding='UTF-8'?>
      <!DOCTYPE ncx PUBLIC '-//NISO//DTD ncx 2005-1//EN' 'http://www.daisy.org/z3986/2005/ncx-2005-1.dtd'>
      <ncx xmlns='http://www.daisy.org/z3986/2005/ncx/'>
      <head>
        <meta name='dtb:uid' content='1001'/>
        <meta name='dtb:depth' content='1'/>
        <meta name='dtb:totalPageCount' content='0'/>
        <meta name='dtb:maxPageNumber' content='0'/>
      </head>
      <docTitle><text>test</text></docTitle>
      <docAuthor><text>wepub</text></docAuthor>
      <navMap>
        <navPoint id='cover' playOrder='1'>
          <navLabel><text>Cover</text></navLabel>
          <content src='cover.xhtml'/>
        </navPoint>
        <navPoint class='toc' id='toc' playOrder='2'>
          <navLabel><text></text></navLabel>
          <content src='content/toc.xhtml'/>
        </navPoint>
      </navMap>
      </ncx>
      ",
          "folder": "OEBPF",
          "name": "navigation.ncx",
        },
        {
          "compress": true,
          "content": "<?xml version='1.0' encoding='UTF-8' ?>
      <!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.1//EN'  'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd'>
      <html xmlns='http://www.w3.org/1999/xhtml' xml:lang='en'>
      <head>
        <title>test</title>
        <style type='text/css'>
          body { margin: 0; padding: 0; text-align: center; }
          .cover { margin: 0; padding: 0; font-size: 1px; }
          img { margin: 0; padding: 0; height: 100%; }
        </style>
      </head>
      <body>
        <div class='cover'><img style='height: 100%;width: 100%;' src='images/C.jpg' alt='Cover' /></div>
      </body>
      </html>
      ",
          "folder": "OEBPF",
          "name": "cover.xhtml",
        },
        {
          "compress": true,
          "content": "",
          "folder": "OEBPF/css",
          "name": "ebook.css",
        },
        {
          "compress": true,
          "content": "<?xml version='1.0' encoding='utf-8'?>
      <!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.1//EN' 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd' >
      <html xmlns='http://www.w3.org/1999/xhtml'>
        <head>
          <title></title>
          <link rel='stylesheet' type='text/css' href='../css/ebook.css' />
        </head>
        <body>
          <div class='contents'>
            <h1></h1>
          </div>
        </body>
      </html>
      ",
          "folder": "OEBPF/content",
          "name": "toc.xhtml",
        },
        {
          "compress": true,
          "content": "C:/A/B/C.jpg",
          "folder": "OEBPF/images",
          "name": "C.jpg",
        },
      ]
    `)
  })
})