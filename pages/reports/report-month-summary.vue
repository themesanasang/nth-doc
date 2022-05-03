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
                        <b-field label="ประเภท *" :type="{ 'is-danger': hasTypeDocError }" :message="{ 'กรุณาเลือกประเภทหนังสือ': hasTypeDocError }" expanded>
                            <b-select v-model="typeDoc" placeholder="เลือกประเภท" expanded>
                                <option value="receive">รับ-หนังสือ</option>
                                <option value="send">ส่ง-หนังสือ</option>
                            </b-select>
                        </b-field>
                       <b-field label="ปี *" :type="{ 'is-danger': hasYearError }" :message="{ 'กรุณาเลือกปี': hasYearError }" expanded>
                            <b-select v-model="reportYear" placeholder="เลือกปี" expanded>
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
                    </b-field>  
                    <div class="has-text-centered">
                        <p class="control">
                            <b-button label="ตกลง" type="is-success" @click="search" />
                        </p>
                    </div>            
                </div>

                <div v-if="docData.length > 0" class="has-text-right mt-5">
                    <p class="control">
                        <b-button label="ส่งออก PDF" type="is-danger rounded" @click="exportDataPDF" />
                        <b-button label="ส่งออก Excel" type="is-info rounded" @click="exportDataExcel" />
                    </p>
                </div>

                 <div v-if="docData.length > 0" class="mt-2">
                   <h2>ประเภท: {{ typeDocText }} ปี: {{ reportYear }}</h2>  
                   <!-- table receive -->
                    <b-table
                        ref="table"
                        :data="docData"
                        paginated
                        pagination-size="is-small"
                        per-page="10"
                        aria-page-label="Page"
                        aria-next-label="Next page"
                        aria-previous-label="Previous page"
                        aria-current-label="Current page">

                        <b-table-column v-slot="props" field="month" label="เดือน" width="180" sortable>
                           {{ props.row.month }}
                        </b-table-column>

                        <b-table-column v-slot="props" field="total"  label="จำนวน" sortable>
                            {{ props.row.total }}
                        </b-table-column>                      

                        <template #empty>
                            <div class="has-text-centered">ไม่มีข้อมูล</div>
                        </template>
                    </b-table>
                    <!-- ./table receive -->
                </div>

            </div>
        </div>

   </section>
</template>

<script>
import CryptoJS from 'crypto-js'
import XLSX from 'xlsx'
import pdfMake from 'pdfmake'
import pdfFonts from '~/assets/custom-fonts.js'

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
            docData: [],
            docDataArray: [],
            typeDoc: null,
            typeDocText: null,
            reportYear: DEFAULT_YEAR_VALUE()[0],
            cardYearOptions: DEFAULT_YEAR_VALUE(),

            hasTypeDocError: false,
            hasYearError: false
        }
    },
    mounted(){
        
    },
    methods: {
        async search () {
            this.hasTypeDocError = false;
            this.hasYearError = false;

            if(this.typeDoc === '' || this.typeDoc === null) {
                this.hasTypeDocError = true
                return
            }

            if(this.reportYear === '--- เลือกปี ---' || this.reportYear === '' || this.reportYear === null) {
                this.hasYearError = true
                return
            }

            if(this.typeDoc === 'receive') {
                this.typeDocText = 'รับหนังสือ';
            } else {
                this.typeDocText = 'ส่งหนังสือ';
            }
            
            const year = String(this.reportYear - 543)
            const yeartext = CryptoJS.AES.encrypt(year, process.env.SECRET_KEY)

            const type = String(this.typeDoc)
            const ciphertext = CryptoJS.AES.encrypt(type, process.env.SECRET_KEY)

            try {
                const result = await this.$axios.get('/api/v1/report/getDataDocMonthSummary/'+encodeURIComponent(ciphertext)+'/'+encodeURIComponent(yeartext))
           
                this.docDataArray = [];
                result.data.forEach(row => {  
                    this.docDataArray.push({
                        month: this.getMonth(row.mm),
                        total: row.total       
                    });
                });

                // this.$console.log(this.docDataArray);

                this.docData = this.docDataArray;

                if(this.docData.length === 0) {
                    this.$buefy.toast.open({message: `ไม่มีข้อมูลที่ท่านต้องการค้นหา... กรุณารองใหม่อีกครั้ง`, type: 'is-warning'})
                } else{
                    $(function(){
                        $("table input[type=text]").attr('placeholder', 'ค้นหา...')
                    })
                }
            } catch (error) {
                this.docData = [];
                this.$buefy.toast.open({message: `ไม่สามารถโหลดข้อมูลรายงานได้ กรุณาแจ้งผู้ดูแลระบบ`, type: 'is-danger'})
            }                       
        },
        getMonth(mm) {
            let name='';
            
            switch ( mm ) {
                case mm=1:
                    name = 'มกราคม';
                    break;
                case mm=2:
                    name = 'กุมภาพันธ์';
                    break;
                case mm=3:
                    name = 'มีนาคม';
                    break;
                case mm=4:
                    name = 'เมษายน';
                    break;
                case mm=5:
                    name = 'พฤษภาคม';
                    break;
                case mm=6:
                    name = 'มิถุนายน';
                    break;
                case mm=7:
                    name = 'กรกฎาคม';
                    break;
                case mm=8:
                    name = 'สิงหาคม';
                    break;
                case mm=9:
                    name = 'กันยายน';
                    break;
                case mm=10:
                    name = 'ตุลาคม';
                    break;
                case mm=11:
                    name = 'พฤศจิกายน';
                    break;
                case mm=12:
                    name = 'ธันวาคม';
                    break;
                default: 
                    name = '-';
                    break;
            }

            return name;
        },
         exportDataExcel () {
           try {
                const dataWS = XLSX.utils.json_to_sheet(this.docData)
                const wb = XLSX.utils.book_new()
                XLSX.utils.book_append_sheet(wb, dataWS)
                XLSX.writeFile(wb,'report-month-summary.xlsx')
           } catch (error) {
               this.$buefy.toast.open({message: `ไม่สามารถส่งออกข้อมูลรายงานได้ กรุณาแจ้งผู้ดูแลระบบ`, type: 'is-danger'})
           }
        },
        exportDataPDF () {
            try {
                let nameTypeDoc = ''
                if(this.typeDoc === 'receive') {
                    nameTypeDoc = 'ทะเบียนหนังสือ-รับ ปี: '+this.reportYear
                } else {
                    nameTypeDoc = 'ทะเบียนหนังสือ-ส่ง ปี: '+this.reportYear
                }

                const dataAll = this.docData
                const columns = ['เดือน', 'จำนวน']
                const body = []
                body.push(columns)

                for (const key in dataAll) {
                    // if (dataAll.hasOwnProperty(key))
                    // {
                        const data = dataAll[key];
                        const row = new Array();
                        row.push( data.month.toString() );
                        row.push( data.total.toString() );
                        body.push(row);
                    // }
                }

                pdfMake.vfs = pdfFonts.pdfMake.vfs
                pdfMake.fonts = {
                    // download default Roboto font from cdnjs.com
                    Roboto: {
                        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
                        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
                        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
                        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
                    },
                    // Kanit Font
                    Kanit: { // 3. set Kanit font
                        normal: 'Kanit-Regular.ttf',
                        bold: 'Kanit-Medium.ttf',
                        italics: 'Kanit-Italic.ttf',
                        bolditalics: 'Kanit-MediumItalic.ttf'          
                    }
                }

                const docDefinition = {
                    pageOrientation: 'landscape',
                    header: {
                        columns: [
                            { text: nameTypeDoc, alignment: 'center', style: 'header'}
                        ]
                    },
                    content: [
                        {
                            layout: 'lightHorizontalLines',
                            table: {
                                headerRows: 1,
                                widths: [ 100, 200],
                                body: body
                            }
                        }
                    ],
                    styles: {
                        header: {
                            fontSize: 14,
                            bold: true
                        },
                        anotherStyle: {
                           fontSize: 10
                        }
                    },
                    defaultStyle: {
                        font: 'Kanit'
                    }
                }

                pdfMake.createPdf(docDefinition).open()
                
            } catch (error) {
                
            }
        }
    }
}
</script>

