# Legado Digital Abierto

Directorio estático y conjunto de datos abierto sobre los procedimientos oficiales para gestionar cuentas digitales de personas fallecidas.

## Alcance

- Diez plataformas iniciales con fuente oficial y fecha de revisión.
- Búsqueda y filtro por acción.
- Lista imprimible que se genera en el navegador.
- Sin cuentas, backend, analítica, formularios propios ni envío de documentos.
- Datos en español preparados para traducciones.

No es asesoría legal y no garantiza que una solicitud sea aprobada.

## Ejecutar localmente

Requiere Node.js 22 o posterior.

```bash
npm start
```

Abre `http://127.0.0.1:4173`. Abrir `index.html` directamente no funciona en algunos navegadores porque estos bloquean la carga local del JSON.

## Validar

```bash
npm run check
npm run check:links
```

`npm run check` valida sintaxis, datos, controles estáticos de seguridad y accesibilidad, y genera `dist/`. `npm run check:links` consulta las diez fuentes oficiales; respuestas 401, 403, 405 o 429 se registran como bloqueo automatizado y requieren revisión manual.

## Estructura

```text
data/platforms.es.json       Datos publicados
data/platforms.schema.json   Contrato del conjunto
scripts/                     Build, servidor y revisión de enlaces
tests/                       Pruebas sin dependencias externas
.github/                     CI y formulario seguro de contribución
```

## Licencias

- Código: MIT, ver `LICENSE`.
- Datos y resúmenes editoriales: CC BY 4.0, ver `LICENSE-DATA.md`.
- Las marcas, páginas enlazadas y textos originales pertenecen a sus titulares. El proyecto publica resúmenes propios y enlaces, no copias de esas políticas.

## Contribuir

Lee `CONTRIBUTING.md` y `METHODOLOGY.md`. No incluyas datos personales, documentos reales, credenciales ni detalles de casos particulares en issues o pull requests.
