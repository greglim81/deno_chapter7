import { MongoClient, Collection } from "https://deno.land/x/mongo@v0.9.1/mod.ts";

interface TodoSchema {
  _id: { $oid: string };
  name: string  
}

let todosCollection : Collection<TodoSchema>; 

export function connect(){
    const client = new MongoClient();

    client.connectWithUri("mongodb+srv://newuser1:uTSXeKFWdmz2wvWa@cluster0.vxjpr.mongodb.net/?retryWrites=true&w=majority");
    
    const db = client.database("todos");
    todosCollection = db.collection<TodoSchema>("todos");
}
    
function getTodosCollection(){
    return todosCollection;
}
    
export default getTodosCollection;
