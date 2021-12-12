<template>
   
   <div class="modal-card" style="width: 340px">
        <header class="modal-card-head">
            <p class="modal-card-title">ผู้ใช้งาน</p>
        </header>
        <section class="modal-card-body">

            <b-field v-if="typeAction === 'new'" label="ชื่อผู้ใช้งาน *" :type="{ 'is-danger': hasUsernameError }" :message="{ 'กรุณากรอกชื่อผู้ใช้งาน': hasUsernameError }" >
                <b-input
                    v-model="username"
                    type="text">
                </b-input>
            </b-field>
            <b-field v-if="typeAction === 'new'" label="รหัสผ่าน *" :type="{ 'is-danger': hasPasswordError }" :message="{ 'กรุณากรอกรหัสผ่าน': hasPasswordError }" >
                <b-input
                    v-model="password"
                    type="password">
                </b-input>
            </b-field>
            <b-field label="ชื่อจริง *" :type="{ 'is-danger': hasFirstnameError }" :message="{ 'กรุณากรอกชื่อจริง': hasFirstnameError }" >
                <b-input
                    v-model="firstname"
                    type="text">
                </b-input>
            </b-field>
            <b-field label="นามสกุล *" :type="{ 'is-danger': hasLastnameError }" :message="{ 'กรุณากรอกนามสกุล': hasLastnameError }" >
                <b-input
                    v-model="lastname"
                    type="text">
                </b-input>
            </b-field>
            <b-field label="Email" >
                <b-input
                    v-model="email"
                    type="text">
                </b-input>
            </b-field>
             <b-field label="Line ID" >
                <b-input
                    v-model="line_id"
                    type="text">
                </b-input>
            </b-field>
            <b-field label="แผนก" :type="{ 'is-danger': hasDepError }" :message="{ 'กรุณาเลือกแผนก': hasDepError }" expanded>
                <b-select v-model="department" placeholder="เลือกแผนก" expanded>
                    <option v-for="item in depData" :key="item.id" :value="item.id" >
                        {{ item.department }}
                    </option>
                </b-select>
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
        idUser: {
            type: String,
            required: true
        },
        usernameData: {
            type: String,
            required: true
        },
        passwordData: {
            type: String,
            required: true
        },
        firstnameData: {
            type: String,
            required: true
        },
        lastnameData: {
            type: String,
            required: true
        },
        emailData: {
            type: String,
            required: true
        },
        lineidData: {
            type: String,
            required: true
        },
        departmentData: {
            type: String,
            required: true
        },
        statusData: {
            type: String,
            required: true
        }
    },
    data() {
       return {
        username: this.usernameData,
        password: this.passwordData,
        firstname: this.firstnameData,
        lastname: this.lastnameData,
        email: this.emailData,
        line_id: this.lineidData,
        department: this.departmentData,
        status: this.statusData,

        hasUsernameError: false,
        hasPasswordError: false,
        hasFirstnameError: false,
        hasLastnameError: false,
        hasDepError: false,

        depData: [],

        dataPost: {
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            email: '',
            line_id: '',
            department: '',
            status: '',
        },

        dataPut: {
            firstname: '',
            lastname: '',
            email: '',
            line_id: '',
            department: '',
            status: '',
        },
       }
    },
    async fetch() {
        const dep = await this.$axios.get('/api/v1/department/open')
        this.depData = dep.data;
    },
    methods: {  
        async save () {
            this.hasUsernameError = false
            this.hasPasswordError = false
            this.hasFirstnameError = false
            this.hasLastnameError = false
            this.hasDepError = false;

            if(this.typeAction === 'new') {
                if(this.username === '' || this.username === null) {
                    this.hasUsernameError = true
                }

                if(this.password === '' || this.password === null) {
                    this.hasPasswordError = true
                }
            }

            if(this.firstname === '' || this.firstname === null) {
                this.hasFirstnameError = true
            }

            if(this.lastname === '' || this.lastname === null) {
                this.hasLastnameError = true
            }

             if(this.department === '' || this.department === null) {
                this.hasDepError = true
            }

            if(this.hasUsernameError === true || this.hasPasswordError === true || this.hasFirstnameError === true || this.hasLastnameError === true || this.hasDepError === true){
                return
            }

            if(this.typeAction === 'new') {
                this.dataPost = {
                    username: this.username,
                    password: this.password,
                    firstname: this.firstname,
                    lastname: this.lastname,
                    email: this.email,
                    line_id: this.line_id,
                    department: this.department,
                    status: ((this.status === true)?'Y':'N')
                }
            } else {
                this.dataPut = {
                    firstname: this.firstname,
                    lastname: this.lastname,
                    email: this.email,
                    line_id: this.line_id,
                    department: this.department,
                    status: ((this.status === true || this.status === 'true')?'Y':'N')
                }
            }

            try {

                let result = ''

                if(this.typeAction === 'new') {
                    result = await this.$axios.$post(`/api/v1/user`,  this.dataPost)
                } else {
                    const id = String(this.idUser)
                    const ciphertext = CryptoJS.AES.encrypt(id, process.env.SECRET_KEY)
                    result = await this.$axios.$put(`/api/v1/user/`+encodeURIComponent(ciphertext),  this.dataPut)
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
