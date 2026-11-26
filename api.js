const fs = require('node:fs')
const path = require('node:path')
const express = require('express')
const app = express()
const pc  = require('picocolors')
const port = 5095
app.use(express.json())

const camareros = require('./DATOS_API/camareros.json')
const reservas = require('./DATOS_API/reservas.json')
const { error } = require('node:console')
const { captureRejections } = require('node:events')

const RUTA_CAMAREROS = path.join(__dirname, 'DATOS_API', 'camareros.json')
const RUTA_RESERVAS = path.join(__dirname, 'DATOS_API', 'reservas.json')

app.use((req, res, next) => {
    res.on(('finish'), () => {
        color = res.statusCode > 400 ? pc.red(res.statusCode) : pc.green(res.statusCode)
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
    const nuevocodigo = "R" + String(reservas.length).padStart(3, 0)
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
    }
})






















app.use((req, res) => {
    res.status(404).json({error: "error 404"})
})

app.listen(port , () => {
    console.log(`escuchando en puerto ${port}`)
    
})

