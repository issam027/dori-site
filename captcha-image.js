import { deflateSync } from 'node:zlib';
import { randomInt } from 'node:crypto';

const glyphs = {
  A:['01110','10001','10001','11111','10001','10001','10001'], B:['11110','10001','10001','11110','10001','10001','11110'],
  C:['01111','10000','10000','10000','10000','10000','01111'], D:['11110','10001','10001','10001','10001','10001','11110'],
  E:['11111','10000','10000','11110','10000','10000','11111'], F:['11111','10000','10000','11110','10000','10000','10000'],
  G:['01111','10000','10000','10111','10001','10001','01110'], H:['10001','10001','10001','11111','10001','10001','10001'],
  J:['00111','00010','00010','00010','10010','10010','01100'], K:['10001','10010','10100','11000','10100','10010','10001'],
  L:['10000','10000','10000','10000','10000','10000','11111'], M:['10001','11011','10101','10101','10001','10001','10001'],
  N:['10001','11001','11001','10101','10011','10011','10001'], P:['11110','10001','10001','11110','10000','10000','10000'],
  Q:['01110','10001','10001','10001','10101','10010','01101'], R:['11110','10001','10001','11110','10100','10010','10001'],
  S:['01111','10000','10000','01110','00001','00001','11110'], T:['11111','00100','00100','00100','00100','00100','00100'],
  U:['10001','10001','10001','10001','10001','10001','01110'], V:['10001','10001','10001','10001','10001','01010','00100'],
  W:['10001','10001','10001','10101','10101','11011','10001'], X:['10001','10001','01010','00100','01010','10001','10001'],
  Y:['10001','10001','01010','00100','00100','00100','00100'], Z:['11111','00001','00010','00100','01000','10000','11111'],
  2:['01110','10001','00001','00010','00100','01000','11111'], 3:['11110','00001','00001','01110','00001','00001','11110'],
  4:['00010','00110','01010','10010','11111','00010','00010'], 5:['11111','10000','10000','11110','00001','00001','11110'],
  6:['01110','10000','10000','11110','10001','10001','01110'], 7:['11111','00001','00010','00100','01000','01000','01000'],
  8:['01110','10001','10001','01110','10001','10001','01110'], 9:['01110','10001','10001','01111','00001','00001','01110'],
};
function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) { crc ^= byte; for(let bit=0;bit<8;bit++) crc=(crc>>>1)^((crc&1)?0xedb88320:0); }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const name=Buffer.from(type), size=Buffer.alloc(4), checksum=Buffer.alloc(4);
  size.writeUInt32BE(data.length);checksum.writeUInt32BE(crc32(Buffer.concat([name,data])));
  return Buffer.concat([size,name,data,checksum]);
}
// A raster contains no answer in text nodes, metadata, filenames or alt text.
export function captchaImage(text) {
  const width=220,height=66, pixels=Buffer.alloc(width*height*3);
  for(let i=0;i<pixels.length;i+=3){pixels[i]=237;pixels[i+1]=247;pixels[i+2]=246;}
  const dot=(x,y,color)=>{x=Math.round(x);y=Math.round(y);if(x<0||x>=width||y<0||y>=height)return;const i=(y*width+x)*3;pixels.set(color,i);};
  for(let n=0;n<700;n++)dot(randomInt(width),randomInt(height),[140,180,180]);
  [...text].forEach((letter,index)=>{
    const x0=14+index*33,y0=14+randomInt(-5,6),angle=randomInt(-16,17)*Math.PI/180;
    glyphs[letter].forEach((row,y)=>[...row].forEach((on,x)=>{
      if(on!=='1')return;
      for(let dy=0;dy<5;dy++)for(let dx=0;dx<4;dx++) {
        const px=x*4+dx-10,py=y*5+dy-17;
        dot(x0+10+px*Math.cos(angle)-py*Math.sin(angle),y0+17+px*Math.sin(angle)+py*Math.cos(angle),[20,60,80]);
      }
    }));
  });
  for(let line=0;line<3;line++){const phase=randomInt(100),offset=randomInt(10,55);for(let x=0;x<width;x++)dot(x,offset+5*Math.sin((x+phase)/20),[105,155,155]);}
  const raw=Buffer.alloc(height*(width*3+1));
  for(let y=0;y<height;y++)pixels.copy(raw,y*(width*3+1)+1,y*width*3,(y+1)*width*3);
  const header=Buffer.alloc(13);header.writeUInt32BE(width);header.writeUInt32BE(height,4);header[8]=8;header[9]=2;
  return 'data:image/png;base64,'+Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]).toString('base64');
}
