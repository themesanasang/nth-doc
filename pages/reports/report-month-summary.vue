<template>
   <section class="section">
       
       <header class="docs-header">
            <b-breadcrumb align="is-left" size="is-medium">
                <b-breadcrumb-item tag='router-link' to="/">หน้าหลัก</b-breadcrumb-item>
                <b-breadcrumb-item tag='router-link' to="../reports">รายงาน</b-breadcrumb-item>
                <b-breadcrumb-item tag='router-link' to="../reports/report-month-summary">สรุป รับ-ส่ง หนังสือรายเดือน</b-breadcrumb-item>
            </b-breadcrumb>
        </header>

        <div class="columns">
            <div class="column">

                <div class="box-condition">
                    <b-field grouped>
                       <b-field :type="{ 'is-danger': hasYearError }" :message="{ 'กรุณาเลือกปี': hasYearError }">
                            <b-select v-model="reportYear" expanded>
                                <option
                                v-for="(year, i) in cardYearOptions"
                                :key="year"
                                :value="year"
                                :disabled="i === 0"
                                >
                                {{ year }}
                                </option>
                            </b-select>
                        </b-field>
                        <b-field>
                            <p class="control">
                                <b-button label="ตกลง" type="is-success" @click="search" />
                            </p>
                        </b-field>
                    </b-field>              
                </div>



            </div>
        </div>

   </section>
</template>

<script>

const  DEFAULT_YEAR_VALUE = () => [
    "--- เลือกปี ---",
    2564,
    2565,
    2566,
    2567,
    2568,
    2569,
    2570
];

export default {
    layout: 'report-layout',
    middleware: ['auth-user'],
    data() {
        return {
            reportYear: DEFAULT_YEAR_VALUE()[0],
            cardYearOptions: DEFAULT_YEAR_VALUE(),

            hasYearError: false
        }
    },
    mounted(){
        
    },
    methods: {
        search () {
            this.hasTypeDocError = false;

            if(this.reportYear === '--- เลือกปี ---' || this.reportYear === '' || this.reportYear === null) {
                this.hasYearError = true
                return
            }
            
            const type = String(this.reportYear)

            this.$console.log(type);
            
            
        },
    }
}
</script>

