# FixOra Back-End
This project is a TypeScript-based back-end application with es6 modules  that serves as the server-side component for a web application.with clean Architecture

## Fetures
1. Es6 modules (import and export)
2. type script with nodeNext (supports es6 modules)
3. Clean Architecture & its structure (notes mentioned in each folder)
4. backend validation with zod library (A TypeScript-first schema declaration and validation library )
5. implimented JWT -For better ux, Implimented refresh token with accessToken( used Rotating Refresh Tokens logic & store RToken in db for better security )
6. Google OAuth authentication backend with support for PKCE-based code exchange, JWT issuance, refresh token

## Run the application :
> ```npm run build ```
   Runs the TypeScript compiler (tsc) to compile TypeScript files into JavaScript.
> ```npm start```
   Starts the application by running the compiled JavaScript file (server.js) in the dist folder using Node.js.


## Setup Instructions for type-script(ts)
- My study 
   1. create a package.json  ```npm init -y```
         * mentioned "type" : "module" to implment  es6 module instead of common js
   2. install ts  ```npm i typescript ---save-dev```
         * Ts is only required in developing so, what even reltaled dependencis will also comes under development side only 
   3. create a tsconfig.json ```npx tsc --init```
         * This is for congifuring Ts as per your needs 
         > Aslo if ts in intall in globaly -g then no need of npx 
   4.  create a src folder and write all .ts logic ower there (eg -> server.ts)
         * then Run it
            - 1st transpile (convert) ts to js and then run the js  (commads show abouve in run application)
         * its a standerd to write in 'src' folder 
   5. As mentioned earlier, you need to install some dependencies to ensure TypeScript works properly:
      1. `npm install --save-dev @types/node`  
      - This provides type definitions for Node.js, required if you're using Node.js APIs in your project.
      2. `npm install --save-dev @types/express`  
      - This provides type definitions for Express, required if you're using Express in your project.
      3. Etc... 





