# interface Layer (also know as interface Adapters layer) 

* src/interfaces/ : 
     **[2rd Outer layer]**
    - This layer bridges the outside world (HTTP) and the application. It includes controllers and routes ,middlewares etc...
    -  Controllers (in controllers/) receive Express requests, perform input validation, convert data into the use-case DTOs, call the appropriate use-case, and then send the HTTP response
    - Routes (in routes/) define the URL paths and bind them to controller methods. Express middleware (e.g. authentication, request validation, logging) can live alongside controllers (often in a middleware/ folder) as part of this layer. Optionally, one can include presenters or view models to format or shape the use-case output for the client. In Uncle Bob’s Clean Architecture, presenters format data for the UI or API response; they would be placed here (often under interfaces/presenters/)

    . (In short, the interface layer “handles communication with the outside world” – parsing requests and formatting responses – without containing business logic


.)