# Application Layer (also know as Use-Case layer, interactors layer)

* src/application/ :
    - **Application Business Rules [second last inner layer]**
        - The Application Layer contains the business rules of your app — not core domain logic (like User), but actions or operations the app performs with that domain.
        - also it contains a service folder were it is user to write  the redundant method in the buiness logic like gernating otp , calulating sales 

    * Each use case (often a class like CreateUserUseCase) orchestrates domain entities and calls repository interfaces to perform actions
        -  For example, a UserService or CreateUserUseCase connects to the repository interfaces , which are abstract (usually defined in the domain layer [ ie domain/repostry/interfaces ]),
        - by: Calling methods like userRepository.create(user) or userRepository.findById(id) to persist or retrieve entities.

In Clean Architecture, there are actually two common approaches to placing DTOs, and both are valid depending on your specific needs:

**Interface/Presentation Layer DTOs** 
Used for transforming data between external requests and your application
Handles input validation and data shaping for API requests/responses
Located in interfaces/dtos/ (what we did)

**Application Layer DTOs**:
Used for transferring data between use cases and repositories
Handles internal data transformation between layers
Would be located in application/dtos/
