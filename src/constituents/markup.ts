import type Epub from "src/dts";
import { Section } from "src/dts";
import { getImageFileName } from "src/utility";
import { replacements } from "./replacements";

const markup = {
  getContents: (epub: Epub, overrideContents?: string) => {
    let result = "";
    result += "<?xml version='1.0' encoding='utf-8'?>\n";
    result +=
      "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.1//EN' 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd' >\n";
    result += "<html xmlns='http://www.w3.org/1999/xhtml'>\n";
    result += "  <head>\n";
    result += "    <title>[[CONTENTS]]</title>\n";
    result +=
      "    <link rel='stylesheet' type='text/css' href='../css/ebook.css' />\n";
    result += "  </head>\n";
    result += "  <body>\n";

    if (overrideContents) {
      result += overrideContents;
    } else {
      result += "    <div class='contents'>\n";
      result += "      <h1>[[CONTENTS]]</h1>\n";
      epub.sections.forEach((section) => {
        if (!section.excludeFromContents) {
          result += `      <a href='${section.overrideFilename}'>${section.title}</a><br/>\n`;
        }
      });
      result += "    </div>\n";
    }
    result += "  </body>\n";
    result += "</html>\n";
    return result;
  },

  // TOC
  getTOC: (epub: Epub) => {
    let content = "";
    if (epub._generateContentsCallback) {
      const callbackContent = epub._generateContentsCallback(epub.filesForTOC);
      content = markup.getContents(epub, callbackContent);
    } else {
      content = markup.getContents(epub);
    }
    return replacements(epub, replacements(epub, content));
  },

  // cover
  getCover: (epub: Epub) => {
    const coverFilename = getImageFileName(epub.coverImage);
    let result = "";
    result += "<?xml version='1.0' encoding='UTF-8' ?>\n";
    result +=
      "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.1//EN'  'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd'>\n";
    result += "<html xmlns='http://www.w3.org/1999/xhtml' xml:lang='en'>\n";
    result += "<head>\n";
    result += `  <title>${epub.metadata.title}</title>\n`;
    result += "  <style type='text/css'>\n";
    result += "    body { margin: 0; padding: 0; text-align: center; }\n";
    result += "    .cover { margin: 0; padding: 0; font-size: 1px; }\n";
    result += "    img { margin: 0; padding: 0; height: 100%; }\n";
    result += "  </style>\n";
    result += "</head>\n";
    result += "<body>\n";
    result += `  <div class='cover'><img style='height: 100%;width: 100%;' src='images/${coverFilename}' alt='Cover' /></div>\n`;
    result += "</body>\n";
    result += "</html>\n";

    return replacements(epub, replacements(epub, result));
  },

  // css
  getCss: (epub: Epub) => replacements(epub, replacements(epub, epub.css)),

  // section
  getSection: (epub: Epub, section: Section) => {
    const { title } = section;
    const { content } = section;

    let result = "";
    result += "<?xml version='1.0' encoding='utf-8'?>\n";
    result +=
      "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.1//EN' 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd'>\n";
    result += "<html xmlns='http://www.w3.org/1999/xhtml'>\n";

    result += "  <head>\n";
    result += `    <title>${title}</title>\n`;
    result +=
      "    <link rel='stylesheet' type='text/css' href='../css/ebook.css' />\n";
    result += "  </head>\n";
    result += "  <body>\n";
    result += "    <div>\n";

    const lines = content.split("\n");
    lines.forEach((line) => {
      if (line.length > 0) {
        result += `      ${line}\n`;
      }
    });

    result += "    </div>\n";
    result += "  </body>\n";
    result += "</html>\n";

    return replacements(epub, replacements(epub, result));
  },
};

export default markup;
