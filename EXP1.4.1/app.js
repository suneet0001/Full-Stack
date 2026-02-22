const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const FILE = "employees.json";

let employees = [];

if (fs.existsSync(FILE)) {
  employees = JSON.parse(fs.readFileSync(FILE));
}

function saveData() {
  fs.writeFileSync(FILE, JSON.stringify(employees, null, 2));
}

function menu() {
  console.log("\n--- Employee Management System ---");
  console.log("1. Add Employee");
  console.log("2. View Employees");
  console.log("3. Update Employee");
  console.log("4. Delete Employee");
  console.log("5. Exit");

  rl.question("Choose an option: ", choice => {
    switch (choice) {
      case "1": addEmployee(); break;
      case "2": viewEmployees(); break;
      case "3": updateEmployee(); break;
      case "4": deleteEmployee(); break;
      case "5": rl.close(); break;
      default: menu();
    }
  });
}

function addEmployee() {
  rl.question("Enter ID: ", id => {
    rl.question("Enter Name: ", name => {
      rl.question("Enter Department: ", dept => {
        rl.question("Enter Salary: ", salary => {
          if (!id || !name || !dept || isNaN(salary)) {
            console.log("Invalid Input");
            return menu();
          }
          employees.push({ id, name, dept, salary: Number(salary) });
          saveData();
          console.log("Employee Added");
          menu();
        });
      });
    });
  });
}

function viewEmployees() {
  if (employees.length === 0) {
    console.log("No Records Found");
  } else {
    console.table(employees);
  }
  menu();
}

function updateEmployee() {
  rl.question("Enter Employee ID to Update: ", id => {
    const emp = employees.find(e => e.id === id);
    if (!emp) {
      console.log("Employee Not Found");
      return menu();
    }

    rl.question("New Name: ", name => {
      rl.question("New Department: ", dept => {
        rl.question("New Salary: ", salary => {
          if (name) emp.name = name;
          if (dept) emp.dept = dept;
          if (!isNaN(salary)) emp.salary = Number(salary);

          saveData();
          console.log("Employee Updated");
          menu();
        });
      });
    });
  });
}

function deleteEmployee() {
  rl.question("Enter Employee ID to Delete: ", id => {
    const index = employees.findIndex(e => e.id === id);
    if (index === -1) {
      console.log("Employee Not Found");
    } else {
      employees.splice(index, 1);
      saveData();
      console.log("Employee Deleted");
    }
    menu();
  });
}

menu();
