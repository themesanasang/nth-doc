'use strict'

const name = 'User'
const tableName = 'doc_user'
const timeout = 5000;

module.exports = knex => {


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

    const findByID = (id) => knex.select('*')
    .from(tableName)
    .whereRaw('id = ?', [id])
    .timeout(timeout)

    return {
        name, 
        countByUsernamePassword,
        findByUsernamePassword,
        findByID
    }
    
}