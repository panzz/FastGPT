export const fileImgs = [
  { suffix: 'pdf', src: `${process.env.BASE_PATH}/imgs/files/pdf.svg` },
  { suffix: 'csv', src: `${process.env.BASE_PATH}/imgs/files/csv.svg` },
  { suffix: '(doc|docs)', src: `${process.env.BASE_PATH}/imgs/files/doc.svg` },
  { suffix: 'txt', src: `${process.env.BASE_PATH}/imgs/files/txt.svg` },
  { suffix: 'md', src: `${process.env.BASE_PATH}s/imgs/files/markdown.svg` }
  // { suffix: '.', src: '/imgs/files/file.svg' }
];

export function getFileIcon(name = '', defaultImg = `${process.env.BASE_PATH}/imgs/files/file.svg`) {
  return fileImgs.find((item) => new RegExp(item.suffix, 'gi').test(name))?.src || defaultImg;
}
