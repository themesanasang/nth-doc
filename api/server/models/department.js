'use strict'

const name = 'DocDepartment'
const tableName = 'doc_department'
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

    const countByDepartment = group => knex.count('id as numrow')
        .from(tableName)
        .whereRaw('department = ?', [group])
        .first()
        .timeout(timeout)
    
    const findOne = id => knex.select('*')
        .from(tableName)
        .whereRaw('id = ?', [id])
        .timeout(timeout)

    const findAllOpen = () => knex.select('*')
        .from(tableName)
        .whereRaw('status = "Y"')
        .timeout(timeout)

    const findAll = () => knex.raw(' select a.*, @rownum:=@rownum + 1 AS row_num  from doc_department as a, (SELECT @rownum := 0) as r  ')

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
        countByDepartment,
        findOne,
        findAllOpen,
        findAll,
        update,
        destroy
    }
    
}