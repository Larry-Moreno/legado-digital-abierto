# Seguridad

## Alcance

El sitio es estático y no procesa solicitudes ni documentos. Sus riesgos principales son enlaces oficiales sustituidos, contenido editorial incorrecto, inyección mediante datos contribuidos y dependencias futuras innecesarias.

## Controles

- Dominios oficiales permitidos comprobados por pruebas.
- Renderizado de los datos mediante `textContent`, no HTML inyectado.
- Enlaces externos aislados con `noopener noreferrer`.
- Política de contenido y referencia declarada en las páginas públicas.
- Servidor local con prevención de traversal y cabeceras básicas.
- Sin scripts de terceros, analítica, autenticación o backend.
- Validación local reproducible de sintaxis, esquema, build y pruebas.

## Reportar un problema

Usa el [reporte privado de vulnerabilidades de GitHub](https://github.com/Larry-Moreno/legado-digital-abierto/security/advisories/new). No abras un issue público con un exploit, documentos personales, credenciales ni detalles de una víctima.

El reporte debe describir el problema con datos ficticios. No adjuntes documentos reales ni información de una persona fallecida o de su familia.

## No cubierto

El proyecto no puede resolver disputas legales, recuperar cuentas, verificar identidades ni garantizar la actuación de una plataforma.
