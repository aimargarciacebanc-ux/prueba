# Ejercicio de Clase: API REST de Reservas y Camareros para RestauranteFX

**Objetivo:** Desarrollar una API REST con dos recursos (`reservas` y `camareros`), los dos con **CRUD completo**. Las reservas se buscan por **código de texto** (`R001`) y los camareros por **id numérico** (`1`). Los datos se guardan en ficheros JSON y las peticiones se muestran en consola con colores usando `picocolors`.

Tienes que crear tú: `package.json` (con `express` y `picocolors`), la carpeta `DATOS_API` con los dos JSON y el archivo `api.js`.

---

## 📁 Archivos de Datos Iniciales (`DATOS_API/`)

Crea la carpeta `DATOS_API` y dentro añade los siguientes dos archivos:

### 1. `DATOS_API/reservas.json`
```json
[
  {
    "codigo": "R001",
    "nombre": "Familia Agirre",
    "fecha": "2026-12-05T21:00:00",
    "personas": 4,
    "mesa": 7,
    "estado": "Confirmada"
  },
  {
    "codigo": "R002",
    "nombre": "Cena de empresa",
    "fecha": "2026-12-12T14:30:00",
    "personas": 12,
    "mesa": 1,
    "estado": "Confirmada"
  },
  {
    "codigo": "R003",
    "nombre": "Ainhoa Ruiz",
    "fecha": "2026-12-06T20:30:00",
    "personas": 2,
    "mesa": 3,
    "estado": "Cancelada"
  },
  {
    "codigo": "R004",
    "nombre": "Cumpleaños Xabi",
    "fecha": "2026-12-20T21:30:00",
    "personas": 8,
    "mesa": 5,
    "estado": "Confirmada"
  }
]
```

### 2. `DATOS_API/camareros.json`
```json
[
  {
    "id": 1,
    "nombre": "Oier Etxabe",
    "turno": "Mañana",
    "telefono": "655111222"
  },
  {
    "id": 2,
    "nombre": "Maialen Soto",
    "turno": "Noche",
    "telefono": "655333444"
  }
]
```

> 💡 Haz también una copia de los dos archivos en una carpeta `DATOS_ORIGINALES` para poder restaurarlos después de probar.

---

## 📋 Requisitos de la API

1. **Servidor y Logger de Consola:**
   * Arrancar el servidor Express en el puerto **`5095`** (el cliente usa `http://127.0.0.1:5095/`).
   * Habilitar la lectura de JSON (`express.json()`).
   * Usar un middleware global con `picocolors` que muestre por consola el método HTTP, la URL y el código de estado devuelto (en verde si es un `2xx` y en rojo si es un `4xx`).
   * Cualquier ruta que no exista debe responder `404` con un JSON de error.

2. **Endpoints para `Reservas` (CRUD completo por código):**
   * `GET /api/reservas`: Lista todas las reservas (`200`).
   * `GET /api/reservas/:codigo`: Devuelve una reserva por su **código** (por ejemplo `R001`). `404` si no existe.
   * `POST /api/reservas`: Crea una reserva nueva, la añade, la guarda en `reservas.json` y devuelve `201` con la reserva creada.
   * `PUT /api/reservas/:codigo`: Actualiza una reserva, la guarda en `reservas.json` y devuelve `200` con la reserva actualizada. `404` si no existe.
   * `DELETE /api/reservas/:codigo`: Elimina una reserva, guarda en `reservas.json` y devuelve `200`. `404` si no existe.

3. **Reglas del `POST` de reservas:**
   * El cliente envía `nombre`, `fecha`, `personas` y `mesa`.
   * El **servidor** asigna:
     * `codigo`: la letra `R` seguida de un número de 3 cifras. Como ya hay 4 reservas, la primera nueva es `R005`, luego `R006`, etc.
     * `estado`: siempre `"Confirmada"` en el alta.
   * La `fecha` se guarda **tal cual llega**. No la conviertas con `new Date()`.
   * La respuesta tiene los campos en este orden: `codigo`, `nombre`, `fecha`, `personas`, `mesa`, `estado`.

   Ejemplo de petición:
   ```json
   {
     "nombre": "Jon y Ane",
     "fecha": "2026-12-24T21:00:00",
     "personas": 2,
     "mesa": 4
   }
   ```

   Ejemplo de respuesta (`201 Created`):
   ```json
   {
     "codigo": "R005",
     "nombre": "Jon y Ane",
     "fecha": "2026-12-24T21:00:00",
     "personas": 2,
     "mesa": 4,
     "estado": "Confirmada"
   }
   ```

4. **Reglas del `PUT` de reservas:**
   * El `codigo` **no cambia nunca**: se mantiene el que tenía.
   * Se pueden enviar solo algunos campos (`nombre`, `fecha`, `personas`, `mesa`, `estado`). Los que no se envían conservan su valor anterior.

   Ejemplo: si a `R003` le envías solo `{ "estado": "Confirmada" }`, el resto de campos de `R003` queda igual.

5. **Endpoints para `Camareros` (CRUD completo por id):**
   * `GET /api/camareros`: Lista todos los camareros (`200`).
   * `GET /api/camareros/:id`: Devuelve un camarero por su id. `404` si no existe.
   * `POST /api/camareros`: Crea un camarero (con `nombre`, `turno` y `telefono`). El servidor asigna el `id` (el primero nuevo será `3`). Lo guarda en `camareros.json` y devuelve `201` con el camarero creado, en el orden `id`, `nombre`, `turno`, `telefono`.
   * `PUT /api/camareros/:id`: Actualiza un camarero (el `id` no cambia, los campos que no se envían se conservan). Guarda y devuelve `200` con el camarero actualizado. `404` si no existe.
   * `DELETE /api/camareros/:id`: Elimina un camarero, guarda en `camareros.json` y devuelve `200`. `404` si no existe.

6. **Fuera del alcance de este ejercicio:**
   * No hace falta validar los campos ni controlar duplicados (no se usan `400` ni `409`).
   * El cliente solo enviará datos válidos.

> 🔄 **Para reiniciar los datos:** restaura `reservas.json` (R001 a R004) y `camareros.json` (camareros 1 y 2) desde `DATOS_ORIGINALES` y reinicia el servidor.
