import { getFileName, getFolder } from 'src/utility'
import { describe, it, expect } from 'vitest'

describe('path', () => {
  it('get file name', () => {
    expect(getFileName('C:/A/B/C/123.jpg')).toMatchInlineSnapshot('"123.jpg"')
    expect(getFileName('D:\\E\\F\\G\\456.epub')).toMatchInlineSnapshot(
      '"456.epub"'
    )
  })
  it('get file folder', () => {
    expect(getFolder('C:/A/B/C/123.jpg')).toMatchInlineSnapshot('"C:/A/B/C"')
    expect(getFolder('D:\\E\\F\\G\\456.epub')).toMatchInlineSnapshot('"D:\\\\E\\\\F\\\\G"')
  })
})