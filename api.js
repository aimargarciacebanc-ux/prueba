const fs = require('node:fs')
const path = require('node:path')
const express = require('express')
const app = express()
const pc  = require('picocolors')
const port = 5095
app.use(express.json())

const camareros = require('./DATOS_API/camareros.json')
const reservas = require('./DATOS_API/reservas.json')

const RUTA_CAMAREROS = path.join(__dirname, 'DATOS_API', 'camareros.json')
const RUTA_RESERVAS = path.join(__dirname, 'DATOS_API', 'reservas.json')

app.use((req, res, next) => {
    res.on(('finish'), () => {
        const color = res.statusCode >= 400 ? pc.red(res.statusCode) : pc.green(res.statusCode)
        console.log(`[${req.method}] ${req.url}, ${color}`)
    })
    next()
})

app.get("/api/reservas", (req, res) =>{
    res.status(200).json(reservas)
})

app.get("/api/reservas/:codigo", (req, res) => {
    const cod = req.params.codigo
    const reserva = reservas.find(r => r.codigo === cod)
    if (!reserva) {
        res.status(404).json({error: "not found"})
    } else {
        res.status(200).json(reserva)
    }
})

app.post("/api/reservas", (req, res) => {
    const nuevocodigo = "R" + String(reservas.length + 1).padStart(3, 0)
    const nuevo = {
    codigo: nuevocodigo ,
    nombre: req.body.nombre ,
    fecha: req.body.fecha ,
    personas: req.body.personas ,
    mesa: req.body.mesa ,
    estado: "Confirmada" 
    }

    reservas.push(nuevo)
    fs.writeFileSync(RUTA_RESERVAS, JSON.stringify(reservas, null, 2))
    res.status(201).json(nuevo)
})

app.put("/api/reservas/:codigo", (req,res) => {
    const cod = req.params.codigo
    const index = reservas.findIndex(r => r.codigo === cod)
    if (index === -1) {
        res.status(404).json({elol: "elol"})
    } else {
        reservas[index] = {
            codigo: cod,
            nombre: req.body.nombre ?? reservas[index].nombre,
            fecha: req.body.fecha ?? reservas[index].fecha,
            personas: req.body.personas ?? reservas[index].personas,
            mesa: req.body.mesa ?? reservas[index].mesa,
            estado: req.body.estado ?? reservas[index].estado
        }
        fs.writeFileSync(RUTA_RESERVAS, JSON.stringify(reservas, null, 2))
        res.status(200).json(reservas[index])
    }
})

app.delete("/api/reservas/:codigo", (req,res) => {
    const cod = req.params.codigo
    const index = reservas.findIndex(c => c.codigo === cod)
    if (index === -1) {
        res.status(404).json({error: "error 404"})
    } else {
        reservas.splice(index, 1)
        fs.writeFileSync(RUTA_RESERVAS, JSON.stringify(reservas, null, 2))
        res.status(200).send("borrado")
    }
})

app.get("/api/camareros", (req, res) => {
    res.status(200).json(camareros)
})

app.get("/api/camareros/:id", (req, res) => {
    const ide = Number(req.params.id)
    const camarero = camareros.find(c => c.id === ide)
    if (!camarero) {
        res.status(404).json({error: "not fond"})
    } else {
        res.status(200).json(camarero)
    }
})

app.post("/api/camareros", (req, res) => {
    const nuevo = {
        id: camareros.length + 1,
        nombre: req.body.nombre,
        turno: req.body.turno,
        telefono: req.body.telefono,
    }
    camareros.push(nuevo)
    fs.writeFileSync(RUTA_CAMAREROS, JSON.stringify(camareros, null, 2))
    res.status(201).json(nuevo)
})

app.put("/api/camareros/:id", (req, res) => {
    const ide = Number(req.params.id)
    const index = camareros.findIndex(c => c.id === ide)
    if (index === -1) {
        res.status(404).json({error: "not found"})
    } else {
        camareros[index] = {
            id: ide,
            nombre: req.body.nombre ?? camareros[index].nombre,
            turno: req.body.turno ?? camareros[index].turno,
            telefono: req.body.telefono ?? camareros[index].telefono,
        }
        fs.writeFileSync(RUTA_CAMAREROS, JSON.stringify(camareros, null, 2))
        res.status(200).json(camareros[index])
    }
})


app.delete("/api/camareros/:id", (req, res) => {
    const ide = Number(req.params.id)
    const index = camareros.findIndex(i => i.id === ide)
    if (index === -1) {
        res.status(404).send("error 404")
    } else {
        camareros.splice(index, 1)
        fs.writeFileSync(RUTA_CAMAREROS, JSON.stringify(camareros, null, 2))
        res.status(200).json({completado: "borrado"})
    }
})









app.use((req, res) => {
    res.status(404).json({error: "error 404"})
})

app.listen(port , () => {
    console.log(`escuchando en puerto ${port}`)
    
})

