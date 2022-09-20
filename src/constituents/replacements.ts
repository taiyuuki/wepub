import type Epub from "src/dts";
import { getImageFileName } from "src/utility";

const tagReplace = (origin: string, tag: string, target: string) => {
  return origin.split(`[[${tag}]]`).join(target || "");
};

export const replacements = ({ metadata }: Epub, original: string): string => {
  let result = original;
  result = tagReplace(result, "COVER", getImageFileName(metadata.cover));
  result = tagReplace(result, "ID", metadata.id.toString());
  result = tagReplace(result, "TITLE", metadata.title);
  result = tagReplace(result, "SERIES", metadata.series || "");
  result = tagReplace(result, "SEQUENCE", (metadata.sequence || "").toString());
  result = tagReplace(result, "COPYRIGHT", metadata.copyright || "");
  result = tagReplace(result, "LANGUAGE", metadata.language || "");
  result = tagReplace(result, "FILEAS", metadata.fileAs || "");
  result = tagReplace(result, "AUTHOR", metadata.author || "");
  result = tagReplace(result, "PUBLISHER", metadata.publisher || "");
  result = tagReplace(result, "DESCRIPTION", metadata.description || "");
  result = tagReplace(result, "PUBLISHED", metadata.published || "");
  result = tagReplace(result, "GENRE", metadata.genre || "");
  result = tagReplace(result, "TAGS", metadata.tags || "");
  result = tagReplace(result, "CONTENTS", metadata.contents || "");
  result = tagReplace(result, "SOURCE", metadata.source || "");
  result = tagReplace(result, "MAKER", metadata.maker || "wepub");
  return result;
};
