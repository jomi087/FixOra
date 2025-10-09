# Thing i have learned in this project
__________________________________________________________________________________
## Front-End
-----------------------------------------------------------------------------------
* dynamic css styling && dark anf light mode

* **importance or A11Y (Accessability)**

* Maxlength property in input 

* **input = 'numeric' property for show a numeric keypad for mobile user** 

* **how to go previous page [navigate(-1)]**

* useLocation() hook to get current page location (used for sidebar Active logic)

* side bar responsive

* shared component and re-usable componet

* created re-usabel Component
    - signIn, signUp, Otp,

* useParams() is for path parmas  [ "/signIn/:role => signIn/customer" ]

* useSearchParams() is for Query parameters [ "/signIn?role=customer"]

* how to config axios and how to  use axios interceptor

* .filter(Boolean) a shortend verson of .filter(item => Boolean(item)) 
    - Boolean() - it's a built-in JavaScript function (constructor) it converts ny value to its truthy or falsy equivalent:
    
* how to get Location coordinates with browser help (navigator.geoLocation)

* Purpose and useCase of  debouncing  for optimising

* Reacts New Hook -> useTransition()  [not implimented ]

* FormData can only store strings, Blobs, or Files

* purpose of lookup 

*  scinario of facet and what it is -> $facet allows you to run multiple pipelines in parallel on the same input and combine their results into a single document.

* Why we use http.createServer(app) instead of app.listen()
    _____________________
    - While app.listen(port) works fine for normal REST APIs,
        - it's just a shorthand for:
            - const server = http.createServer(app);
            - server.listen(port);

    - However, app.listen() does NOT expose the `server` instance,
        - which is required if you need to:
            - Attach Socket.IO or WebSocket
            - Gracefully shut down the server (server.close())
            - Customize low-level behavior (e.g., HTTPS, timeouts)

    - Therefore, we use:
        - const server = http.createServer(app);
        - server.listen(port);
        
* Another Rule of RestAPI 
    - Resource Identification Happens in the URL via Path Params 
        logic for geting a specific resource its identification must not be passed by body instead it should be pass via url that also  via path Params not by query parm 
            - Path param → when identifying a single, specific resource.
            - Query param → when filtering, sorting, or paginating collections.
        
    - Body is for Changes, Not Identification (in body onlythe data which need to be updates need to passed via body)

_______________________________________________________________________
## Node (express) version
-----------------------------------------------------------------------

* advance version of mongodb connection with ( Retry , Fallback URI )

* DIP -> dependency investion principle
    - 	High-level modules should not depend on low-level modules. Both should depend on abstractions./

* how to restrict incoming request data size in Express (for both JSON and URL-encoded bodies).
    -  helps protect the server from large payload (stop users from sending too much data to server) 

* ocp Open/Close principle in Solid

* Use of Refresh Token and Its Purpose

* looger's 
    - Morgan → for logging incoming HTTP requests
    - Winston → for logging all other logs (errors, warnings, custom debug/info logs)
_______________________________________________________________________
## Modules 
-----------------------------------------------------------------------
* **lucid-react** another module for icon
* **swiper** for slider ui
* **Spline** for intigrating 3d object 
* **shadcn** for  customizable UI components [ this library built with: React 
Tailwind, CSS Radix, UI (for accessibility and behavior) ,TypeScript ]
* **data-fns** for data time etc.... (more controllable)
_______________________________________________________________________
## Good Parctice
------------------------------------------------------------------------
* wrtiting static string all in one basket [ like Messages,StatusCode ]
* env separation for production and for developments
* use looger for better debbuging
_______________________________________________________________________
## others
------------------------------------------------------------------------
    what is SSO (Single-Sign-On) and what is OAUTH 
    status code 204(no content) pecularities
    

