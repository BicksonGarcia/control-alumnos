const {response, request} = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

const getUsers = async (req = request, res = response) => {
    const listaUsers = await Promise.all([
        User.countDocuments(),
        User.find()
    ])

    res.json({
        msg: 'Lista de Usuarios',
        listaUsers
    })
}


const postUser = async (req = request, res = response) => {
    const {nombre, email, password, role, cursos} = req.body;
    const userDB = new User({nombre, email, password, role, cursos});

    const salt = bcryptjs.genSaltSync();
    userDB.password = bcryptjs.hashSync(password, salt);

    await userDB.save();

    res.json({
        msg: 'POST API USUARIOS',
        userDB
    })
}

const putUser = async(req = request, res = response) => {
    const {id} = req.params;
    const {_id, role, ...resto} = req.body;
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(resto.password, salt);
    const userEditado = await User.findByIdAndUpdate(id, resto, {new: true});
    res.status(200).json({
        msg: 'PUT API USUARIOS',
        userEditado
    })
}
const putMyUser = async (req = request, res = response) => {
    const {id} = req.params;
    const user = req.user._id;
    const idUser = user.toString();

    if (id === idUser) {
        const {_id, role,...resto} = req.body;
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(resto.password, salt);
        const userEditado = await User.findByIdAndUpdate(id, resto, {new: true});
        res.status(200).json({
            msg: 'PUT API USUARIOS',

            userEditado
        })
    } else{
        res.status(401).json({
            msg: 'Solo puedes editar tu usuario, respeta el de los demas'

        })
    }

}

const deleteUser = async(req = request, res = response) => {
    const {id} = req.params;
    const userEliminado = await User.findByIdAndDelete(id);

    res.status(200).json({
        msg: 'DELETE API USUARIOS',

        userEliminado
    })
}

const deleteMyUser = async(req = request, res = response) => {
    const {id} = req.params;
    const user = req.user._id;
    const idUser = user.toString();

    if(id === idUser){
        const userEliminado = await User.findByIdAndDelete(id);
        res.status(200).json({
            msg: 'DELETE API USUARIOS',

            userEliminado
        })
    }else{
        res.status(401).json({
            msg: 'Solo puedes eliminar tu usuario, respeta el de los demas'


        })
    }
    
}

const registerUser = async (req = request, res = response) => {
    const {nombre, email, password} = req.body;

    const userRegistered =  new User({nombre, email, password});
    const salt = bcryptjs.genSaltSync();
    userRegistered.password = bcryptjs.hashSync(password, salt);

    await userRegistered.save();

    res.status(200).json({
        msg: 'Registro exitoso',
        userRegistered
        
    })
}

const getMyCourses = async (req = request, res = response) => {
    const user = req.user._id;
    const cursos = req.user.cursos

    res.json({
        msg: 'Lista de mis cursos a los que estoy asignado',
        cursos
    })
    
}


module.exports = {
    getUsers,
    postUser,
    putUser,
    deleteUser,
    registerUser,
    getMyCourses,
    deleteMyUser,
    putMyUser
    
}