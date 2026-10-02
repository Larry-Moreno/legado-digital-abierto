# Legado Digital Abierto

Directorio estático y conjunto de datos abierto sobre los procedimientos oficiales para gestionar cuentas digitales de personas fallecidas.

[Abrir el sitio](https://larry-moreno.github.io/legado-digital-abierto/) · [Ver los datos](data/platforms.es.json) · [Informar una actualización](https://github.com/Larry-Moreno/legado-digital-abierto/issues/new?template=platform-update.yml)

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

`npm run check` valida sintaxis, el JSON Schema real, datos, controles estáticos, documentación generada y las diez fichas enlazables. También genera `docs/`, que es exactamente la carpeta publicada por GitHub Pages. `npm run check:links` consulta las diez fuentes oficiales; respuestas 401, 403, 405 o 429 se registran como bloqueo automatizado y requieren revisión manual.

Para revisar el artefacto publicable:

```bash
npm run preview
```

La automatización alojada está temporalmente desactivada porque GitHub no inicia jobs en la cuenta del mantenedor. La validación reproducible vigente es local; no se afirma que exista CI operativa.

## Estructura

```text
data/platforms.es.json       Datos publicados
data/platforms.schema.json   Contrato del conjunto
scripts/                     Build, servidor y revisión de enlaces
tests/                       Pruebas de datos, interfaz y build público
docs/                        Artefacto estático publicado por GitHub Pages
.github/                     Formularios y plantillas de colaboración
```

## Licencias

- Código: MIT, ver `LICENSE`.
- Datos y resúmenes editoriales: CC BY 4.0, ver `LICENSE-DATA.md`.
- Las marcas, páginas enlazadas y textos originales pertenecen a sus titulares. El proyecto publica resúmenes propios y enlaces, no copias de esas políticas.

## Contribuir

Lee `CONTRIBUTING.md` y `METHODOLOGY.md`. No incluyas datos personales, documentos reales, credenciales ni detalles de casos particulares en issues o pull requests.
