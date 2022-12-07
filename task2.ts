import { createReadStream, createWriteStream } from 'node:fs';
import { appendFile } from 'node:fs/promises';
import csvtojsonV2 from 'csvtojson/v2';

async function read(inputPath: string, outputPath: string): Promise<void> {
   
    try{
    await appendFile(outputPath, '');
    const readStream = createReadStream(inputPath);
    const writeStream = createWriteStream(outputPath);
    readStream.pipe(csvtojsonV2()).pipe(writeStream).on('done',()=>{
      readStream.close();
      writeStream.close();
    }); 
  } catch (e) {
    console.log(e);
  }

}

read('./csv/books.csv', 'text.txt')