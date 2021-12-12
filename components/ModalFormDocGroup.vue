<template>
   
   <div class="modal-card" style="width: 320px">
        <header class="modal-card-head">
            <p class="modal-card-title">หมวดหนังสือ</p>
        </header>
        <section class="modal-card-body">

            <b-field label="หมวดหนังสือ *" :type="{ 'is-danger': hasGroupError }" :message="{ 'กรุณากรอกหมวดหนังสือ': hasGroupError }" >
                <b-input
                    v-model="group"
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
        idGroup: {
            type: String,
            required: true
        },
        groupName: {
            type: String,
            required: true
        },
        groupStatus: {
            type: String,
            required: true
        }
    },
    data() {
       return {
        group: this.groupName,
        status: this.groupStatus,

        hasGroupError: false,
        dataPost: {
            group: '',
            status: '',
        }
       }
    },
    methods: {  
        async save () {
            this.hasGroupError = false;

            if(this.group === '' || this.group === null) {
                this.hasGroupError = true
                return
            }

            this.dataPost = {
                group: this.group,
                status: ((this.status === true || this.status === 'true')?'Y':'N')
            }

            try {

                let result = ''

                if(this.typeAction === 'new') {
                    result = await this.$axios.$post(`/api/v1/doc/group`,  this.dataPost)
                } else {
                    const id = String(this.idGroup)
                    const ciphertext = CryptoJS.AES.encrypt(id, process.env.SECRET_KEY)
                    result = await this.$axios.$put(`/api/v1/doc/group/`+encodeURIComponent(ciphertext),  this.dataPost)
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
