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

STEP 3 — Setup MySQL Database->
Open MySQL and create database:
CREATE DATABASE crud_db;

USE crud_db;
CREATE TABLE Users (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100),
    Email VARCHAR(100)
);


Inside appsettings.json->
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;port=3306;database=crud_db;user=root;password=yourpassword;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  },
  "AllowedHosts": "*"
}


backend/
 └── CrudApi/
      ├── Controllers/
      ├── Data/                👈 create this
      │    └── DapperContext.cs
      ├── Models/
      ├── Repositories/
      ├── Program.cs
      └── CrudApi.csproj

dotnet add package Dapper
dotnet add package MySqlConnector

STEP 3 — Create Other Files
cd Models
type nul > User.cs


CrudApi/
 ├── Data/
 │    └── DapperContext.cs
 ├── Models/
 │    └── User.cs
 ├── Repositories/
 │    └── UserRepository.cs
 ├── Controllers/
 │    └── UserController.cs
 ├── Program.cs
 └── CrudApi.csproj





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

Inside src folder create:
src/api.js


npm run dev


http://localhost:5144/swagger

Use POST /api/user

Example body:

{
  "name": "John",
  "email": "john@example.com"
}

Then refresh React page->
You should see:
John - john@example.com