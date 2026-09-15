# PRD: Kangaroo Coach

**Estado:** borrador v0.1 · **Fecha:** 14 de septiembre de 2026 · **Autor:** coach responsable del proyecto

> Las cifras de metas y métricas de este documento son **hipótesis de trabajo**. Deben validarse con clases reales antes de tomarse como compromisos.

---

## 1. Resumen

Kangaroo Coach es una aplicación web para coaches de entrenamiento funcional. Genera en segundos una clase de 60 minutos adaptada al material disponible del gimnasio y a las restricciones físicas del grupo. Durante la clase, ayuda a controlar el tiempo y ofrece a los alumnos una vista clara de cada ejercicio, con sus variantes más fáciles y más difíciles.

El primer uso real será en el estudio de entrenamiento funcional donde trabaja el autor, con sus propios alumnos.

## 2. Problema

| Momento | Dolor actual |
|---|---|
| Antes de la clase | Planear un WOD variado toma tiempo, y hay que recordar qué material está disponible o descompuesto ese día. |
| Inicio de la clase | Explicar el WOD en la pizarra consume minutos, y los alumnos olvidan el orden o las repeticiones. |
| Durante la clase | Si la clase se retrasa, el coach improvisa recortes sobre la marcha y la clase termina tarde. |
| Alumnos con limitaciones | Adaptar ejercicios (sin impacto, sin flexión profunda, sin empuje vertical) depende de la memoria del coach en el momento. |
| Clase a clase | Es fácil repetir los mismos ejercicios varios días seguidos. |

## 3. Usuarios

| Perfil | Necesidad principal | Dispositivo típico |
|---|---|---|
| **Coach** (usuario principal) | Planear rápido, controlar el tiempo y adaptar ejercicios sin fricción. | Celular o tablet en el box |
| **Alumno** | Saber qué sigue, cuántas repeticiones hacer y cómo escalar el ejercicio. | Su celular, o una TV/pantalla del box |
| **Dueño o gerente del gimnasio** (secundario) | Clases consistentes que empiezan y terminan a tiempo, y control del estado del material. | Computadora o celular |

## 4. Objetivos y métricas (hipótesis)

| Objetivo | Métrica | Meta inicial |
|---|---|---|
| Reducir el tiempo de planeación | Minutos para dejar lista una clase | < 2 min (hoy: estimar con el coach) |
| Terminar las clases a tiempo | % de clases que terminan en ≤ 60 min | ≥ 90 % |
| Alumnos autónomos durante el WOD | Preguntas del tipo "¿qué sigue?" por clase | Tendencia a la baja tras 4 semanas |
| Variedad de estímulos | Ejercicios repetidos respecto a las 3 clases anteriores | Mínimo posible con el material activo |
| Adopción | Clases por semana dadas con la app | ≥ 3 clases/semana durante el piloto |

**Cómo se medirán en el MVP:** la app no tiene analítica ni backend, así que el piloto se mide con una bitácora simple del coach (hoja de cálculo) y una encuesta corta a los alumnos al final de cada semana.

## 5. Alcance del MVP (lo que ya existe)

1. **Planificador (`/`)**
   - Enfoque del día (Full Body / Upper Body / Lower Body), hora de inicio y modo "equipamiento limitado".
   - Restricciones del grupo: Sin Impacto, Sin Empuje Vertical, Sin Flexión Profunda.
   - Generación automática de 4 bloques: Calentamiento (10), Fuerza (20), Metabólico (20) y Cierre (10).
   - Formatos según el contexto: Circuit, A/B, AMRAP, EMOM, Parejas 1:1 y Flow.
   - Evita repetir ejercicios de las últimas 3 clases cuando hay alternativas.
   - Notas del coach por bloque.
   - Panel de bienvenida con sugerencias basadas en reglas.
   - Modal para compartir con QR (generado en el dispositivo) y enlace a la vista de alumno.
2. **Materiales (`/materiales`)**
   - Inventario con categoría, cantidad y estado (Excelente / Desgastado / Mantenimiento).
   - Activar o desactivar material del día. Solo el material activo entra al generador.
   - Alta de material personalizado. El material base no se puede borrar.
3. **Coach (`/coach`)**
   - Cronómetro por bloque con pausa, reinicio y ±1 min.
   - Checklist de ejercicios.
   - **Plan B:** si pasan 35 min y el bloque metabólico no ha iniciado, se sugiere reducirlo un 30 % para terminar a tiempo.
   - *Nota:* en el MVP el reloj de la clase es una **simulación de demostración** (1 minuto de clase por segundo real).
4. **Alumno (`/alumno`)**
   - Vista móvil con progreso personal (checklist), foto del ejercicio, músculos trabajados, regresión y progresión.
5. **General**
   - Modo claro/oscuro recordado.
   - Todos los datos se guardan en el navegador (localStorage).
   - Todas las imágenes y el código QR son locales: no se llama a servicios externos.

### Fuera de alcance en el MVP

- Cuentas de usuario, inicio de sesión y roles.
- Sincronización entre dispositivos (ver la limitación clave en §8).
- Pagos, reservas de clases o control de asistencia.
- Registro de cargas o marcas personales de los alumnos.
- Videos de los ejercicios (los enlaces existen en los datos, pero no se muestran).

## 6. Flujos principales

### 6.1 Antes de la clase (coach, 2–5 min)
1. Abre **Materiales** y desactiva lo que no está disponible hoy (roto, prestado, en mantenimiento).
2. En **Planificador** elige enfoque, hora de inicio y restricciones del grupo.
3. Pulsa **Generar clase completa**, revisa los bloques y agrega notas tácticas.
4. Si no le convence la selección, vuelve a generar.

### 6.2 Inicio de la clase (coach + alumnos)
1. El coach proyecta la **vista de Alumno** en la TV del box o la muestra desde su celular o tablet.
2. Explica el WOD usando las fotos, los músculos objetivo y las variantes de escalado.

### 6.3 Durante la clase (coach)
1. En **Coach** inicia el bloque en curso y usa el cronómetro (±1 min si hace falta).
2. Marca los ejercicios conforme avanzan.
3. Si aparece la alerta de atraso, activa **Plan B** para comprimir el bloque metabólico.

### 6.4 Después de la clase
1. La clase queda en el historial local, así que la siguiente evitará repetir ejercicios.
2. (Piloto) El coach registra en su bitácora la duración real y sus observaciones.

## 7. Requisitos

### 7.1 Funcionales (MVP)

| ID | Requisito | Prioridad |
|---|---|---|
| RF-01 | Generar una clase de 60 min en 4 bloques a partir de enfoque, restricciones y material activo. | Must |
| RF-02 | Nunca proponer ejercicios que requieran material inactivo; usar peso corporal como respaldo. | Must |
| RF-03 | Sustituir ejercicios afectados por una restricción e indicar la variante aplicada. | Must |
| RF-04 | Cronómetro por bloque con pausa, reinicio y ajuste de ±1 min. | Must |
| RF-05 | Plan B: reducir el bloque metabólico un 30 %, una sola vez por clase. | Must |
| RF-06 | Vista de alumno legible en celular, con progreso, imagen y escalado. | Must |
| RF-07 | Gestión de inventario (activar, cantidad, estado, alta y baja de material propio). | Should |
| RF-08 | Evitar repetir ejercicios de las últimas 3 clases cuando haya alternativas. | Should |
| RF-09 | Compartir la vista de alumno por QR y enlace. | Should |
| RF-10 | Sugerencias de sesión basadas en reglas. | Could |

### 7.2 No funcionales

| ID | Requisito |
|---|---|
| RNF-01 | **Móvil primero:** usable a 400 px de ancho y con una mano durante la clase. |
| RNF-02 | **Pantalla grande:** legible proyectado en una TV (textos y cronómetro de gran tamaño). |
| RNF-03 | **Costo cero:** hosting gratuito (Vercel Hobby) y sin servicios de pago. |
| RNF-04 | **Sin dependencias externas en tiempo de ejecución:** imágenes, QR y fuentes locales, para que la app funcione aunque falle un servicio de terceros. |
| RNF-05 | **Rendimiento:** páginas pre-renderizadas estáticas y carga inicial rápida en redes móviles del gimnasio. |
| RNF-06 | **Privacidad:** no se recopilan datos personales de los alumnos en el MVP. |
| RNF-07 | **Accesibilidad básica:** contraste suficiente, controles con nombre accesible y respeto a "reducir movimiento". |

## 8. Cómo llega la app al cliente final

### 8.1 Distribución

| Canal | Para quién | Cómo |
|---|---|---|
| **URL pública en Vercel (Hobby, gratis)** | Coach y alumnos | Un dominio `*.vercel.app` (o uno propio más adelante). Cada `git push` a `main` publica una nueva versión. |
| **"Agregar a pantalla de inicio"** | Coach | Desde Safari o Chrome en el celular, para abrirla como una app. |
| **TV o pantalla del box** | Alumnos (grupo) | Abrir `/alumno` en el navegador de la TV o compartir la pantalla desde el celular del coach. Es el canal **principal en el MVP**. |
| **QR impreso o en pantalla** | Alumnos (individual) | Lleva a `/alumno` en el celular de cada alumno. En el MVP solo muestra la clase si fue generada en ese mismo dispositivo (ver §8.2). |

### 8.2 Limitación clave del MVP: la clase vive en un solo dispositivo

La clase y el inventario se guardan en el navegador del coach. **Un alumno que escanea el QR en su propio celular todavía no ve la clase del coach**: ve un aviso para pedirla al coach. Por eso el piloto usa la TV del box o la pantalla del coach como vista de alumno.

Resolver esta limitación es la prioridad de la Fase 2 (§9).

### 8.3 Plan de lanzamiento del piloto

| Semana | Actividad |
|---|---|
| 0 | Probar en local, publicar en Vercel y cargar el inventario real del box. |
| 1 | Usar la app en 2–3 clases propias, solo el coach (planificador + cronómetro). |
| 2 | Mostrar la vista de alumno en la TV y recoger comentarios verbales. |
| 3–4 | Uso regular. Bitácora de duración real y encuesta corta a los alumnos. |
| 5 | Revisión: decidir el alcance de la Fase 2 con los datos del piloto. |

### 8.4 Comunicación a los alumnos

- Aviso breve al inicio de clase: "hoy el WOD está en la pantalla, con variantes si tienes alguna molestia".
- Recordar siempre que las variantes **no sustituyen** la indicación del coach ni la de un profesional de la salud.

## 9. Roadmap propuesto

| Fase | Objetivo | Opciones técnicas (costo cero o bajo) |
|---|---|---|
| **Fase 2: clase compartida** | Que cada alumno vea la clase en su celular al escanear el QR. | a) **Codificar la clase en el enlace** (sin backend, gratis, funciona offline). b) Guardar la clase en **Vercel KV / Upstash** o **Supabase** (plan gratuito) con un código corto. |
| **Fase 3: PWA offline** | Que la app abra sin internet en el box. | Service worker y manifest. Ya no depende de servicios externos. |
| **Fase 4: reloj real** | Reemplazar el reloj simulado por la hora real de la clase. | Cambio acotado en la vista Coach. |
| **Fase 5: perfiles y progreso** | Historial por alumno, cargas y marcas. | Requiere autenticación y base de datos (Supabase). Evaluar privacidad. |
| **Fase 6: multi-coach / multi-sede** | Varios coaches con el mismo inventario. | Roles y datos compartidos por gimnasio. |

## 10. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| La clase no se comparte entre dispositivos | Alumnos confundidos al escanear el QR | Usar la TV en el piloto, dejar un mensaje claro en `/alumno` y priorizar la Fase 2. |
| Datos solo en el navegador | Se pierden al borrar datos o cambiar de celular | Comunicarlo al coach y evaluar exportar/importar el inventario como mejora rápida. |
| Seguridad del alumno | Lesiones por ejecutar mal o por una variante inadecuada | Aviso de salud visible, el coach valida siempre la clase y las restricciones son una guía, no un diagnóstico. |
| Licencias de imágenes | Uso indebido de fotografías | Las fotos actuales provienen de Unsplash (licencia libre). Antes de un uso comercial, verificar cada imagen o reemplazarla por fotos propias del box. |
| Contenido de "intensidad" y "kcal" fijo | Información imprecisa | Etiquetarlo como estimación o retirarlo hasta calcularlo con datos reales. |
| Límites del plan gratuito de Vercel | Interrupción si se supera la cuota | El tráfico de un solo box está muy por debajo de los límites. Revisar el uso mensualmente. |

## 11. Preguntas abiertas

1. ¿El box tiene una TV o pantalla con navegador para la vista de alumno?
2. ¿Qué restricciones adicionales son frecuentes en tus alumnos (rodilla, hombro, embarazo, etc.)?
3. ¿La duración de 60 minutos es fija, o hay clases de 45 o 30 minutos?
4. ¿Necesitas imprimir la clase o solo mostrarla en pantalla?
5. ¿El dueño del gimnasio quiere ver el estado del inventario?
6. ¿Quieres usar tu propia marca y dominio, o mantener "Kangaroo Coach"?
