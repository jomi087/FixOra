#  Domain  layer  (also know as enitity section)
* src/domain/ :
    - **EnterPrise Buisnesss Rule [inner most layer]** 
    - Contains the core business entities (plain TypeScript classes or interfaces) and domain logic, independent of any frameworks or external tech 

- By design , Domain entities do not import Mongoose or other infrastructure – they express business rules only
    an entity must me always indipendent 

- For example, a User entity class lives here (e.g. src/domain/entities/User.ts). This layer also holds repository interfaces (e.g. IUserRepository.ts ) which define domain-centric operations without tying to a database implementation


# Why the name “Repository” ?
* A repository acts as a mediator between the domain layer and the data mapping layer (e.g., a database like MongoDB). It provides a clean interface for the use cases to perform data operations, without exposing details of the database (Mongoose, SQL, etc.).


