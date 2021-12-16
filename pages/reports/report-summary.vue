<template>
   <section class="section">
       
       <header class="docs-header">
            <b-breadcrumb align="is-left" size="is-medium">
                <b-breadcrumb-item tag='router-link' to="/">หน้าหลัก</b-breadcrumb-item>
                <b-breadcrumb-item tag='router-link' to="../reports">รายงาน</b-breadcrumb-item>
                <b-breadcrumb-item tag='router-link' to="report-summary">สรุปการ รับ-ส่ง หนังสือ</b-breadcrumb-item>
            </b-breadcrumb>
        </header>

        <div class="columns">
            <div class="column">

                <div class="box-condition">

                    <b-field grouped>
                        <b-field label="ประเภท *" :type="{ 'is-danger': hasTypeDocError }" :message="{ 'กรุณาเลือกประเภทหนังสือ': hasTypeDocError }">
                            <b-select v-model="typeDoc" placeholder="เลือกประเภท" expanded>
                                <option>รับ-หนังสือ</option>
                                <option>ส่ง-หนังสือ</option>
                            </b-select>
                        </b-field>
                       <b-field label="วันที่ *" expanded>
                            <b-datepicker
                                v-model="date1"
                                locale="th"
                                placeholder="เลือกวันที่..."
                                icon="calendar-today"
                                trap-focus>
                            </b-datepicker>
                        </b-field>

                        <b-field label="ถึงวันที่ *" expanded>
                            <b-datepicker
                                v-model="date2"
                                locale="th"
                                placeholder="เลือกวันที่..."
                                icon="calendar-today"
                                trap-focus>
                            </b-datepicker>
                        </b-field>
                    </b-field>

                    <div class="has-text-centered">
                        <p class="control">
                            <b-button label="ตกลง" type="is-success" @click="search" />
                        </p>
                    </div>

                </div>

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
            typeDoc: null,
            date1: undefined,
            date2: undefined,

            hasTypeDocError: false
        }
    },
    mounted(){
        this.date1 = new Date()
        this.date2 = new Date()
    },
    methods: {
        search () {
            this.hasTypeDocError = false;

            if(this.typeDoc === '' || this.typeDoc === null) {
                this.hasTypeDocError = true
            }
        }
    }
}
</script>

