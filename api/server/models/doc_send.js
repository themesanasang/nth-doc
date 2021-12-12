'use strict'

const name = 'DocSend'
const tableName = 'doc_send'
const timeout = 5000;

module.exports = knex => {

    const create = props => {
        return knex.insert(props)
        .returning('id')
        .into(tableName)
        .timeout(timeout)
    }

    const getIDYearMax = () => knex.select(
        knex.raw('LEFT(id, 2) as yearmax')
    )
    .from(tableName)
    .orderBy('id', 'desc')
    .first()
    .timeout(timeout)

    const getIDMax = () => knex.select(
            knex.raw('RIGHT(id, 4) as idmax')
        )
        .from(tableName)
        .orderBy('id', 'desc')
        .first()
        .timeout(timeout)

    const countById = id => knex.count('id as numrow')
        .from(tableName)
        .whereRaw('id = ?', [id])
        .first()
        .timeout(timeout)

    const findAll = () => knex.select(
        'doc_send.id', 'doc_send.book_number'
        , knex.raw('CONCAT(DATE_FORMAT(doc_send.date_send, "%d-%m-"),DATE_FORMAT(doc_send.date_send, "%Y")+543) as date_send') 
        , 'doc_send.time_send'
        , knex.raw('doc_agency.agency as agency_name')
        , knex.raw('doc_receiver.receiver as receiver_name')
        , 'doc_send.book_name'
        , knex.raw('CONCAT(DATE_FORMAT(doc_send.book_date, "%d-%m-"),DATE_FORMAT(doc_send.book_date, "%Y")+543) as date_book') 
        , 'doc_send.note'
        , knex.raw('doc_group.group as group_name')
        , 'doc_user.username'
        , knex.raw('CONCAT(DATE_FORMAT(doc_send.created_at, "%d-%m-"),DATE_FORMAT(doc_send.created_at, "%Y")+543) as date_create') 
        , knex.raw('CONCAT(DATE_FORMAT(doc_send.updated_at, "%d-%m-"),DATE_FORMAT(doc_send.updated_at, "%Y")+543) as date_update') 
    )
    .from(tableName)
    .leftJoin('doc_agency', 'doc_send.agency', '=', 'doc_agency.id')
    .leftJoin('doc_receiver', 'doc_send.receiver', '=', 'doc_receiver.id')
    .leftJoin('doc_group', 'doc_send.group', '=', 'doc_group.id')
    .leftJoin('doc_user', 'doc_send.created_by', '=', 'doc_user.id')
    .orderBy('id', 'desc')
    .timeout(timeout)

    const findOne = (id) => knex.select(
        'doc_send.id', 'doc_send.agency', 'doc_send.receiver', 'doc_send.book_number', 'doc_send.group'
        , knex.raw('CONCAT(DATE_FORMAT(doc_send.date_receive, "%d-%m-"),DATE_FORMAT(doc_send.date_receive, "%Y")+543) as date_send') 
        , knex.raw('DATE_FORMAT(doc_send.date_receive, "%Y-%m-%d") as date_r') 
        , 'doc_send.time_send'
        , knex.raw('doc_agency.agency as agency_name')
        , knex.raw('doc_receiver.receiver as receiver_name')
        , 'doc_send.book_name'
        , knex.raw('CONCAT(DATE_FORMAT(doc_send.book_date, "%d-%m-"),DATE_FORMAT(doc_send.book_date, "%Y")+543) as date_book') 
        , knex.raw('DATE_FORMAT(doc_send.book_date, "%Y-%m-%d") as date_b') 
        , 'doc_send.note'
        , knex.raw('doc_group.group as group_name')
        , 'doc_user.username'
        , knex.raw('CONCAT(DATE_FORMAT(doc_send.created_at, "%d-%m-"),DATE_FORMAT(doc_send.created_at, "%Y")+543) as date_create') 
        , knex.raw('CONCAT(DATE_FORMAT(doc_send.updated_at, "%d-%m-"),DATE_FORMAT(doc_send.updated_at, "%Y")+543) as date_update') 
    )
    .from(tableName)
    .leftJoin('doc_agency', 'doc_send.agency', '=', 'doc_agency.id')
    .leftJoin('doc_receiver', 'doc_send.receiver', '=', 'doc_receiver.id')
    .leftJoin('doc_group', 'doc_send.group', '=', 'doc_group.id')
    .leftJoin('doc_user', 'doc_send.created_by', '=', 'doc_user.id')
    .whereRaw('doc_send.id = ?', [id])
    .orderBy('id', 'desc')
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
        getIDYearMax,
        getIDMax,
        countById,
        findAll,
        findOne,
        update,
        destroy
    }
    
}