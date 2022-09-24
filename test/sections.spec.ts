import Epub from "../src/index";
import { describe, it, expect } from "vitest";
import { getFilesForEPUB } from "../src/constituents/subfile";

describe("sections", () => {
  const epub = new Epub({
    title: "test",
    id: 1001,
    cover: "C:/A/B/C.jpg",
    author: "wepub",
  });
  epub.addSection({
    title: "prologue",
    content: "<h1>prologue</h1><p>...</p>",
    isFrontMatter: true,
    overrideFilename: "prologue",
  });
  epub.addSection({
    title: "Chapter One",
    content: "<h1>Chapter One</h1><p>...</p>",
    overrideFilename: "chapter-01",
  });
  epub.addSection({
    title: "Chapter Two",
    content: "<h1>Chapter Two</h1><p>...</p>",
  });
  it("add sections", () => {
    expect(epub.sections).toMatchInlineSnapshot(`
      [
        {
          "content": "<h1>prologue</h1><p>...</p>",
          "excludeFromContents": false,
          "isFrontMatter": true,
          "overrideFilename": "prologue.xhtml",
          "title": "prologue",
        },
        {
          "content": "<h1>Chapter One</h1><p>...</p>",
          "excludeFromContents": false,
          "isFrontMatter": false,
          "overrideFilename": "chapter-01.xhtml",
          "title": "Chapter One",
        },
        {
          "content": "<h1>Chapter Two</h1><p>...</p>",
          "excludeFromContents": false,
          "isFrontMatter": false,
          "overrideFilename": "s3.xhtml",
          "title": "Chapter Two",
        },
      ]
    `);
    expect(getFilesForEPUB(epub)).toMatchInlineSnapshot(`
      [
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
          <dc:date opf:event='modification'>2022-09-24</dc:date>
          <dc:rights>undefined</dc:rights>
          <meta name='cover' content='cover-image'/>
        </metadata>
        <manifest>
          <item id='cover-image' media-type='image/jpeg' href='images/C.jpg'/>
          <item id='cover' media-type='application/xhtml+xml' href='cover.xhtml'/>
          <item id='navigation' media-type='application/x-dtbncx+xml' href='navigation.ncx'/>
          <item id='s1' media-type='application/xhtml+xml' href='content/prologue.xhtml'/>
          <item id='s2' media-type='application/xhtml+xml' href='content/chapter-01.xhtml'/>
          <item id='s3' media-type='application/xhtml+xml' href='content/s3.xhtml'/>
          <item id='toc' media-type='application/xhtml+xml' href='content/toc.xhtml'/>
          <item id='css' media-type='text/css' href='css/ebook.css'/>
        </manifest>
        <spine toc='navigation'>
          <itemref idref='cover' linear='yes' properties='duokan-page-fullscreen'/>
          <itemref idref='s1' />
          <itemref idref='toc'/>
          <itemref idref='s2' />
          <itemref idref='s3' />
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
        <navPoint class='section' id='s1' playOrder='2'>
          <navLabel><text>prologue</text></navLabel>
          <content src='content/prologue.xhtml'/>
        </navPoint>
        <navPoint class='toc' id='toc' playOrder='3'>
          <navLabel><text></text></navLabel>
          <content src='content/toc.xhtml'/>
        </navPoint>
        <navPoint class='section' id='s2' playOrder='4'>
          <navLabel><text>Chapter One</text></navLabel>
          <content src='content/chapter-01.xhtml'/>
        </navPoint>
        <navPoint class='section' id='s3' playOrder='5'>
          <navLabel><text>Chapter Two</text></navLabel>
          <content src='content/s3.xhtml'/>
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
      <!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.1//EN' 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd'>
      <html xmlns='http://www.w3.org/1999/xhtml'>
        <head>
          <title>prologue</title>
          <link rel='stylesheet' type='text/css' href='../css/ebook.css' />
        </head>
        <body>
          <div>
            <h1>prologue</h1><p>...</p>
          </div>
        </body>
      </html>
      ",
          "folder": "OEBPF/content",
          "name": "prologue.xhtml",
        },
        {
          "compress": true,
          "content": "<?xml version='1.0' encoding='utf-8'?>
      <!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.1//EN' 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd'>
      <html xmlns='http://www.w3.org/1999/xhtml'>
        <head>
          <title>Chapter One</title>
          <link rel='stylesheet' type='text/css' href='../css/ebook.css' />
        </head>
        <body>
          <div>
            <h1>Chapter One</h1><p>...</p>
          </div>
        </body>
      </html>
      ",
          "folder": "OEBPF/content",
          "name": "chapter-01.xhtml",
        },
        {
          "compress": true,
          "content": "<?xml version='1.0' encoding='utf-8'?>
      <!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.1//EN' 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd'>
      <html xmlns='http://www.w3.org/1999/xhtml'>
        <head>
          <title>Chapter Two</title>
          <link rel='stylesheet' type='text/css' href='../css/ebook.css' />
        </head>
        <body>
          <div>
            <h1>Chapter Two</h1><p>...</p>
          </div>
        </body>
      </html>
      ",
          "folder": "OEBPF/content",
          "name": "s3.xhtml",
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
            <a href='prologue.xhtml'>prologue</a><br/>
            <a href='chapter-01.xhtml'>Chapter One</a><br/>
            <a href='s3.xhtml'>Chapter Two</a><br/>
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
    `);
  });
});
