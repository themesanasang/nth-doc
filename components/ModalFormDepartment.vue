<template>
   
   <div class="modal-card" style="width: 320px">
        <header class="modal-card-head">
            <p class="modal-card-title">แผนก</p>
        </header>
        <section class="modal-card-body">

            <b-field label="ชื่อแผนก *" :type="{ 'is-danger': hasDepError }" :message="{ 'กรุณากรอกชื่อแผนก': hasDepError }" >
                <b-input
                    v-model="department"
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
        idDep: {
            type: String,
            required: true
        },
        departmentName: {
            type: String,
            required: true
        },
        departmentStatus: {
            type: String,
            required: true
        }
    },
    data() {
       return {
        department: this.departmentName,
        status: this.departmentStatus,

        hasDepError: false,
        dataPost: {
            department: '',
            status: '',
        }
       }
    },
    methods: {  
        async save () {
            this.hasDepError = false;

            if(this.department === '' || this.department === null) {
                this.hasDepError = true
                return
            }

            this.dataPost = {
                department: this.department,
                status: ((this.status === true)?'Y':'N')
            }

            try {

                let result = ''

                if(this.typeAction === 'new') {
                    result = await this.$axios.$post(`/api/v1/department`,  this.dataPost)
                } else {
                    const id = String(this.idDep)
                    const ciphertext = CryptoJS.AES.encrypt(id, process.env.SECRET_KEY)
                    result = await this.$axios.$put(`/api/v1/department/`+encodeURIComponent(ciphertext),  this.dataPost)
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
