<template>
   
   <div class="modal-card" style="width: 320px">
        <header class="modal-card-head">
            <p class="modal-card-title">หน่วยงานผู้รับ</p>
        </header>
        <section class="modal-card-body">

            <b-field label="หน่วยงานผู้รับ *" :type="{ 'is-danger': hasReceiverError }" :message="{ 'กรุณากรอกชื่อหน่วยงานผู้รับ': hasReceiverError }" >
                <b-input
                    v-model="receiver"
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
        idReceiver: {
            type: String,
            required: true
        },
        receiverName: {
            type: String,
            required: true
        },
        receiverStatus: {
            type: String,
            required: true
        }
    },
    data() {
       return {
        receiver: this.receiverName,
        status: this.receiverStatus,

        hasReceiverError: false,
        dataPost: {
            receiver: '',
            status: '',
        }
       }
    },
    methods: {  
        async save () {
            this.hasReceiverError = false;

            if(this.receiver === '' || this.receiver === null) {
                this.hasReceiverError = true
                return
            }

            this.dataPost = {
                receiver: this.receiver,
                status: ((this.status === true || this.status === 'true')?'Y':'N')
            }

            try {

                let result = ''

                if(this.typeAction === 'new') {
                    result = await this.$axios.$post(`/api/v1/doc/receiver`,  this.dataPost)
                } else {
                    const id = String(this.idReceiver)
                    const ciphertext = CryptoJS.AES.encrypt(id, process.env.SECRET_KEY)
                    result = await this.$axios.$put(`/api/v1/doc/receiver/`+encodeURIComponent(ciphertext),  this.dataPost)
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
