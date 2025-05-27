# Infrastructure (also known as frameworks-drivers )

* src/infrastructure:
    - **[Outer Most layer]**
    - The Infrastructure Layer exists to **<u>connect your core application (domain + use cases) to external technologies,</u>** like databases, APIs, file systems, or email providers

    - In Clean Architecture, inner layers only know about interfaces, not how those interfaces work.The Infrastructure Layer is where those interfaces actually come to life.

    - Infrastructure logic is "how the app connects to the outside world to do it
            - Talking to databases (MongoDB, PostgreSQL, etc.)
            - Integrating with external APIs (like Twilio, Stripe, Firebase)
            - Frameworks like Mongoose, Express, Nodemailer, etc.
            - Implementing interfaces from the Domain layer (like IUserRepository)
            - File handling, email sending, authentication libraries, etc.

