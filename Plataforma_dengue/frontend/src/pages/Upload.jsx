import {useState, useEffect} from "react";
import {uploadFile} from "../services/uploadService";
import {Card, CardHeader, CardTitle, CardContent} from "../components/ui/card";
import {Button} from "../components/ui/button";
import {Upload} from 'lucide-react';

const upload = () =>{
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(()=>{
        const fetchFile = async()=>{
            try{
                setLoading(true);
                const response = await uploadFile(file);
                setLoading(false);
            }catch(error){
                setError(error.message);
                setLoading(false);
            }
        }
        fetchFile();
    },[file])
    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro: {error}</p>;
    return(
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Upload de arquivo</CardTitle>
                </CardHeader>
                <CardContent>
                    <input type="file" onChange={(e)=>setFile(e.target.files[0])}/>
                    <Button onClick={uploadFile(file)}>Upload</Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default upload;