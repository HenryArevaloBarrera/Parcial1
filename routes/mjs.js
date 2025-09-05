import express from "express";
import fs from "fs";
import path from "path";
import departments from "../resources/departments.json" with { type: "json" };
import towns from "../resources/towns.json" with { type: "json" };

const router = express.Router();

const depPath = path.resolve("resources/departments.json");
const townsPath = path.resolve("resources/towns.json");

function saveDepartments(data) {
  fs.writeFileSync(depPath, JSON.stringify(data, null, 2));
}

function saveTowns(data) {
  fs.writeFileSync(townsPath, JSON.stringify(data, null, 2));
}

router.get("/", (req, res) => {
  res.render("index.ejs", {
    title: "Listado de Datos",
    departments,
    towns
  });
});

router.get("/towns/new", (req, res) => {
  res.render("add-town.ejs", {
    title: "Nuevo Municipio",
    departments
  });
});

router.post("/towns/new", (req, res) => {
  const { code, name, department } = req.body;
  const newTown = { code, department, name };
  towns.push(newTown);
  saveTowns(towns);
  res.redirect("/");
});

router.post("/departments/new", (req, res) => {
  const { code, name } = req.body;
  const newDep = { code, name };
  departments.push(newDep);
  saveDepartments(departments);
  res.redirect("/test");
});

router.get("/towns/:depCode", (req, res) => {
  const depCode = req.params.depCode;
  const filtered = towns.filter(t => t.department === depCode);
  res.json(filtered);
});

router.get("/filter", (req, res) => {
  const depCode = req.query.depCode;
  let filteredTowns = towns;

  if (depCode) {
    filteredTowns = towns.filter(t => t.department === depCode);
  }

  res.render("filter.ejs", {
    title: "Filtro de Municipios",
    departments,
    towns: filteredTowns,
    depCode
  });
});

export default router;
