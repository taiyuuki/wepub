# Wepub

## Contnets

- [About](#About)
- [Creating EPUB](#Creating-EPUB)
  - [Import in Browser](#Import-in-Browser)
  - [Using npm](#Using-npm)
  - [runtime](#runtime)
- [Metadata](#Metadata)
  - [Example Metadata](#Example-Metadata)
- [Adding images](#Adding-images)
- [Adding sections](#Adding-sections)
- [Adding CSS](#Adding-CSS)
- [Custom Table of Contents](#Custom-Table-of-Contents)
- [Generating EPUB](#Generating-EPUB)
- [License](#License)

## About

Wepub is a javascript library for creating EPUB 2 document.

Wepub can be thought as a fork of [Nodepub](https://github.com/kcartlidge/nodepub)，but:

* Compatible with both browser and node.
  * In node, build EPUB with [archiver](https://github.com/archiverjs/node-archiver).
  * In browser, build EPUB with [JSZip](https://github.com/Stuk/jszip).
* Api has been transformed to be more flexible (At least for me).
* Using typescript.

The following is the same as [Nodepub](https://github.com/kcartlidge/nodepub):

- Files pass the [IDPF online validator](http://validator.idpf.org/)
- Files meet Sigil's preflight checks
- Files open fine in iBooks, Adobe Digital Editions, and Calibre
- Files open fine with the Kobo H20 ereader
- Files are fine as *KindleGen* input
- PNG/JPEG cover images
- Inline images within the EPUP
- Custom CSS can be provided
- Optionally generate your own contents page
- Front matter before the contents page
- Exclude sections from auto contents page and metadata-based navigation
- OEBPS and other 'expected' subfolders within the EPUB

## Creating EPUB

### Import in Browser 

[example](https://taiyuuki.github.io/wepub)

CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/wepub@1.0.3/dist/umd/index.js"></script>
```

You can also [download](https://github.com/taiyuuki/wepub/blob/main/dist/umd/index.js) it and import via local file. 

Add `script` tag in browser and use the global variable `Wepub` to create EPUB document:

```js
var epub = new Wepub(metadata);
```

`or`

```js
var epub = new Wepub();
epub.setMeta(metadata);
```

### Using npm

Installation

```shell
npm i wepub
```

Import and create EPUB document:

```js
import Wepub from 'wepub';
```

```js
const epub = new Wepub(metadata);
```

`or`

```js
const epub = new Wepub();
epub.setMeta(metadata);
```

### runtime

There is a property used to get the runtime. 

```js
console.log(epub.runtime) // 'browser' or 'node'
```

## Metadata

The metadata is an object with various properties detailing the book. it’s roughly the same as [Nodepub](https://github.com/kcartlidge/nodepub), but the cover and images will be different on browser and node. 

### Example Metadata

```js
var metadata = {
    id: "278-123456789",
    // in browser  
    cover: {
        name: "cover.jpg",
        data: "data:image/jpg;base64,...", // Blob/File or base64 DataURI
    },
    // in nodejs
    cover: "D:/epub/images/cover.jpg",   
    title: "Unnamed Document",
    series: "My Series",
    sequence: 1,
    author: "KA Cartlidge",
    fileAs: "Cartlidge,KA",
    genre: "Non-Fiction",
    tags: "Sample,Example,Test",
    copyright: "Anonymous, 1980",
    publisher: "My Fake Publisher",
    published: "2000-12-31",
    language: "en",
    description: "A test book.",
    showContents: false,
    contents: "Table of Contents",
    source: "http://www.kcartlidge.com",
    // in browser
    images: [
        { name:'1.jpg', data: "Blob/File or base64 DataURI" },
        { name: '2.jpg', data: "Blob/File or base64 DataURI" }
    ]
    // in nodejs
    images: ["D:/epub/images/1.jpg","D:/epub/images/2.jpg"]
};
```

* The `id` , `cover` , `title` and `author` are required.

*  If you use uuid as the `id` of the book,  you can use genUuid().

  ```js
  metadata.id = epub.genUuid();
  ```

- `cover` and `image` 
  - In browser, image should be an object that has two properties:
    - `name`: file name with extension.
    - `data`: *Blob/File* or *base64 DataURI*.
  - In nodejs, image should be *file path* of the image. `D:/epub/images/cover.jpg`
- `series` and `sequence` are not recognised by many readers (it sets the properties used by *Calibre*)
- `fileAs` is the sortable version of the `author`, which is usually by last name
- `genre` becomes the main subject in the final EPUB
- `tags` also become subjects in the final EPUB
- `published` is the data published - note the *year-month-day* format
- `language` is the short *ISO* language name (`en`, `fr`, `de` etc)
- `showContents` (default is `true`) lets you suppress the contents pageAdding images

## Adding images

In addition to add images in the metadata , you can also:

* Adding a single image

  ```js
  epub.addImage(image);
  ```

* Adding multiple images

  ```js
  epub.addImagesAll([image1, image2, ...])
  ```

The image here is the same as in the metadata. 

## Adding sections

Sections are chunks of HTML that can be thought of as chapters.

Call `addSection` or `addSectionsAll` on your epub with sections.

```js
epub.addSection(section)
```

`or`

```js
epub.addSectionsAll([section1, section2, ...])
```

Section is an object that has the following properties:

|     properties      |  type   |           description            | required |    default     |
| :-----------------: | :-----: | :------------------------------: | :------: | :------------: |
|        title        | string  |   Table of contents entry text   |    √     |                |
|       content       | string  |          HTML body text          |    √     |                |
| excludeFromContents | boolean |  Hide from contents/navigation   |          |     false      |
|    isFrontMatter    | boolean |  Place before the contents page  |          |     false      |
|  overrideFilename   | string  | Section filename inside the EPUB |          | s1, s2, s3 ... |

For example:

```js
epub.addSection({
    title: 'prologue',
    content: '<h1>prologue</h1><p>...</p>',
    excludeFromContents: true,
    isFrontMatter: true,
    overrideFilename: 'prologue'
})
epub.addSection({
    title: 'Chapter One',
    content: '<h1>Chapter One</h1><p>...</p>',
    overrideFilename: 'chapter-01'
});
```

> * In Nodepub, addSection has 5 arguments, I changed it to one argument as an object. The advantage is that, except for the required properties, rest of the properties can be used flexibly.
> * If some sections have overrideFilename and others don't, the default numbers (s1, s2, s3...) may be discontinuous, but no link breaks like Nodepub ( I fixed this in version 1.0.1). 

## Adding CSS

You can inject CSS into your book.

```js
epub.addCss("p { text-indent: 0; } p+p { text-indent: 0.75em; }");
```

## Custom Table of Contents

There is a default table of contents added into all generated EPUBs. In addition to suppressing it, you can also create it yourself.

You can do this by passing the second parameter when creating your EPUB. 

```js
var epub = new Epub(metadata, generateContents);
```

Or you can call the setContents function:

```js
epub.setContents(generateContents);
```

generateContents is a callback function, the function will be given details of all the links, and is expected to return HTML to use for the contents page.

```js
var function generateContents(links){
    var contents = "<h1>Contents</h1>";
    links.forEach((link) => {
        if (link.itemType !== "contents") {
            contents += "<a href='" + link.link + "'>" + link.title + "</a><br />";
        }
    });
    return contents;
}
epub.setContents(generateContents);
```

The `links` array which is passed to your callback function consists of objects with the following properties:

- *title* - the title of the section being linked to
- *link* - the relative `href` within the EPUB
- *itemType* - one of 3 types, those being *front* for front matter, *contents* for the contents page, and *main* for the remaining sections
  - You can use this to omit front matter from the contents page if required.

## Generating EPUB

 Wepub is *asynchronous*, actionable using `async`/`await`.

```js
await epub.build(filenames[, onProgress]);
```

In browser, just the filename:

```js
// This will start downloading `example.epub` inside the browser.
await epub.build('example.epub')
```

In Nodejs, filename with path:

```js
await epub.build('D:/epub/example.epub')
```

The onProgress is a callback function for get progress while generating.

```js
await epub.build('example.epub',function(progress){
    // progress range: [0, 100].
    console.log(progress);
})
```

## License

MIT License © 2022 taiyuuki