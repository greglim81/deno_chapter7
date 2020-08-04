import { Application } from "https://deno.land/x/oak/mod.ts";
import router from "./routes/todo-routes.ts";
import { connect } from './helper/db.ts';

connect();

const app = new Application();

app.use(async (ctx,next) =>{
    try{
      await next();
    }
    catch(err){
       console.log(err);
       ctx.response.body = "Something went wrong. Please try again later.";
    }
});   

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
