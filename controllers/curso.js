const {response, request} = require('express');

const Curso = require('../models/curso');
const User = require('../models/user');

const getCurso = async(req = request, res = response) =>{
    const listaCursos = await Promise.all([
        Curso.countDocuments(),
        Curso.find()

    ])

    res.json({
        msg: 'Lista de cursos',
        listaCursos
        
    })
}

const postCurso = async(req= request, res = response) =>{
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const maestro = req.user._id;
    const cursoDB = new Curso({nombre, descripcion, maestro});
    await cursoDB.save();

    res.status(201).json({
        msg: 'POST API CURSOS',
        cursoDB
    })
}

const putCurso = async(req = request, res = response) =>{
    const {id} = req.params;
    const {_id, ...resto} = req.body;
    const cursoEditado = await Curso.findByIdAndUpdate(id, resto, {new: true});

    res.status(200).json({
        msg: 'PUT API CURSOS',
        cursoEditado
    })
}

const deleteCurso = async(req = request, res = response) =>{
    const {id} = req.params;
    const existeCurso = await Curso.findOne({_id: id});
    const users = existeCurso.alumnos
    const maestro = existeCurso.maestro;
    
    const cursoEliminado = await Curso.findByIdAndDelete(id);

    for(let user of users){
        await User.findOneAndUpdate(
            {_id: user},
            {$pull: {'cursos': id}},
        );
    }
    await User.findOneAndUpdate(
        {_id: maestro},
        {$pull: {'cursos': id}},

    )
    res.status(200).json({
        msg: 'DELETE API CURSOS',
        cursoEliminado
    })
}

const asignarAlumno = async(req = request, res = response) =>{
    const {idCurso} = req.params;
    const user = req.user._id;
    const cursos = req.user.cursos;
    const existeCurso = await Curso.findOne({_id: idCurso});
    if(!existeCurso){
        return res.status(404).json({
            msg: 'No hemos encontrado el curso que desea asignar al alumno'

        })
    }
    if(cursos.length >= 3){
        return res.status(400).json({
            msg: 'Ya tienes el maximo de 3 cursos a los que estas asignado'

        })
    }
    for(let curso of cursos){
        if(existeCurso._id != curso) continue
        var exists = curso
    }
    if(exists) return res.status(400).json({ msg: 'Ya tienes este curso asignado'})
    const updatedUser = await User.findOneAndUpdate(
        {_id: user},
        {$push: {'cursos': idCurso}},
        {new: true}
    );
    const updatedCurse = await Curso.findOneAndUpdate(
        {_id: idCurso},
        {$push: {'alumnos': user}},
        {new: true}
    )
    res.status(200).json({
        msg: 'El alumno ha sido asignado al curso de manera existosa',
        updatedUser,
        updatedCurse
    })
}

module.exports = {
    getCurso,
    postCurso,
    putCurso,
    deleteCurso,
    asignarAlumno
}