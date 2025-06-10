# interface Layer (also know as interface Adapters layer , controller layer , prentation layer) 

* src/interfaces/ : 
     **[2rd Outer layer]**
    - The Interface Layer  is the entry and exit point of your application. ( Interfaces -> Can depend on -> application, domain)
    - That also mean that interface layer must not be depended to infrastructure layer 
    - This layer bridges the outside world (HTTP) and the application. It includes 
        - controllers
        - routes
        - middlewares
        - dtos
        - validators

    * In short, the interface layer “handles communication with the outside world” – parsing requests and formatting responses – without containing business logic

* what is DTO 
    DTO (Data Transfer Object) is a plain object used to transfer only necessary data between layers ( Controller <--> Use-case or between server and client), without exposing internal models or logic. ( It’s like a filtered, shaped version of data — used for input or output.)

* Why use DTOs?
    - Prevents exposing internal database models (like Mongoose schemas) and Enables transformation (e.g. remove password, format date, rename fields)
    - Makes it easy to validate and sanitize incoming data
    - Improves decoupling between layers ( that is the response from db will direct will not comunicate with api response (res.json(userData) ) in between dto comes  )

*  
