# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



CRUD_DOTNET/
└── backend/
    └── CrudApi/
        ├── bin/
        ├── Controllers/
        │   └── UserController.cs
        ├── Data/
        │   └── DapperContext.cs
        ├── DTOs/
        ├── Models/
        │   └── User.cs
        ├── obj/
        ├── Properties/
        │   └── launchSettings.json
        ├── Repositories/
        │   └── UserRepository.cs
        ├── Services/
        ├── appsettings.Development.json
        ├── appsettings.json
        ├── CrudApi.csproj
        ├── CrudApi.http
        └── Program.cs



frontend/
└── crud-frontend/
    ├── node_modules/
    ├── public/
    │   └── vite.svg
    ├── src/
    │   ├── assets/
    │   │   └── react.svg
    │   ├── pages/
    │   │   ├── Signin.jsx
    │   │   ├── Signup.jsx
    │   │   └── Welcome.jsx
    │   ├── api.js
    │   ├── App.css
    │   ├── App.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   └── output.css
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── README.md
    ├── tailwind.config.js
    └── vite.config.js