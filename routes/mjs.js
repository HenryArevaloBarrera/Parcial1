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

// Página principal
router.get("/", (req, res) => {
  res.render("index.ejs", {
    title: "Listado de Datos",
    departments,
    towns
  });
});

// Formulario para nuevo municipio
router.get("/towns/new", (req, res) => {
  res.render("add-town.ejs", {
    title: "Nuevo Municipio",
    departments,
    message: null
  });
});

// Guardar nuevo municipio con verificación
router.post("/towns/new", (req, res) => {
  const { code, name, department } = req.body;

  const exists = towns.some(t => t.code === code);
  if (exists) {
    return res.render("add-town.ejs", {
      title: "Nuevo Municipio",
      departments,
      message: "⚠️ El código de municipio ya existe. Ingrese otro."
    });
  }

  const newTown = { code, department, name };
  towns.push(newTown);
  saveTowns(towns);

  res.render("add-town.ejs", {
    title: "Nuevo Municipio",
    departments,
    message: "✅ Municipio agregado correctamente."
  });
});

// Guardar nuevo departamento con verificación
router.post("/departments/new", (req, res) => {
  const { code, name } = req.body;

  const exists = departments.some(d => d.code === code);
  if (exists) {
    return res.render("index.ejs", {
      title: "Listado de Datos",
      departments,
      towns,
      message: "⚠️ El código de departamento ya existe. Ingrese otro."
    });
  }

  const newDep = { code, name };
  departments.push(newDep);
  saveDepartments(departments);

  res.render("index.ejs", {
    title: "Listado de Datos",
    departments,
    towns,
    message: "✅ Departamento agregado correctamente."
  });
});

// Municipios por departamento
router.get("/towns/:depCode", (req, res) => {
  const depCode = req.params.depCode;
  const filtered = towns.filter(t => t.department === depCode);
  res.json(filtered);
});

// Filtro de municipios
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
router.post("/towns/delete/:code", (req, res) => {
  const code = req.params.code;

  const index = towns.findIndex(t => t.code === code);
  if (index !== -1) {
    towns.splice(index, 1);
    saveTowns(towns);
  }

  res.redirect("/test");
});


router.get("/towns/edit/:code", (req, res) => {
  const code = req.params.code;
  const town = towns.find(t => t.code === code);

  if (!town) {
    return res.status(404).send("Municipio no encontrado");
  }

  res.render("edit-town.ejs", {
    title: "Editar Municipio",
    town,
    departments
  });
});

router.get("/filter", (req, res) => {
  const depCode = req.query.depCode;
  let filteredTowns = towns;

  if (depCode) {
    filteredTowns = towns.filter(t => {
      const townDep = t.department ? t.department : t.code.substring(0, 2);
      return townDep === depCode;
    });
  }

  res.render("filter.ejs", {
    title: "Filtro de Municipios",
    departments,
    towns: filteredTowns,
    depCode
  });
});

router.post("/towns/edit/:code", (req, res) => {
  const code = req.params.code;
  const { name, department } = req.body;

  const index = towns.findIndex(t => t.code === code);

  if (index !== -1) {
    towns[index].name = name;
    towns[index].department = department;
    saveTowns(towns);
  }

  res.redirect("/test");
});



export default router;
