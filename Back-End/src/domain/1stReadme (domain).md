#  Domain  layer  (also know as enitity section) 
    
* src/domain/ :
    - **EnterPrise Buisnesss Rule [inner most layer]** 
    - Contains the core business entities (plain TypeScript classes or interfaces) and domain logic, independent of any frameworks or external tech 
    -It just defines: What your app does and **what rules it follows.**

* **Entity** ( Here we deffine the structure and  its behavior(optional))

    - An Entity is a file or class that defines the shape and rules of your data
    [ for adding behaviour your structure must be implimented through a class here  i have done with interface (which is a easier way but has some issues) were i can only put stucture not behaviour , an recommended way is implimenting with class ]

    - It’s part of the domain layer in Clean Architecture. and this is a low level module so it must be always indipendent

* **Interface** (there is an another strucuture or an abstract rules your app needs, without writing the actual logic yet rule (defined Below)  )
    
    - Repository interfaces – Defines Interfaces for DB ie,define database-related methods: 
    - Service interfaces    – define logic you want to plug in later (e.g. email sender, OTP generator).
---
### What's Repository ?
* A repository acts as a mediator between the domain layer and the data mapping layer (e.g., a database like MongoDB). It provides a clean interface for the use cases to perform data operations, without exposing details of the database (Mongoose, SQL, etc.)

* In simple words -> 
    - Think of a repository like a helper that talks to the database for you 
        > ie, here we write the method which we use to communicate with db like findOne , findById etc...., 
    - Instead of putting MongoDB code everywhere in your app, you group it inside a "repository" file. 
        > you can find repository folder in infrastructure <br>
            > so the repository interfaces is for database related method so it will be in repository/database folder and service interface in repository/service folder 
    
### What is an Interface for a Repository
* Before writing the actual code to talk to MongoDB, you can write down a list of functions that this helper (repository) should have. That list is called an interface




