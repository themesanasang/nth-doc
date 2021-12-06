'use strict'

const name = 'User'
const tableName = 'doc_user'
const timeout = 1000;

module.exports = knex => {

    const create = props => {
        return knex.insert(props)
        .returning('id')
        .into(tableName)
        .timeout(timeout)
    }

    const countByUUID = (uuid) => knex.count('uuid as numrow')
    .from(tableName)
    .whereRaw('uuid = ?', [uuid])
    .first()
    .timeout(timeout)

    const countByUsername = (username) => knex.count('username as numrow')
    .from(tableName)
    .whereRaw('username = ?', [username])
    .first()
    .timeout(timeout)

    const countByUsernamePassword = (username, password) => knex.count('username as numrow')
    .from(tableName)
    .whereRaw('username = ?', [username])
    .whereRaw('password = ?', [password])
    .first()
    .timeout(timeout)

    const findByUsernamePassword = (username, password) => knex.select('*')
    .from(tableName)
    .whereRaw('username = ?', [username])
    .whereRaw('password = ?', [password])
    .timeout(timeout)

    const findByID = (uuid) => knex.select('*')
    .from(tableName)
    .whereRaw('uuid = ?', [uuid])
    .timeout(timeout)


    const findAll = () => knex.select(
        'doc_user.*'
        , knex.raw('doc_department.department as department_name')
        , knex.raw('CONCAT(DATE_FORMAT(doc_user.created_at, "%d-%m-"),DATE_FORMAT(doc_user.created_at, "%Y")+543) as date_create') 
        , knex.raw('CONCAT(DATE_FORMAT(doc_user.updated_at, "%d-%m-"),DATE_FORMAT(doc_user.updated_at, "%Y")+543) as date_update') 
    )
    .from(tableName)
    .leftJoin('doc_department', 'doc_department.id', '=', 'doc_user.department')
    .orderBy('id', 'desc')
    .timeout(timeout)

    const findOne = (uuid) => knex.select(
        'doc_user.*'
        , knex.raw('doc_department.department as department_name')
        , knex.raw('CONCAT(DATE_FORMAT(doc_user.created_at, "%d-%m-"),DATE_FORMAT(doc_user.created_at, "%Y")+543) as date_create') 
        , knex.raw('CONCAT(DATE_FORMAT(doc_user.updated_at, "%d-%m-"),DATE_FORMAT(doc_user.updated_at, "%Y")+543) as date_update') 
    )
    .from(tableName)
    .leftJoin('doc_department', 'doc_department.id', '=', 'doc_user.department')
    .whereRaw('doc_user.uuid = ?', [uuid])
    .timeout(timeout)

    const update = (uuid, props) => {
        return knex.update(props)
        .from(tableName)
        .whereRaw('uuid = ?', [uuid])
        .timeout(timeout)
    }

    return {
        name, 
        create,
        countByUUID,
        countByUsername,
        countByUsernamePassword,
        findByUsernamePassword,
        findByID,
        findAll,
        findOne,
        update
    }
    
}