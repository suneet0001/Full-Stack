const fs = require("fs");

const FILE = "./employees.json";

function readData() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
}

function saveData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  let employees = readData();

  if (req.method === "GET") {
    return res.status(200).json(employees);
  }

  if (req.method === "POST") {
    const { id, name, dept, salary } = req.body;
    employees.push({ id, name, dept, salary });
    saveData(employees);
    return res.status(201).json({ message: "Employee Added" });
  }

  if (req.method === "PUT") {
    const { id, name, dept, salary } = req.body;
    const emp = employees.find(e => e.id === id);
    if (!emp) return res.status(404).json({ message: "Not Found" });

    if (name) emp.name = name;
    if (dept) emp.dept = dept;
    if (salary) emp.salary = salary;

    saveData(employees);
    return res.status(200).json({ message: "Updated" });
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    employees = employees.filter(e => e.id !== id);
    saveData(employees);
    return res.status(200).json({ message: "Deleted" });
  }
}
