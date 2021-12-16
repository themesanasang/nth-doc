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







    return {
        name, 
        getSumReceiveDay,
        getSumReceiveMonth,
        getSumReceiveYear,
        getSumSendDay,
        getSumSendMonth,
        getSumSendYear
    }
    
}