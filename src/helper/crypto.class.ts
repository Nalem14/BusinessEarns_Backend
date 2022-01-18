const crypto = require('crypto');
require('dotenv').config();

const algorithm = 'aes-256-ctr';
const secretKey = process.env.APP_KEY;
const iv = crypto.randomBytes(16);

export class Crypto {

    static encrypt (text: string): Object {

        const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    
        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex')
        };
    };
    
    static decrypt (hash: any): string {
    
        const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
    
        const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    
        return decrpyted.toString();
    };
}