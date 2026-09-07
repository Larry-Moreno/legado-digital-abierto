# Seguridad

## Alcance

El sitio es estático y no procesa solicitudes ni documentos. Sus riesgos principales son enlaces oficiales sustituidos, contenido editorial incorrecto, inyección mediante datos contribuidos y dependencias futuras innecesarias.

## Controles

- Dominios oficiales permitidos comprobados por pruebas.
- Renderizado de los datos mediante `textContent`, no HTML inyectado.
- Enlaces externos aislados con `noopener noreferrer`.
- Servidor local con prevención de traversal y cabeceras básicas.
- Sin scripts de terceros, analítica, autenticación o backend.
- CI con permisos de solo lectura.

## Reportar un problema

Cuando exista un repositorio público, usa el reporte privado de vulnerabilidades de GitHub si está habilitado. No abras un issue público con un exploit, documentos personales, credenciales ni detalles de una víctima.

Hasta que exista un canal privado publicado, conserva el reporte y no compartas material sensible con el proyecto.

## No cubierto

El proyecto no puede resolver disputas legales, recuperar cuentas, verificar identidades ni garantizar la actuación de una plataforma.
