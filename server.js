const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = process.env.PORT || 3000;

const servidor = http.createServer((req, res) => {
  if (req.url !== "/" && req.url !== "/index.html") {
    res.writeHead(404);
    res.end("Página no encontrada");
    return;
  }

  const archivo = path.join(__dirname, "index.html");

  fs.readFile(archivo, (error, contenido) => {
    if (error) {
      res.writeHead(500);
      res.end("Error al cargar HTML");
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
    });

    res.end(contenido);
  });
});

servidor.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
