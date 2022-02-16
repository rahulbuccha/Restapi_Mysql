const sql = require("./db-connection.js");
// constructor
const Employee = function (employee) {
  this.name = employee.name;
  this.salary = employee.salary;
  this.age = employee.age;
};
Employee.create = (newEmployee, result) => {
  sql.query("INSERT INTO emp1 SET ?", newEmployee, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created employee: ", { id: res.insertId, ...newEmployee });
    result(null, { id: res.insertId, ...newEmployee });
  });
};
Employee.findById = (id, result) => {
  sql.query(`SELECT * FROM emp1 WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("found employee: ", res[0]);
      result(null, res[0]);
      return;
    }
    // not found Employee with the id
    result({ kind: "not_found" }, null);
  });
};
Employee.getAll = (name, result) => {
  let query = "SELECT * FROM emp1";
  if (name) {
    query += ` WHERE name LIKE '%${name}%'`;
  }
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("emp1: ", res);
    result(null, res);
  });
};
Employee.updateById = (id, employee, result) => {
  sql.query(
    "UPDATE emp1 SET name = ?, description = ?, published = ? WHERE id = ?",
    [employee.name, employee.salary, employee.age, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found Employee with the id
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("updated employee: ", { id: id, ...employee });
      result(null, { id: id, ...employee });
    }
  );
};
Employee.remove = (id, result) => {
  sql.query("DELETE FROM emp1 WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // not found Employee with the id
      result({ kind: "not_found" }, null);
      return;
    }
    console.log("deleted employee with id: ", id);
    result(null, res);
  });
};
Employee.removeAll = result => {
  sql.query("DELETE FROM emp1", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log(`deleted ${res.affectedRows} emp1`);
    result(null, res);
  });
};
module.exports = Employee;


