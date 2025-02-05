-------------------
----- English -----
-------------------

Hi there! This project is a simple online chat application created by myself (alexwebdev05) with enthusiasm for
learning, not for monetary gain. The app is currently in development and may have aspects that can be
improved. I welcome you to review the code and submit pull requests to help enhance the application.

--- Overview ---
----------------

This application works in conjunction with an API and a PostgreSQL database. The API code can be found
in the SSChat-Api repository (https://github.com/alexwebdev05/SSChat-Api). For instructions on how
to set up the API to work with this application, please refer to the API documentation.

--- How the App Works ---
-------------------------

-- Screens --
The app consists of various screens where users can navigate. These include:
    Login
    Register
    Main
    Chat

Each screen has its own logil, such as functions, effects... Functions that require sending or receiveing data from
the API are imported from the /src/api directory, where you can find files with names corresponding to the screen pages.

-- UI Components --
Complex UI objects that require numerous lines of code are imported from the /src/ui directory. For
example, the inbox object, which retrieves and displays chats on the screen, can be found here.

-------------------
----- Spanish -----
-------------------

Hola, este es un chat en linea desarrollado por mi (alexwebdev05) con ganas de aprender y no por dinero. Actualmente
la app esta en desarrollo por lo cual podria tener cambios significativos. Os invito a revisar el codigo y hacer
pull requests para mejorar el funcionamiento de la aplicacion.

--- Resumen ---
---------------

Esta aplicacion funciona en conjunto con una API y una base de datos PostgreSQL. La API es SSChat-api y esta
disponible en mi github (https://github.com/alexwebdev05/SSChat-Api). Si necesitas saber como hacer funcionar
tu api en conjunto con esta aplicacion, puedes encontrar la documentacion en el repositorio.

--- Como funciona la aplicacion ---
-----------------------------------

-- Pantallas --
La aplicacion funciona en base a unas pantallas por las que puede navegat: 
    Login
    Register
    Main
    Chat

Cada pantalla tiene su propia logica, ya sean funciones, effects... En cambio, las funciones que requieren enviar
o recivir informacion de la API son importadas del directorio /src/api, en el que se pueden encontrar archivos con
los nombres de las pantallas que las requieren.

-- Componentes UI --
Loc componentes UI mas complejos requieren de bastantes lineas de codigo, lo que puede provocar que leer el codigo de una
pantalla sea tedioso, por lo cual esos componentes se encontraran en el directorio /src/ui.