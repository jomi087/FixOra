# Application Layer (also know as Use-Case layer, interactors layer)

* src/application/ :
    - **Application Business Rules [second last inner layer]**
    - Contains classes that implement the business use cases of the system

    * Each use case (often a class like CreateUserUseCase) orchestrates domain entities and calls repository interfaces to perform actions
        -  For example, a UserService or CreateUserUseCase connects to the repository interfaces , which are abstract (usually defined in the domain layer [ ie domain/repostry/interfaces ]),
        - by: Calling methods like userRepository.create(user) or userRepository.findById(id) to persist or retrieve entities.


    * This layer also houses DTOs (Data Transfer Objects) or “request/response models” under application/dtos/, which decouple external I/O from domain models
    . DTOs are used as input/output for use cases, ensuring the domain stays separate from the API contracts
