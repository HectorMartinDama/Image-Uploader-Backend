import app from '../app.js';
import supertest from "supertest";
import fs from 'fs';

const api= supertest(app);
let filePathName;

test('return status code 404, when the route does not exist', async () => {
    await api.get('/dontExists').expect(404);
});

test('upload a image to the server', async () =>{
    if(fs.existsSync('./test/testImage.jpeg')){
        const response= await api.post('/').attach('image', './test/testImage.jpeg').expect(200);
        expect(response.body.success).toBe(true);
        expect(fs.existsSync(`./uploads/${response.body.fileName}`)).toBe(true);
        filePathName=response.body.fileName;
    }
});

test('get a image from the server', async () =>{
    await api.get(`/image/${filePathName}`).expect('Content-Type', 'image/jpeg').expect(200);    
});


afterAll(() =>{
    fs.unlinkSync(`./uploads/${filePathName}`);
});