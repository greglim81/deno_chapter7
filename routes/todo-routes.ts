import { Router } from "https://deno.land/x/oak/mod.ts";
import { renderFileToString } from 'https://deno.land/x/dejs@0.8.0/mod.ts';//
import getTodosCollection from '../helper/db.ts';

const router = new Router();

router.post('/delete-todo/:todoId', async (ctx) => {
    const id = ctx.params.todoId!;
    await getTodosCollection().deleteOne({_id:{$oid: id}});
    ctx.response.redirect('/');
});

router.post('/update-todo/:todoId', async (ctx) => {
    const id = ctx.params.todoId!; 

    const todo = await getTodosCollection().findOne({ _id: { $oid: id } });

    if(!todo){
        throw new Error('did not find todo')
    }

    const updatedTodoTitle = (await ctx.request.body({type: "form"}).value).get('update-todo'); 

    if(updatedTodoTitle && updatedTodoTitle.trim().length !== 0){
        todo.name = updatedTodoTitle;
        await getTodosCollection().updateOne(
            {_id: {$oid: id}},
            {$set: {name: updatedTodoTitle}}
        );
            
        ctx.response.redirect('/')
    }
    else{
        const body = await renderFileToString(Deno.cwd()+'/views/todo.ejs',{
            todoText: todo.name,
            todoId: todo._id.$oid,
            error: "Field cannot be empty"
        });     
        ctx.response.body = body;            
    } 
  });

router.get('/todo/:todoId', async (ctx) => {
    const id = ctx.params.todoId!; 
    const todo = await getTodosCollection().findOne({ _id: { $oid: id } });
    if(!todo){
      throw new Error('did not find todo') 
    }
    const body = await renderFileToString(Deno.cwd()+'/views/todo.ejs',{
      todoText: todo.name, 
      todoId: todo._id.$oid,
      error: null      
    });

    ctx.response.body = body;
});


router.get('/',async (ctx,next)=>{
    const todos = await getTodosCollection().find();
    const body = await renderFileToString(Deno.cwd()+'/views/todos.ejs',{
        title: 'My Todos',
        todos: todos,
        error: null
    });
    ctx.response.body = body;    
});

router.post('/add-todo',async (ctx,next) => {    
    const newTodoTitle =  (await ctx.request.body({type: "form"}).value).get('new-todo'); 
            
    if(newTodoTitle && newTodoTitle.trim().length !== 0){
        const newTodo ={
            name: newTodoTitle! 
        }; 
        await getTodosCollection().insertOne(newTodo)
        
        console.log(newTodo);             
        ctx.response.redirect('/')
    }
    else{
        const todos = await getTodosCollection().find();
        const body = await renderFileToString(Deno.cwd()+'/views/todos.ejs',{
            title: 'My Todos',
            todos: todos,
            error: "Field cannot be empty"
        });
        ctx.response.body = body;            
    }
});

export default router;
