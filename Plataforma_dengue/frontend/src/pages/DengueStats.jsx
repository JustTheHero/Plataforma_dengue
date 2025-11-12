import {useState, useEffect} from "react";
import {getStats} from "../services/statsService";
import {Card, CardHeader, CardTitle, CardContent} from "../components/ui/card";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "../components/ui/table";

const stats= ()=>{
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        const fetchStats = async()=>{
            try{
                const stats = await getStats();
                setStats(stats);
                setLoading(false);
            }catch(error){
                console.error("Erro ao buscar estatísticas:", error);
                setLoading(false);
            }
        }
        fetchStats();
    },[])
    if (loading) return <p>Carregando estatisticas</p>;
    if (stats.length === 0) return <p>Nenhuma estatistica encontrada</p>

    return(
        <div className="container mx-auto p-2 sm:p-4 max-w-7xl">
            <Card className="p-3 sm:p-6 rounded-xl shadow-md mb-4 sm:mb-8">
                <div>
                    <CardHeader>
                        <CardTitle>Estatísticas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Area</TableHead>
                                    <TableHead>Quarteirao</TableHead>
                                    <TableHead>Endereco</TableHead>
                                    <TableHead>Situacao</TableHead>
                                    <TableHead>Medidas de Controle</TableHead>
                                    <TableHead>Recepientes</TableHead>
                                    <TableHead>Larvas</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{stats.data}</TableCell>
                                    <TableCell>{stats.area}</TableCell>
                                    <TableCell>{stats.quarteirao}</TableCell>
                                    <TableCell>{stats.endereco}</TableCell>
                                    <TableCell>{stats.situacao}</TableCell>
                                    <TableCell>{stats.medidasDeControle}</TableCell>
                                    <TableCell>{stats.recepientes.tipo} - {stats.recepientes.quantidade}</TableCell>
                                    <TableCell>{stats.larvas}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </div>

            </Card>
            
        </div>
    )
    }
    export default stats;