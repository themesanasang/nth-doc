'use strict'

const name = 'DocReport'
const timeout = 3000;

module.exports = knex => {

    
    //ดึงข้อมูล จำนวน การรับหนังสือ / วัน
    const getSumReceiveDay = () => knex.raw(' select count(id) as numrow from doc_receive where date(date_receive)=date(now()) ').timeout(timeout)

    //ดึงข้อมูล จำนวน การรับหนังสือ / เดือน
    const getSumReceiveMonth = () => knex.raw(' select count(id) as numrow from doc_receive where month(date_receive)=month(now()) and year(date_receive)=year(now()) ').timeout(timeout)

    //ดึงข้อมูล จำนวน การรับหนังสือ / ปี
    const getSumReceiveYear = () => knex.raw(' select count(id) as numrow from doc_receive where year(date_receive)=year(now()) ').timeout(timeout)

    //ดึงข้อมูล จำนวน การส่งหนังสือ / วัน
    const getSumSendDay = () => knex.raw(' select count(id) as numrow from doc_send where date(date_send)=date(now()) ').timeout(timeout)   

    //ดึงข้อมูล จำนวน การส่งหนังสือ / เดือน
    const getSumSendMonth = () => knex.raw(' select count(id) as numrow from doc_send where month(date_send)=month(now()) and year(date_send)=year(now()) ').timeout(timeout)

    //ดึงข้อมูล จำนวน การส่งหนังสือ / วัน
    const getSumSendYear = () => knex.raw(' select count(id) as numrow from doc_send where year(date_send)=year(now()) ').timeout(timeout)  


    const findDataReceive = (date1, date2) => knex.select(
        'doc_receive.id'
        , 'doc_receive.book_number'
        , knex.raw('CONCAT(DATE_FORMAT(doc_receive.date_receive, "%d-%m-"),DATE_FORMAT(doc_receive.date_receive, "%Y")+543) as date_receive') 
        , 'doc_receive.time_receive'
        , knex.raw('doc_agency.agency as agency_name')
        , knex.raw('doc_receiver.receiver as receiver_name')
        , 'doc_receive.book_name'
        , 'doc_receive.note'
    )
    .from('doc_receive')
    .leftJoin('doc_agency', 'doc_receive.agency', '=', 'doc_agency.id')
    .leftJoin('doc_receiver', 'doc_receive.receiver', '=', 'doc_receiver.id')
    .leftJoin('doc_group', 'doc_receive.group', '=', 'doc_group.id')
    .leftJoin('doc_user', 'doc_receive.created_by', '=', 'doc_user.id')
    .whereRaw('doc_receive.date_receive between "' + date1 + '" and "' + date2 + '" ')
    .orderBy('doc_receive.date_receive', 'asc')
    .timeout(timeout)


    const findDataSend = (date1, date2) => knex.select(
        'doc_send.id'
        ,'doc_send.book_number'
        , knex.raw('CONCAT(DATE_FORMAT(doc_send.date_send, "%d-%m-"),DATE_FORMAT(doc_send.date_send, "%Y")+543) as date_send') 
        , 'doc_send.time_send'
        , knex.raw('doc_agency.agency as agency_name')
        , knex.raw('doc_receiver.receiver as receiver_name')
        , 'doc_send.book_name'
        , 'doc_send.note'
    )
    .from('doc_send')
    .leftJoin('doc_agency', 'doc_send.agency', '=', 'doc_agency.id')
    .leftJoin('doc_receiver', 'doc_send.receiver', '=', 'doc_receiver.id')
    .leftJoin('doc_group', 'doc_send.group', '=', 'doc_group.id')
    .leftJoin('doc_user', 'doc_send.created_by', '=', 'doc_user.id')
    .whereRaw('doc_send.date_send between "' + date1 + '" and "' + date2 + '" ')
    .orderBy('doc_send.date_send', 'asc')
    .timeout(timeout)



    //สรุปการรับหนังสือรายเดือน
    const findDataReceiveMonth = (year) => knex.select(
        knex.raw('month(date_receive) as mm') 
        , knex.raw('count(id) as total')
    )
    .from('doc_receive')
    .whereRaw('year(date_receive) = ? ', [year])
    .groupByRaw('month(date_receive)')
    .orderByRaw('month(date_receive) asc')
    .timeout(timeout)

    

    //สรุปการส่งหนังสือรายเดือน
    const findDataSendMonth = (year) => knex.select(
        knex.raw('month(doc_send) as mm') 
        , knex.raw('count(id) as total')
    )
    .from('doc_send')
    .whereRaw('year(doc_send) = ?', [year])
    .groupByRaw('month(doc_send)')
    .orderByRaw('month(doc_send) asc')
    .timeout(timeout)



    return {
        name, 
        getSumReceiveDay,
        getSumReceiveMonth,
        getSumReceiveYear,
        getSumSendDay,
        getSumSendMonth,
        getSumSendYear,
        findDataReceive,
        findDataSend,
        findDataReceiveMonth,
        findDataSendMonth
    }
    
}