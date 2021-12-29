<template>
   <section class="section">
       
       <header class="docs-header">
            <b-breadcrumb align="is-left" size="is-medium">
                <b-breadcrumb-item tag='router-link' to="/">หน้าหลัก</b-breadcrumb-item>
                <b-breadcrumb-item tag='router-link' to="../reports">รายงาน</b-breadcrumb-item>
                <b-breadcrumb-item tag='router-link' to="../reports/report-summary">สรุปการ รับ-ส่ง หนังสือ</b-breadcrumb-item>
            </b-breadcrumb>
        </header>

        <div class="columns">
            <div class="column">

                <div class="box-condition">

                    <b-field grouped>
                        <b-field label="ประเภท *" :type="{ 'is-danger': hasTypeDocError }" :message="{ 'กรุณาเลือกประเภทหนังสือ': hasTypeDocError }">
                            <b-select v-model="typeDoc" placeholder="เลือกประเภท" expanded>
                                <option value="receive">รับ-หนังสือ</option>
                                <option value="send">ส่ง-หนังสือ</option>
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

                <div v-if="docData.length > 0" class="has-text-right mt-5">
                    <p class="control">
                        <b-button label="ส่งออก Excel" type="is-info rounded" @click="exportData" />
                    </p>
                </div>

                <div v-if="docData.length > 0  && typeDoc === 'receive'" class="mt-2">
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

                        <b-table-column v-slot="props" field="id" label="เลขรับ" width="150" sortable>
                           {{ props.row.id }}
                        </b-table-column>

                        <b-table-column v-slot="props" field="book_number" label="เลขหนังสือ" width="180" sortable searchable>
                           {{ props.row.book_number }}
                        </b-table-column>

                        <b-table-column v-slot="props" field="book_name"  label="ชื่อหนังสือ" sortable searchable>
                            {{ props.row.book_name }}
                        </b-table-column>

                        <b-table-column v-slot="props" field="date_receive" label="วันที่รับ" sortable searchable centered width="150">
                            {{ props.row.date_receive }}
                        </b-table-column>

                         <b-table-column v-slot="props" field="receiver_name" label="ถึง" sortable searchable centered width="180">
                            {{ props.row.receiver_name }}
                        </b-table-column>

                        <template #empty>
                            <div class="has-text-centered">ไม่มีข้อมูล</div>
                        </template>
                    </b-table>
                    <!-- ./table receive -->
                </div>

                <div v-if="docData.length > 0 && typeDoc === 'send'" class="mt-2">
                    <!-- table send -->
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

                        <b-table-column v-slot="props" field="id" label="เลขส่ง" width="150" sortable>
                           {{ props.row.id }}
                        </b-table-column>

                        <b-table-column v-slot="props" field="book_number" label="เลขหนังสือ" width="180" sortable searchable>
                            {{ props.row.book_number }}
                        </b-table-column>

                        <b-table-column v-slot="props" field="book_name"  label="ชื่อหนังสือ" sortable searchable>
                             {{ props.row.book_name }}
                        </b-table-column>

                        <b-table-column v-slot="props" field="date_send" label="วันที่ส่ง" sortable searchable centered width="150">
                            {{ props.row.date_send }}
                        </b-table-column>

                        <b-table-column v-slot="props" field="receiver_name" label="ถึง" sortable searchable centered width="180">
                            {{ props.row.receiver_name }}
                        </b-table-column>

                        <template #empty>
                            <div class="has-text-centered">ไม่มีข้อมูล</div>
                        </template>
                    </b-table>
                    <!-- ./table send -->
                </div>

            </div>
        </div>

   </section>
</template>

<script>
import CryptoJS from 'crypto-js'
import XLSX from 'xlsx'

export default {
    layout: 'report-layout',
    middleware: ['auth-user'],
    data() {
        return {
            docData: [],

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
        async search () {
            this.hasTypeDocError = false;

            if(this.typeDoc === '' || this.typeDoc === null) {
                this.hasTypeDocError = true
                return
            }

            const d1 = new Date(this.date1)
            const dateStart = "" + d1.getFullYear() + ((d1.getMonth() + 1) > 9 ? '' : '0') +'-'+ (d1.getMonth() + 1) +'-'+ (d1.getDate() > 9 ? '' : '0') + d1.getDate()
            
            const d2 = new Date(this.date2)
            const dateEnd = "" + d2.getFullYear() + ((d2.getMonth() + 1) > 9 ? '' : '0') +'-'+ (d2.getMonth() + 1) +'-'+ (d2.getDate() > 9 ? '' : '0') + d2.getDate()
            
            const type = String(this.typeDoc)
            const ciphertext = CryptoJS.AES.encrypt(type, process.env.SECRET_KEY)

            try {
                const result = await this.$axios.get('/api/v1/report/getDataDocSummary/'+encodeURIComponent(ciphertext)+'/'+dateStart+'/'+dateEnd)
                this.docData = result.data;

                if(this.docData.length === 0) {
                    this.$buefy.toast.open({message: `ไม่มีข้อมูลที่ท่านต้องการค้นหา... กรุณารองใหม่อีกครั้ง`, type: 'is-warning'})
                } else{
                    $(function(){
                        $("table input[type=text]").attr('placeholder', 'ค้นหา...')
                    })
                }
            } catch (error) {
                this.$buefy.toast.open({message: `ไม่สามารถโหลดข้อมูลรายงานได้ กรุณาแจ้งผู้ดูแลระบบ`, type: 'is-danger'})
            }
        },
        exportData () {
           try {
                const dataWS = XLSX.utils.json_to_sheet(this.docData)
                const wb = XLSX.utils.book_new()
                XLSX.utils.book_append_sheet(wb, dataWS)
                XLSX.writeFile(wb,'report-summary.xlsx')
           } catch (error) {
               this.$buefy.toast.open({message: `ไม่สามารถส่งออกข้อมูลรายงานได้ กรุณาแจ้งผู้ดูแลระบบ`, type: 'is-danger'})
           }
        }
    }
}
</script>

