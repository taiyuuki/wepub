import Epub from "../src/index";
import { describe, it, expect } from "vitest";
import { getImageFileName } from "src/utility";

describe("metadata", () => {
  it("get image name", () => {
    const image1 = "C:/images/cover.jpg";
    const image2 = {
      name: "D:/images/132.jpg",
      data: {} as File,
    };
    expect(getImageFileName(image1)).toMatchInlineSnapshot('"cover.jpg"');
    expect(getImageFileName(image2)).toMatchInlineSnapshot('"132.jpg"');
  });

  const epub = new Epub({
    title: "test",
    id: 1001,
    cover: "C:/A/B/C.jpg",
    author: "wepub",
  });
  it("init", () => {
    expect(epub.coverImage).toMatchInlineSnapshot(`
      {
        "data": "C:/A/B/C.jpg",
        "name": "C.jpg",
      }
    `);
    expect(epub.metadata).toMatchInlineSnapshot(`
      {
        "author": "wepub",
        "cover": "C:/A/B/C.jpg",
        "id": 1001,
        "title": "test",
      }
    `);
  });

  it("set metadatea", () => {
    epub.setMeta({
      title: "test2",
      id: 2002,
      cover: {
        name: "D:/images/123.png",
        data: {} as File,
      },
      author: "wepub",
    });
    expect(epub.coverImage).toMatchInlineSnapshot(`
      {
        "data": {},
        "name": "D:/images/123.png",
      }
    `);
    expect(epub.metadata).toMatchInlineSnapshot(`
      {
        "author": "wepub",
        "cover": {
          "data": {},
          "name": "D:/images/123.png",
        },
        "id": 2002,
        "title": "test2",
      }
    `);
  });

  it("add images", () => {
    epub.addImagesAll([
      "C:/images/1.jpg",
      "C:/images/2.jpg",
      "C:/images/3.jpg",
    ]);
    expect(epub.images).toMatchInlineSnapshot(`
      [
        {
          "data": "C:/images/1.jpg",
          "name": "1.jpg",
        },
        {
          "data": "C:/images/2.jpg",
          "name": "2.jpg",
        },
        {
          "data": "C:/images/3.jpg",
          "name": "3.jpg",
        },
      ]
    `);
  });
});
