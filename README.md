For Running-> react: npm run dev
             dotnet: dotnet run

*******************************************************
In the backend folder type cmds below:
" dotnet new webapi -n CrudApi --framework net8.0 "

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


*******************************
React (Frontend)
        ↓ HTTP (Axios)
ASP.NET Core API (Controller)
        ↓
Repository
        ↓
Dapper
        ↓
MySQL Database
***********************************
Excellent question 👌🔥
Now you’re thinking like a real developer.

I’ll explain the complete flow of your full-stack app from browser → React → API → Dapper → MySQL → back to UI.

🧠 High Level Architecture
React (Frontend)
        ↓ HTTP (Axios)
ASP.NET Core API (Controller)
        ↓
Repository
        ↓
Dapper
        ↓
MySQL Database


Now let’s go step-by-step.

🟢 1️⃣ When You Open http://localhost:5173

React loads.

main.jsx

This is the entry point.

ReactDOM.createRoot(document.getElementById("root")).render(<App />);


👉 It renders <App /> component.

🟢 2️⃣ App.jsx Runs

Inside App.jsx:

useEffect(() => {
  api.get("/user")
    .then(res => setUsers(res.data))
}, []);

What happens?

useEffect runs once (because [])

It calls:

GET http://localhost:5144/api/user


(using Axios instance from api.js)

🟢 3️⃣ Axios (api.js)

Your api.js:

export default axios.create({
  baseURL: "http://localhost:5144/api"
});


So when you do:

api.get("/user")


It becomes:

http://localhost:5144/api/user

🟢 4️⃣ Request Hits ASP.NET Backend

Now backend receives:

GET /api/user


It matches this controller:

[Route("api/[controller]")]
public class UserController : ControllerBase


[controller] = user

So route becomes:

api/user

🟢 5️⃣ Controller Executes
[HttpGet]
public async Task<IActionResult> GetUsers()
{
    var users = await _repository.GetAll();
    return Ok(users);
}


Controller:

Calls repository

Gets users

Returns JSON response

🟢 6️⃣ Repository Executes

Inside UserRepository:

public async Task<IEnumerable<User>> GetAll()
{
    var query = "SELECT * FROM Users";
    using var connection = _context.CreateConnection();
    return await connection.QueryAsync<User>(query);
}

What happens here?

_context.CreateConnection()
→ Opens MySQL connection

QueryAsync<User>()
→ Dapper runs SQL query
→ Maps each row to User object

frontend/
└── crud-frontend/
    ├── node_modules/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── AdminFooter.jsx
    │   │   │   ├── AdminHeader.jsx
    │   │   │   └── AdminHome.jsx
    │   │   ├── user/
    │   │   │   ├── UserFooter.jsx
    │   │   │   ├── UserHeader.jsx
    │   │   │   └── UserHome.jsx
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
    └── vite.config.json



backend/
└── CrudApi/
    ├── bin/
    │   └── Debug/
    │       └── net8.0/
    ├── Controllers/
    │   └── UserController.cs
    ├── Data/
    │   ├── DapperContext.cs
    │   └── DbInitializer.cs
    ├── DTOs/
    │   ├── LoginDto.cs
    │   └── RegisterDto.cs
    ├── Models/
    │   └── User.cs
    ├── obj/
    ├── Properties/
    ├── Repositories/
    │   └── UserRepository.cs
    ├── Services/
    ├── appsettings.Development.json
    ├── appsettings.json
    ├── CrudApi.csproj
    ├── CrudApi.http
    └── Program.cs


##################################################

frontend/
└── crud-frontend/
    ├── node_modules/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── AdminFooter.jsx
    │   │   │   ├── AdminHeader.jsx
    │   │   │   └── AdminHome.jsx
    │   │   └── user/
    │   │       ├── expense/
    │   │       │   ├── AddExpense.jsx
    │   │       │   ├── EditExpense.jsx
    │   │       │   └── ExpenseList.jsx
    │   │       ├── income/
    │   │       │   ├── AddIncome.jsx
    │   │       │   ├── EditIncome.jsx
    │   │       │   └── IncomeList.jsx
    │   │       ├── ForgotPassword.jsx
    │   │       ├── ResetPassword.jsx
    │   │       ├── Signin.jsx
    │   │       ├── Signup.jsx
    │   │       ├── UserFooter.jsx
    │   │       ├── UserHeader.jsx
    │   │       ├── UserHome.jsx
    │   │       ├── VerifyOtp.jsx
    │   │       └── Welcome.jsx
    │   ├── api.js
    │   ├── App.css
    │   ├── App.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   ├── output.css
    │   ├── .gitignore
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── postcss.config.js
    │   ├── README.md
    │   ├── tailwind.config.js
    │   └── vite.config.js



#########################################################################3

    backend/
└── CrudApi/
    ├── bin/
    ├── Controllers/
    │   ├── DashboardController.cs
    │   ├── ExpenseController.cs
    │   ├── IncomeController.cs
    │   └── UserController.cs
    ├── Data/
    │   ├── DapperContext.cs
    │   └── DbInitializer.cs
    ├── DTOs/
    │   ├── DashboardDto.cs
    │   ├── ExpenseDto.cs
    │   ├── ForgotPasswordDto.cs
    │   ├── IncomeDto.cs
    │   ├── LoginDto.cs
    │   ├── RegisterDto.cs
    │   ├── ResetPasswordDto.cs
    │   └── VerifyOtpDto.cs
    ├── Models/
    │   ├── Expense.cs
    │   ├── Income.cs
    │   └── User.cs
    ├── obj/
    ├── Properties/
    ├── Repositories/
    │   ├── DashboardRepository.cs
    │   ├── ExpenseRepository.cs
    │   ├── IncomeRepository.cs
    │   └── UserRepository.cs
    ├── Services/
    │   ├── EmailService.cs
    │   └── IEmailService.cs
    ├── appsettings.Development.json
    ├── appsettings.json
    ├── CrudApi.csproj
    ├── CrudApi.http
    └── Program.cs