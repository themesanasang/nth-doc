<template>
   <section class="section">
       
       <header class="docs-header">
            <b-breadcrumb align="is-left" size="is-medium">
                <b-breadcrumb-item tag='router-link' to="/">หน้าหลัก</b-breadcrumb-item>
                <b-breadcrumb-item tag='router-link' to="reports">รายงาน</b-breadcrumb-item>
            </b-breadcrumb>
        </header>

        <div class="columns">
            <div class="column">

                <!-- === box รับหนังสือ === -->
                <section class="info-tiles">
                    <div class="tile is-ancestor has-text-centered">
                        <div class="tile is-parent">
                            <article class="tile is-child box">
                                <p class="title">{{ receiveDay }} ฉบับ</p>
                                <p>รับหนังสือ</p>
                                <p>วันที่ {{ dayNow }}</p>
                            </article>
                        </div>
                        <div class="tile is-parent">
                            <article class="tile is-child box">
                                <p class="title">{{ receiveMonth }} ฉบับ</p>
                                <p>รับหนังสือ</p>
                                <p>{{ monthNow }}</p>
                            </article>
                        </div>
                        <div class="tile is-parent">
                            <article class="tile is-child box">
                                <p class="title">{{ receiveYear }} ฉบับ</p>
                                <p>รับหนังสือ</p>
                                <p>{{ yearNow }}</p>
                            </article>
                         </div>
                    </div>
                </section>
                <!-- === ./box รับหนังสือ === -->

                <!-- === box ส่งหนังสือ === -->
                <section class="info-tiles">
                    <div class="tile is-ancestor has-text-centered">
                        <div class="tile is-parent">
                            <article class="tile is-child box">
                                <p class="title">{{ sendDay }} ฉบับ</p>
                                <p>ส่งหนังสือ</p>
                                <p>วันที่ {{ dayNow }}</p>
                            </article>
                        </div>
                        <div class="tile is-parent">
                            <article class="tile is-child box">
                                <p class="title">{{ sendMonth }} ฉบับ</p>
                                <p>ส่งหนังสือ</p>
                                <p>{{ monthNow }}</p>
                            </article>
                        </div>
                        <div class="tile is-parent">
                            <article class="tile is-child box">
                                <p class="title">{{ sendYear }} ฉบับ</p>
                                <p>ส่งหนังสือ</p>
                                <p>{{ yearNow }}</p>
                            </article>
                        </div>
                    </div>
                </section>
                <!-- === ./box ส่งหนังสือ === -->

            </div>
        </div>

   </section>
</template>

<script>
export default {
    layout: 'report-layout',
    middleware: ['auth-user'],
    data() {
        return {
            receiveDay: 0,
            receiveMonth: 0,
            receiveYear: 0,
            sendDay: 0,
            sendMonth: 0,
            sendYear: 0,
            dayNow: '',
            monthNow: '',
            yearNow: '',
            sumDataBoxDashboard: 0
        }
    }, 
    mounted () {
        const date1 = new Date()
        this.dayNow = (date1.getDate() > 9 ? '' : '0') + date1.getDate() +'-'+ ((date1.getMonth() + 1) > 9 ? '' : '0') + (date1.getMonth() + 1) + '-' + String(Number(date1.getFullYear())+543)
        this.monthNow = 'เดือน '+((date1.getMonth() + 1) > 9 ? '' : '0') + (date1.getMonth() + 1) + ' ปี ' + String(Number(date1.getFullYear())+543)  
        this.yearNow = 'ปี '+ String(Number(date1.getFullYear())+543) 
            
        this.fetchSumDataBoxDashboard();
    },
    methods: {
        async fetchSumDataBoxDashboard () {
            try {
                const getSumDataBoxDashboard = await this.$axios.get('/api/v1/report/getSumDataBoxDashboard')
                this.sumDataBoxDashboard =  getSumDataBoxDashboard.data

                this.receiveDay = this.sumDataBoxDashboard.receiveDay[0].numrow
                this.receiveMonth = this.sumDataBoxDashboard.receiveMonth[0].numrow
                this.receiveYear = this.sumDataBoxDashboard.receiveYear[0].numrow
                this.sendDay = this.sumDataBoxDashboard.sendDay[0].numrow
                this.sendMonth = this.sumDataBoxDashboard.sendMonth[0].numrow
                this.sendYear = this.sumDataBoxDashboard.sendYear[0].numrow
            } catch (error) {
                
            }
        },
    }
}
</script>
<style lang="scss">
    .box {
        background-color: #161b22 !important;
        border: 1px solid #30363d !important;
    }
    .box p {
        color: hsl(0, 0%, 96%) !important;
    }
</style>

