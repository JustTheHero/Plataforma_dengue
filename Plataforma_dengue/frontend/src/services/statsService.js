import data1 from "../utils/data1.json";
export async function getStats() {

    //setar para pegar as respostas do jupiter notebook via back
    //vai retornar a data, área, quarteirão, endereço, situação, medidas de controle, recepientes, larvas
    //talvez bater com a base do dataSUS
    const data = data1;
    return data;
}