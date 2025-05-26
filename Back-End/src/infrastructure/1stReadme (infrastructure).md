# Infrastructure (also known as frameworks-drivers )

* src/frameworks-drivers/database/ :
    - **[Outer Most layer]**
    -  Contains all framework and technical details. 
        - This includes the database connection and Mongoose models/schemas that map onto domain entities
    -  The Mongoose model imports the domain type (e.g. User interface) to ensure the schema matches the entity shape
    - The infrastructure/repositories/ folder holds concrete repository implementations (e.g. MongoUserRepository.ts) that implement the domain repository interfaces using Mongoose queries

    . Other technical services (email, payments, caching, etc.) go under infrastructure/services/. Shared configuration (environment variables, constants) can be in infrastructure/config/ The top-level server.ts (outside these folders) is the composition root that initializes Express, connects middleware,
    All external dependencies (Express, Mongoose, etc.) are only referenced in this outer layer

