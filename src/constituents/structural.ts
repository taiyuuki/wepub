import { replacements } from "./replacements";
import { getFileName, getImageFileName, getImageType } from "../utility";
import type Epub from "src/dts";
import moment from "moment";

const structural = {
  // mimetype.
  getMimetype: () => "application/epub+zip",

  // container XML
  getContainer: () => {
    let result = "";
    result += "<?xml version='1.0' encoding='UTF-8' ?>\n";
    result +=
      "<container version='1.0' xmlns='urn:oasis:names:tc:opendocument:xmlns:container'>\n";
    result += "  <rootfiles>\n";
    result +=
      "    <rootfile full-path='OEBPF/ebook.opf' media-type='application/oebps-package+xml'/>\n";
    result += "  </rootfiles>\n";
    result += "</container>";
    return result;
  },

  // duokan-extension: create duokan comic
  getDuokanExtension() {
    let result = "";
    result += '<?xml version="1.0" encoding="UTF-8"?>\n';
    result += '<duokan-extension version="2.4.0">\n';
    result += '  <display-options layout="vertical-comic"/>\n';
    result += "  <writing-options>\n";
    result += '    <option name="writing-mode">horizontal-tb</option>\n';
    result += '    <option name="direction">ltr</option>\n';
    result += "  </writing-options>\n";
    result += "</duokan-extension>\n";
    return result;
  },

  // OPF (spine)
  getOPF: (epub: Epub) => {
    const { metadata } = epub;
    const coverFilename = (function () {
      if (typeof epub.coverImage === "string") {
        return getFileName(epub.coverImage);
      } else {
        return getFileName(epub.coverImage.name);
      }
    })();
    let i;
    let result = "";
    result += "<?xml version='1.0' encoding='utf-8'?>\n";
    result +=
      "<package xmlns='http://www.idpf.org/2007/opf' version='2.0' unique-identifier='duokan-book-id'>\n";
    result +=
      "  <metadata xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:opf='http://www.idpf.org/2007/opf'>\n";

    if (metadata.series && metadata.sequence) {
      result += `    <dc:title>${metadata.title} (${metadata.series} #${metadata.sequence})</dc:title>\n`;
    } else if (metadata.series) {
      result += `    <dc:title>${metadata.title} (${metadata.series})</dc:title>\n`;
    } else if (metadata.sequence) {
      result += `    <dc:title>${metadata.title} (#${metadata.sequence})</dc:title>\n`;
    } else {
      result += `    <dc:title>${metadata.title}</dc:title>\n`;
    }

    result += `    <dc:identifier id='duokan-book-id' opf:scheme='URI'>${metadata.id}</dc:identifier>\n`;
    result += `    <dc:language>${metadata.language}</dc:language>\n`;
    result += `    <dc:creator opf:role='aut' opf:file-as='${metadata.fileAs}'>${metadata.author}</dc:creator>\n`;
    result += `    <dc:publisher>${metadata.publisher}</dc:publisher>\n`;
    result += `    <dc:description>${metadata.description}</dc:description>\n`;
    result += `    <dc:coverage></dc:coverage>\n`;
    result += `    <dc:source>${metadata.source}</dc:source>\n`;
    result += `    <dc:date opf:event='publication'>${metadata.published}</dc:date>\n`;
    result += `    <dc:date opf:event='modification'>${moment().format(
      "YYYY-MM-DD"
    )}</dc:date>\n`;
    result += `    <dc:rights>${metadata.copyright}</dc:rights>\n`;

    if (metadata.genre) {
      result += `    <dc:subject>${metadata.genre}</dc:subject>\n`;
    }

    if (metadata.tags) {
      const tags = metadata.tags.split(",");
      for (i = 0; i < tags.length; i += 1) {
        result += `    <dc:subject>${tags[i]}</dc:subject>\n`;
      }
    }

    if (metadata.series) {
      result += `    <meta name='calibre:series' content='${metadata.series}'/>\n`;
    }
    if (metadata.sequence) {
      result += `    <meta name='calibre:series_index' content='${metadata.sequence}'/>\n"`;
    }

    result += "    <meta name='cover' content='cover-image'/>\n";
    result += "  </metadata>\n";
    result += "  <manifest>\n";
    result += `    <item id='cover-image' media-type='${getImageType(
      coverFilename
    )}' href='images/${coverFilename}'/>\n`;
    result +=
      "    <item id='cover' media-type='application/xhtml+xml' href='cover.xhtml'/>\n";
    result +=
      "    <item id='navigation' media-type='application/x-dtbncx+xml' href='navigation.ncx'/>\n";

    for (i = 1; i <= epub.sections.length; i += 1) {
      const fname = epub.sections[i - 1].overrideFilename;
      result += `    <item id='s${i}' media-type='application/xhtml+xml' href='content/${fname}'/>\n`;
    }

    if (epub.showContents) {
      result +=
        "    <item id='toc' media-type='application/xhtml+xml' href='content/toc.xhtml'/>\n";
    }
    result +=
      "    <item id='css' media-type='text/css' href='css/ebook.css'/>\n";

    if (epub.images.length > 0) {
      for (i = 0; i < epub.images.length; i++) {
        const image = epub.images[i];
        const imageFile = getImageFileName(image);
        const imageType = getImageType(imageFile);
        if (imageType.length > 0) {
          result += `    <item id='img${i}' media-type='${imageType}' href='images/${imageFile}'/>\n`;
        }
      }
    }

    result += "  </manifest>\n";

    result += "  <spine toc='navigation'>\n";
    result +=
      "    <itemref idref='cover' linear='yes' properties='duokan-page-fullscreen'/>\n";

    for (i = 1; i <= epub.sections.length; i += 1) {
      if (epub.sections[i - 1].isFrontMatter) {
        result += `    <itemref idref='s${i}' />\n`;
      }
    }

    if (epub.showContents) {
      result += "    <itemref idref='toc'/>\n";
    }

    for (i = 1; i <= epub.sections.length; i += 1) {
      if (!epub.sections[i - 1].isFrontMatter) {
        result += `    <itemref idref='s${i}' />\n`;
      }
    }

    result += "  </spine>\n";

    if (epub.showContents) {
      result += "  <guide>\n";
      result +=
        "    <reference type='toc' title='Contents' href='content/toc.xhtml'></reference>\n";
      result += "  </guide>\n";
    }

    result += "</package>\n";
    return replacements(epub, replacements(epub, result));
  },

  // NCX
  getNCX: (epub: Epub) => {
    let i;
    let title: string;
    let order;
    let result = "";
    let playOrder = 1;
    const { metadata } = epub;
    result += "<?xml version='1.0' encoding='UTF-8'?>\n";
    result +=
      "<!DOCTYPE ncx PUBLIC '-//NISO//DTD ncx 2005-1//EN' 'http://www.daisy.org/z3986/2005/ncx-2005-1.dtd'>\n";
    result += "<ncx xmlns='http://www.daisy.org/z3986/2005/ncx/'>\n";
    result += "<head>\n";
    result += `  <meta name='dtb:uid' content='${metadata.id}'/>\n`;
    result += "  <meta name='dtb:depth' content='1'/>\n";
    result += "  <meta name='dtb:totalPageCount' content='0'/>\n";
    result += "  <meta name='dtb:maxPageNumber' content='0'/>\n";
    result += "</head>\n";
    result += `<docTitle><text>${metadata.title}</text></docTitle>\n`;
    result += `<docAuthor><text>${metadata.author}</text></docAuthor>\n`;
    result += "<navMap>\n";
    result += `  <navPoint id='cover' playOrder='${playOrder++}'>\n`;
    result += "    <navLabel><text>Cover</text></navLabel>\n";
    result += "    <content src='cover.xhtml'/>\n";
    result += "  </navPoint>\n";

    for (i = 1; i <= epub.sections.length; i += 1) {
      if (!epub.sections[i - 1].excludeFromContents) {
        if (epub.sections[i - 1].isFrontMatter) {
          const fname = epub.sections[i - 1].overrideFilename;
          title = epub.sections[i - 1].title;
          order = playOrder++;
          epub.filesForTOC.push({
            title,
            link: `${fname}`,
            itemType: "front",
          });
          result += `  <navPoint class='section' id='s${i}' playOrder='${order}'>\n`;
          result += `    <navLabel><text>${title}</text></navLabel>\n`;
          result += `    <content src='content/${fname}'/>\n`;
          result += "  </navPoint>\n";
        }
      }
    }

    if (epub.showContents) {
      epub.filesForTOC.push({
        title: metadata.contents as string,
        link: "toc.xhtml",
        itemType: "contents",
      });
      result += `  <navPoint class='toc' id='toc' playOrder='${playOrder++}'>\n`;
      result += "    <navLabel><text>[[CONTENTS]]</text></navLabel>\n";
      result += "    <content src='content/toc.xhtml'/>\n";
      result += "  </navPoint>\n";
    }

    for (i = 1; i <= epub.sections.length; i += 1) {
      if (!epub.sections[i - 1].excludeFromContents) {
        if (!epub.sections[i - 1].isFrontMatter) {
          const fname = epub.sections[i - 1].overrideFilename;
          title = epub.sections[i - 1].title;
          order = playOrder++;
          epub.filesForTOC.push({
            title,
            link: `${fname}`,
            itemType: "main",
          });
          result += `  <navPoint class='section' id='s${i}' playOrder='${order}'>\n`;
          result += `    <navLabel><text>${title}</text></navLabel>\n`;
          result += `    <content src='content/${fname}'/>\n`;
          result += "  </navPoint>\n";
        }
      }
    }

    result += "</navMap>\n";
    result += "</ncx>\n";

    return replacements(epub, replacements(epub, result));
  },
};

export default structural;
