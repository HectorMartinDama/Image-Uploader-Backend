import express from 'express'; 
import multer from 'multer';
import helmet from 'helmet';
import http from 'http';
import path from 'path';
import cors  from 'cors';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config'


const storage= multer.diskStorage({
    destination: function(req, file, callback){
        return callback(null, './uploads');
    },
    filename: function(req, file, callback){
        return callback(null, `${uuidv4()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({storage: storage});  
const PORT= process.env.PORT || 5000; 
const app= express();

app.use(cors());
app.use(helmet());
app.use(express.json());
const server= http.createServer(app); 

app.get('/health', (req, res) =>{
    res.json({status: 'ok'});
});

app.post('/', upload.single('image'), (req, res) =>{
    if(!req.file) return res.send({success: false});
    else return res.json({success: true, fileName: req.file.filename });
});

app.get('/image/:name', (req, res) =>{
    res.sendFile(path.resolve('./uploads/' + req.params.name));
});

app.use((req, res) =>{
    res.status(404).send('This endpoint does not exists');
});

server.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});

export default app;