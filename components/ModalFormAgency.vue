<template>
   
   <div class="modal-card" style="width: 320px">
        <header class="modal-card-head">
            <p class="modal-card-title">หน่วยงานผู้ส่ง</p>
        </header>
        <section class="modal-card-body">

            <b-field label="ชื่อหน่วยงาน *" :type="{ 'is-danger': hasAgencyError }" :message="{ 'กรุณากรอกชื่อหน่วยงาน': hasAgencyError }" >
                <b-input
                    v-model="agency"
                    type="text">
                </b-input>
            </b-field>
            <b-field>
                <b-switch 
                v-model="status"
                :value="true"
                type="is-success">
                    เปิดใช้งาน
                </b-switch>
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
        idAgency: {
            type: String,
            required: true
        },
        agencyName: {
            type: String,
            required: true
        },
        agencyStatus: {
            type: String,
            required: true
        }
    },
    data() {
       return {
        agency: this.agencyName,
        status: this.agencyStatus,

        hasAgencyError: false,
        dataPost: {
            agency: '',
            status: '',
        }
       }
    },
    methods: {  
        async save () {
            this.hasAgencyError = false;

            if(this.agency === '' || this.agency === null) {
                this.hasAgencyError = true
                return
            }

            this.dataPost = {
                agency: this.agency,
                status: ((this.status === true || this.status === 'true')?'Y':'N')
            }

            try {

                let result = ''

                if(this.typeAction === 'new') {
                    result = await this.$axios.$post(`/api/v1/doc/agency`,  this.dataPost)
                } else {
                    const id = String(this.idAgency)
                    const ciphertext = CryptoJS.AES.encrypt(id, process.env.SECRET_KEY)
                    result = await this.$axios.$put(`/api/v1/doc/agency/`+encodeURIComponent(ciphertext),  this.dataPost)
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
