export const fileToURL = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
