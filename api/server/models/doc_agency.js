'use strict'

const name = 'DocAgency'
const tableName = 'doc_agency'
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

    const countByAgency = group => knex.count('id as numrow')
        .from(tableName)
        .whereRaw('agency = ?', [group])
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

    const findAll = () => knex.raw(' select a.*, @rownum:=@rownum + 1 AS row_num  from doc_agency as a, (SELECT @rownum := 0) as r  order by id desc ')

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

    const countWorkReceive = (agency) => knex.count('agency as numrow')
        .from('doc_receive')
        .whereRaw('agency = ?', [agency])
        .first()
        .timeout(timeout)
    
    const countWorkSend = (agency) => knex.count('agency as numrow')
        .from('doc_send')
        .whereRaw('agency = ?', [agency])
        .first()
        .timeout(timeout)


    return {
        name, 
        create,
        countById,
        countByAgency,
        findOne,
        findAllOpen,
        findAll,
        update,
        destroy,
        countWorkReceive,
        countWorkSend
    }
    
}