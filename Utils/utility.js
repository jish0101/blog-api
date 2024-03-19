export const fileToURL = (buffer) => {
  try {
    const bufferString = Buffer.from(buffer).toString('base64');
    return `data:image/jpeg;base64,${bufferString}`;
  } catch (error) {
    return error;
  }
};
