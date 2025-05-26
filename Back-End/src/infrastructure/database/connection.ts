import mongoose from 'mongoose';

const max_retries = 5;
let retries = 0;

const mongoConnect = async ():Promise<void> => {
    const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/fixora'
    try {
        await mongoose.connect(url)
        console.log('connected to MongoDB')
    } catch (error: unknown) {
        retries++
        console.error('Failed to connect to MongoDB', error);

        if (retries < max_retries) {
            console.log(`Retrying to connect... (${retries}/${max_retries})`);
            setTimeout(mongoConnect, 5000); // Retry after 5 seconds
        }else{
            console.error('Maximum retry attempts reached. Exiting process.');
            process.exit(1); //stop the app
        }
    }
}

export default mongoConnect


//Notes 
/* This above code is same as the this basic version(give below) jst added  
Types ,
Fallback url(same like port number)
 and 
Retry with delay logic 


async function mongoConnect() {
   try {
      await mongoose.connect(process.env.MONGO_URL)
      console.log('Connected to MongoDB');
   } catch (error) {
      console.error('Failed to connect to MongoDB', error);
         here i have not added stoping logic thus it creates bug cz app is still running without db and 
   }
}
export default mongoConnect;

//? retry logic is usefull when you're working in environments where MongoDB might not be instantly available, such as:
//* 🐳 Docker or Kubernetes — your app may start before MongoDB is ready.
//* 🌐 Network issues — to handle temporary connection glitches.
//* 🔁 CI/CD pipelines — gives Mongo time to start before tests run.
//* 🧪 Automated tests — reduces random failures due to timing issues.


*/





