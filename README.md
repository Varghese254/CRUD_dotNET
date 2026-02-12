first commit msg
in the backend folder type cmds below:

dotnet new webapi -n CrudApi --framework net8.0

backend/
   └── CrudApi/

cd CrudApi

dotnet add package Dapper
dotnet add package MySql.Data
dotnet add package Swashbuckle.AspNetCore


Inside CrudApi create folders:
CrudApi/
 ├── Controllers/
 ├── Models/
 ├── DTOs/
 ├── Data/
 ├── Repositories/
 └── Services/

mkdir Models DTOs Data Repositories Services


🟢 STEP 11 — Setup React (Inside frontend)

cd ../../frontend
npm create vite@latest

Choose:
Name: crud-frontend
React
JavaScript

cd crud-frontend
npm install
npm install axios
