import DataUriParser from 'datauri/parser.js'

import path from 'path'
const parser = new DataUriParser();

export const getDataUri = (file) => {
    const extName = path.extname(file.originalname);
    return parser.format(extName, file.buffer);
};

export default getDataUri;
