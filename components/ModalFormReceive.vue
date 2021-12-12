<template>
   
   <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">รับหนังสือ</p>
        </header>
        <section class="modal-card-body">

            <b-field grouped>
                <b-field label="วันที่รับ *" expanded>
                    <b-datepicker
                        v-model="dateReceive"
                        locale="th"
                        placeholder="เลือกวันที่..."
                        icon="calendar-today"
                        trap-focus>
                    </b-datepicker>
                </b-field>
                <b-field label="เวลารับ *" expanded>
                    <b-timepicker
                        v-model="time_receive"
                        placeholder="เลือกเวลา..."
                        icon="clock"
                        locale="th">
                    </b-timepicker>
                </b-field>
            </b-field>

            <b-field grouped>
                <b-field label="ผู้ส่งหนังสือ *" :type="{ 'is-danger': hasAgencyError }" :message="{ 'กรุณาเลิอกผู้ส่งหนังสือ': hasAgencyError }" expanded>
                    <b-autocomplete
                        v-model="agencyName"
                        placeholder="ค้นหา...ชื่อ"
                        :keep-first="keepFirst"
                        :open-on-focus="openOnFocus"
                        :data="filteredDataObjAgency"
                        field="agency"
                        :clearable="clearable"
                        @select="option => (selectedAgency = option)">
                    </b-autocomplete>
                </b-field>
                <b-field label="เลขหนังสือ *" :type="{ 'is-danger': hasBooknumberError }" :message="{ 'กรุณากรอกเลขหนังสือ': hasBooknumberError }" expanded>
                    <b-input
                        v-model="book_number"
                        type="text">
                    </b-input>
                </b-field>
            </b-field>

            <b-field grouped>
                <b-field label="วันที่ออกหนังสือ *" expanded>
                    <b-datepicker
                        v-model="book_date"
                        locale="th"
                        placeholder="เลือกวันที่..."
                        icon="calendar-today"
                        trap-focus>
                    </b-datepicker>
                </b-field>
                 <b-field label="ประเภทหนังสือ *" :type="{ 'is-danger': hasGroupidError }" :message="{ 'กรุณาเลือกประเภทหนังสือ': hasGroupidError }" expanded>
                    <b-select v-model="groupName" placeholder="เลือกประเภทหนังสือ" expanded>
                        <option v-for="item in docgroupData" :key="item.id" :value="item.id" >
                            {{ item.group }}
                        </option>
                    </b-select>
                </b-field>
            </b-field>
            
            <b-field grouped>
                <b-field label="ชื่อหนังสือ *" :type="{ 'is-danger': hasBooknameError }" :message="{ 'กรุณากรอกชื่อหนังสือ': hasBooknameError }" expanded>
                    <b-input
                        v-model="book_name"
                        type="text">
                    </b-input>
                </b-field>
                <b-field label="ผู้รับหนังสือ *" :type="{ 'is-danger': hasReceiverError }" :message="{ 'กรุณากรอกผู้รับหนังสือ': hasReceiverError }" expanded>
                    <b-autocomplete
                        v-model="receiverName"
                        placeholder="ค้นหา...ชื่อ"
                        :keep-first="keepFirst"
                        :open-on-focus="openOnFocus"
                        :data="filteredDataObjReceiver"
                        field="receiver"
                        :clearable="clearable"
                        @select="option => (selectedReceiver = option)">
                    </b-autocomplete>
                </b-field>
            </b-field>

            <b-field label="หมายเหตุ">
                <b-input v-model="note" maxlength="200" type="textarea"></b-input>
            </b-field>
            
            
            
        </section>
        <footer class="modal-card-foot is-justify-content-center">
            <b-button
                label="ยกเลิก"
                @click="$emit('close', 'no')" />
            <b-button
                label="บันทึก"
                type="is-success"
                @click="save" />
        </footer>
    </div>

</template>
<script>
import CryptoJS from 'crypto-js'
export default {
    props: {
        typeAction: {
            type: String,
            required: true
        },
        idBook: {
            type: String,
            required: true
        },
        dateReceiveData: {
            type: String,
            required: true
        },
        timeReceiveData: {
            type: String,
            required: true
        },
        agencyIDData: {
            type: String,
            required: true
        },
        agencyNameData: {
            type: String,
            required: true
        },
        bookNumberData: {
            type: String,
            required: true
        },
        bookNameData: {
            type: String,
            required: true
        },
        groupNameData: {
            type: String,
            required: true 
        },
        bookDateData: {
            type: String,
            required: true
        },
        receiverIDData: {
            type: String,
            required: true
        },
        receiverNameData: {
            type: String,
            required: true
        },
        noteData: {
            type: String,
            required: true
        },
    },
    data() {
        return {
            docgroupData: [],
            docagencyData: [],
            docreceiverData: [],

            book_number: this.bookNumberData,
            book_name: this.bookNameData,
            receiverName: this.receiverNameData,
            agencyName: this.agencyNameData,
            groupName: this.groupNameData,
            note: this.noteData,
            keepFirst: false,
            openOnFocus: true,
            selectedAgency: '',
            selectedReceiver: '',
            clearable: true,

            dateReceive: this.dateReceiveData,
            book_date: this.bookDateData,
            time_receive: this.timeReceiveData,

            hasAgencyError: false,
            hasReceiverError: false,
            hasBooknumberError: false,
            hasBooknameError: false,
            hasGroupidError: false,

            dataPost: {
                book_number: '',
                date_receive: '',
                time_receive: '',
                agency: '',
                receiver: '',
                book_name: '',
                book_date: '',
                note: '',
                group: '',
                created_by: ''
            }
        }
    },
    async fetch() {
        const group = await this.$axios.get('/api/v1/doc/group/open')
        this.docgroupData = group.data;

        const agencyData = await this.$axios.get('/api/v1/doc/agency/open')
        this.docagencyData = agencyData.data;

        const reciverData = await this.$axios.get('/api/v1/doc/receiver/open')
        this.docreceiverData = reciverData.data;
    },
    computed: {
        filteredDataObjAgency() {
            return this.docagencyData.filter(option => {
                return (
                    option.agency
                        .toString()
                        .toLowerCase()
                        .includes(this.agencyName.toLowerCase())
                )
            })
        },
        filteredDataObjReceiver() {
            return this.docreceiverData.filter(option => {
                return (
                    option.receiver
                        .toString()
                        .toLowerCase()
                        .includes(this.receiverName.toLowerCase())
                )
            })
        }
    },
    methods: {
        async save () {

            this.hasAgencyError = false
            this.hasReceiverError = false
            this.hasBooknumberError = false
            this.hasBooknameError = false
            this.hasGroupidError = false
            
            const date1 = new Date(this.dateReceive)
            const receiveD = "" + date1.getFullYear() + ((date1.getMonth() + 1) > 9 ? '' : '0') +'-'+ (date1.getMonth() + 1) +'-'+ (date1.getDate() > 9 ? '' : '0') + date1.getDate()
            
            const time1 = new Date(this.time_receive)
            const receiveT = time1.getHours() +':'+time1.getMinutes()

            const date2 = new Date(this.book_date)
            const bookD = "" + date2.getFullYear() + ((date2.getMonth() + 1) > 9 ? '' : '0') +'-'+ (date2.getMonth() + 1) +'-'+ (date2.getDate() > 9 ? '' : '0') + date2.getDate()
            

            if(this.agencyName === '' || this.agencyName === null) {
                this.hasAgencyError = true
            }

            if(this.book_number === '' || this.book_number === null) {
                this.hasBooknumberError = true
            }

            if(this.book_name === '' || this.book_name === null) {
                this.hasBooknameError = true
            }

            if(this.receiverName === '' || this.receiverName === null) {
                this.hasReceiverError = true
            }

            if(this.groupName === '' || this.groupName === null) {
                this.hasGroupidError = true
            }

            if(this.hasAgencyError === true || this.hasBooknumberError === true || this.hasBooknameError === true || this.hasReceiverError === true || this.hasGroupidError === true){
                return
            }

            /* this.$console.log(receiveD);
            this.$console.log(receiveT);
            this.$console.log(this.selectedAgency.id)
            this.$console.log(this.agencyName)
            this.$console.log(this.book_number)
            this.$console.log(bookD)
            this.$console.log(this.selectedReceiver.id)
            this.$console.log(this.receiverName)
            this.$console.log(this.groupName)
            this.$console.log(this.note)
            this.$console.log(this.$auth.user.uid) */

            this.dataPost = {
                book_number: this.book_number,
                date_receive: receiveD,
                time_receive: receiveT,
                agency: ((typeof(this.selectedAgency.id) === 'undefined')?this.agencyIDData:this.selectedAgency.id),
                receiver: ((typeof(this.selectedReceiver.id) === 'undefined')?this.receiverIDData:this.selectedReceiver.id),
                book_name: this.book_name,
                book_date: bookD,
                note: this.note,
                group: this.groupName,
                created_by: this.$auth.user.uid
            }

            try {
                let result = ''

                if(this.typeAction === 'new') {
                    result = await this.$axios.$post(`/api/v1/doc/receive`,  this.dataPost)
                } else {
                    const id = String(this.idBook)
                    const ciphertext = CryptoJS.AES.encrypt(id, process.env.SECRET_KEY)
                    result = await this.$axios.$put(`/api/v1/doc/receive/`+encodeURIComponent(ciphertext),  this.dataPost)
                }
                
                if (result) {
                    this.$emit('close', 'ok')
                }
            } catch (error) {
                
            }
            
        }
    }
}
</script>