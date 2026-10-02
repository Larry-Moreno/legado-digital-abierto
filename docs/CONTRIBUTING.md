# Contribuir

Se aceptan correcciones de políticas, nuevas fuentes oficiales, mejoras de accesibilidad, traducciones y pruebas.

## Regla de privacidad

No publiques nombres, correos, usuarios, certificados de defunción, identificaciones, testamentos, números de cuenta, capturas de formularios completados ni detalles de un caso real. Un issue con datos personales debe cerrarse y su contenido debe retirarse mediante las herramientas de moderación de la plataforma.

## Actualizar una ficha

1. Abre la URL oficial existente y comprueba que sigue vigente.
2. Modifica únicamente los campos respaldados por esa fuente.
3. Actualiza `verification.reviewedAt` y `lastDatasetReview`.
4. Mantén el resumen en palabras propias.
5. Ejecuta `npm install`, `npm run check` y `npm run check:links`.
6. Explica qué cambió y cita la URL oficial en el pull request.

## Añadir una plataforma

Una plataforma nueva debe tener un procedimiento oficial específico para personas fallecidas. No se aceptan instrucciones basadas solo en el cierre ordinario de cuentas, soporte informal o suposiciones legales.

La propuesta debe incluir una ficha completa conforme a `data/platforms.schema.json`, una fuente oficial y una región explícita. El mantenedor puede rechazarla si amplía la carga de revisión más allá de lo sostenible.

## Traducciones

Las traducciones deben conservar el significado y los límites regionales. No traduzcas nombres oficiales de documentos como si fueran equivalentes jurídicos entre países.

## Desarrollo

El proyecto no usa dependencias de producción. Las dependencias de desarrollo validan el contrato de datos y no se publican en el sitio. Mantén esa propiedad salvo que una necesidad verificable justifique cambiarla. No agregues analítica, cuentas, formularios, backend ni almacenamiento de documentos.

Los cambios deben incluir una prueba cuando modifiquen datos, generación de páginas o comportamiento. `docs/` es el artefacto publicado y debe regenerarse con `npm run build`.
