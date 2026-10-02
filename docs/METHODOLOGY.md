# Metodología editorial

## Fuente autoritativa

La única fuente válida para una ficha es una página controlada por la plataforma descrita. Blogs, foros, capturas, respuestas de asistentes y artículos periodísticos pueden servir para detectar un posible cambio, pero no para publicarlo como requisito.

## Verificación

Cada registro debe incluir:

1. URL oficial directa.
2. Título de la fuente.
3. Idioma de la fuente.
4. Fecha de revisión manual.
5. Estado `verified` o `unverified`.
6. Región y límites de aplicación.

La revisión manual confirma que la fuente respalda las acciones, solicitantes, requisitos y advertencias resumidos. La prueba automática solo comprueba disponibilidad técnica; no valida el significado del contenido.

## Reglas de redacción

- Redactar resúmenes propios y breves.
- No copiar formularios ni políticas completas.
- Distinguir `puede solicitar` de `recibirá acceso`.
- No convertir una posibilidad en garantía.
- No generalizar una regla nacional a otros países.
- No recomendar iniciar sesión con credenciales de otra persona.
- No publicar correos postales o electrónicos sin confirmarlos en la fuente vigente; es preferible dirigir al usuario a la página oficial.

## Fuente caída o ambigua

Si una fuente deja de abrir, cambia de dominio o ya no respalda la ficha:

1. cambiar `verification.status` a `unverified`;
2. describir el problema en un cambio versionado;
3. no reemplazar el requisito mediante inferencia;
4. restaurar `verified` solo después de revisión manual de una fuente oficial vigente.

## Mantenimiento

- Ejecutar la revisión automática mensualmente.
- Revisar manualmente las diez fichas al menos cada tres meses.
- Revisar de inmediato una ficha cuando llegue evidencia oficial de cambio.
- Mantener la V1 en diez plataformas mientras una sola persona no pueda revisar más con rigor.
