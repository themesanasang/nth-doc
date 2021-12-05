'use strict'

const name = 'DocReceive'
const tableName = 'doc_receive'
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
        'doc_receive.id', 'doc_receive.book_number'
        , knex.raw('CONCAT(DATE_FORMAT(doc_receive.date_receive, "%d-%m-"),DATE_FORMAT(doc_receive.date_receive, "%Y")+543) as date_receive') 
        , 'doc_receive.time_receive'
        , knex.raw('doc_agency.agency as agency_name')
        , knex.raw('doc_receiver.receiver as receiver_name')
        , 'doc_receive.book_name'
        , knex.raw('CONCAT(DATE_FORMAT(doc_receive.book_date, "%d-%m-"),DATE_FORMAT(doc_receive.book_date, "%Y")+543) as date_book') 
        , 'doc_receive.note'
        , knex.raw('doc_group.group as group_name')
        , 'doc_user.username'
        , knex.raw('CONCAT(DATE_FORMAT(doc_receive.created_at, "%d-%m-"),DATE_FORMAT(doc_receive.created_at, "%Y")+543) as date_create') 
        , knex.raw('CONCAT(DATE_FORMAT(doc_receive.updated_at, "%d-%m-"),DATE_FORMAT(doc_receive.updated_at, "%Y")+543) as date_update') 
    )
    .from(tableName)
    .leftJoin('doc_agency', 'doc_receive.agency', '=', 'doc_agency.id')
    .leftJoin('doc_receiver', 'doc_receive.receiver', '=', 'doc_receiver.id')
    .leftJoin('doc_group', 'doc_receive.group', '=', 'doc_group.id')
    .leftJoin('doc_user', 'doc_receive.created_by', '=', 'doc_user.id')
    .orderBy('id', 'desc')
    .timeout(timeout)

    const findOne = (id) => knex.select(
        'doc_receive.id', 'doc_receive.agency', 'doc_receive.receiver', 'doc_receive.book_number', 'doc_receive.group'
        , knex.raw('CONCAT(DATE_FORMAT(doc_receive.date_receive, "%d-%m-"),DATE_FORMAT(doc_receive.date_receive, "%Y")+543) as date_receive') 
        , knex.raw('DATE_FORMAT(doc_receive.date_receive, "%Y-%m-%d") as date_r') 
        , 'doc_receive.time_receive'
        , knex.raw('doc_agency.agency as agency_name')
        , knex.raw('doc_receiver.receiver as receiver_name')
        , 'doc_receive.book_name'
        , knex.raw('CONCAT(DATE_FORMAT(doc_receive.book_date, "%d-%m-"),DATE_FORMAT(doc_receive.book_date, "%Y")+543) as date_book') 
        , knex.raw('DATE_FORMAT(doc_receive.book_date, "%Y-%m-%d") as date_b') 
        , 'doc_receive.note'
        , knex.raw('doc_group.group as group_name')
        , 'doc_user.username'
        , knex.raw('CONCAT(DATE_FORMAT(doc_receive.created_at, "%d-%m-"),DATE_FORMAT(doc_receive.created_at, "%Y")+543) as date_create') 
        , knex.raw('CONCAT(DATE_FORMAT(doc_receive.updated_at, "%d-%m-"),DATE_FORMAT(doc_receive.updated_at, "%Y")+543) as date_update') 
    )
    .from(tableName)
    .leftJoin('doc_agency', 'doc_receive.agency', '=', 'doc_agency.id')
    .leftJoin('doc_receiver', 'doc_receive.receiver', '=', 'doc_receiver.id')
    .leftJoin('doc_group', 'doc_receive.group', '=', 'doc_group.id')
    .leftJoin('doc_user', 'doc_receive.created_by', '=', 'doc_user.id')
    .whereRaw('doc_receive.id = ?', [id])
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