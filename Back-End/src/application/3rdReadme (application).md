# Application Layer (also know as Use-Case layer, interactors layer)

* src/application/ :
    - **Application Business Rules [second last inner layer]**
        - The Application Layer contains the business rules of your app — not core domain logic (like User), but actions or operations the app performs with that domain.
        - also it contains a service folder were it is user to write  the redundant method in the buiness logic like gernating otp , calulating sales 

    * Each use case (often a class like CreateUserUseCase) orchestrates domain entities and calls repository interfaces to perform actions
        -  For example, a UserService or CreateUserUseCase connects to the repository interfaces , which are abstract (usually defined in the domain layer [ ie domain/repostry/interfaces ]),
        - by: Calling methods like userRepository.create(user) or userRepository.findById(id) to persist or retrieve entities.



