SELECT *
FROM employee
JOIN employee ON manager_id.employee= employee.id;