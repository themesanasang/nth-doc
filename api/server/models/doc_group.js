'use strict'

const name = 'DocGroup'
const tableName = 'doc_group'
const timeout = 1000;

module.exports = knex => {

    const create = props => {
        return knex.insert(props)
        .returning('id')
        .into(tableName)
        .timeout(timeout)
    }
    
    const countById = id => knex.count('id as numrow')
        .from(tableName)
        .whereRaw('id = ?', [id])
        .first()
        .timeout(timeout)

    const countByGroup = group => knex.count('id as numrow')
        .from(tableName)
        .whereRaw('group = ?', [group])
        .first()
        .timeout(timeout)
    
    const findOne = id => knex.select('*')
        .from(tableName)
        .whereRaw('id = ?', [id])
        .timeout(timeout)

    const findAll = () => knex.select('*')
        .from(tableName)
        .timeout(timeout)

    const update = (id, props) => {
        return knex.update(props)
        .from(tableName)
        .whereRaw('id = ?', [id])
        .timeout(timeout)
    }
        
    const destroy = id => knex.del()
        .from(tableName)
        .whereRaw('id = ?', [id])
        .timeout(timeout)

    

    return {
        name, 
        create,
        countById,
        countByGroup,
        findOne,
        findAll,
        update,
        destroy
    }
    
}