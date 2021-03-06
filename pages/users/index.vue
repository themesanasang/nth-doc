<template>
    <section class="section">
        <header class="docs-header">
            <b-breadcrumb align="is-left" size="is-medium">
                <b-breadcrumb-item tag='router-link' to="/">หน้าหลัก</b-breadcrumb-item>
                <b-breadcrumb-item tag='router-link' to="users">ผู้ใช้งาน</b-breadcrumb-item>
            </b-breadcrumb>
        </header>

        <div class="mb-4">
            <b-button
                label="เพิ่มผู้ใช้งาน"
                type="is-success"
                icon-left="plus"
                @click="cardModal"/>
        </div>

        <div class="columns">
            <div class="column">
                <b-table
                    ref="table"
                    :data="userData"
                    paginated
                    pagination-size="is-small"
                    per-page="10"
                    detailed
                    detail-key="id"
                    aria-page-label="Page"
                    aria-next-label="Next page"
                    aria-previous-label="Previous page"
                    aria-current-label="Current page">

                    <b-table-column v-slot="props" field="firstname" label="ชื่อ" sortable searchable>
                        <a @click="props.toggleDetails(props.row)">
                            {{ props.row.firstname }}
                        </a>
                    </b-table-column>

                    <b-table-column v-slot="props" field="lastname" label="นามสกุล" sortable searchable>
                        {{ props.row.lastname }}
                    </b-table-column>

                    <b-table-column v-slot="props" field="department_name" label="แผนก" sortable searchable>
                        {{ props.row.department_name }}
                    </b-table-column>

                    <b-table-column v-slot="props" field="status"  label="สถานะ" sortable width="100">
                        <b-icon
                            :icon="props.row.status === 'Y' ? 'check' : 'close'"
                            :type="props.row.status === 'Y' ? 'is-success' : 'is-danger'">
                        </b-icon>
                    </b-table-column>

                    <b-table-column  v-slot="props" label="" >
                        <div class="field is-grouped">
                            <p class="control">
                                <a class="button is-dark is-small is-outlined" @click="editItem(props.row)">
                                    <b-icon icon="pen" size="is-small"></b-icon>
                                </a>
                            </p>
                            <p class="control">
                                <a class="button is-dark is-small is-outlined" @click="deleteItem(props.row)">
                                    <b-icon icon="delete" size="is-small"></b-icon>
                                </a>
                            </p>
                        </div>
                    </b-table-column>

                     <template #detail="props">
                        <article class="panel is-primary">
                            <p class="panel-block has-text-grey-lighter">ชื่อผู้ใช้งาน: {{ props.row.username }}</p>
                            <p class="panel-block has-text-grey-lighter">Email: {{ props.row.email }}</p>
                            <p class="panel-block has-text-grey-lighter">Line-ID: {{ props.row.line_id }}</p>
                            <p class="panel-block has-text-grey-lighter">วันที่สร้าง: {{ props.row.date_create }}</p>
                            <p class="panel-block has-text-grey-lighter">วันที่แก้ไข: {{ props.row.date_update }}</p>
                        </article>
                    </template>

                    <template #empty>
                        <div class="has-text-centered">ไม่มีข้อมูล</div>
                    </template>
                </b-table>
            </div>
        </div>
       
    </section>
</template>

<script>
import CryptoJS from 'crypto-js'
import ModalFormUserVue from '../../components/ModalFormUser.vue'

export default {
   middleware: ['auth-user'],
   data() {
        return {
            userData: [],
        }
    }, 
    mounted () {
        $(function(){
            $("table input[type=text]").attr('placeholder', 'ค้นหา...')
        })

        this.fetchData()
    },
    methods: {
        async fetchData () {
            const result = await this.$axios.get('/api/v1/user')
            this.userData = result.data
        },
        cardModal() {
            this.$buefy.modal.open({
                parent: this,
                component: ModalFormUserVue,
                hasModalCard: true,
                fullScreen: false,
                canCancel: false,
                props: {
                    typeAction: 'new',
                    usernameData: '',
                    passwordData: '',
                    firstnameData: '',
                    lastnameData: '',
                    emailData: '',
                    lineidData: '',
                    departmentData: null,
                    statusData: true
                },
                events: {
                    'close':value => {
                        if(value === 'ok'){
                            this.fetchData()
                            this.$buefy.toast.open({message: 'เพิ่มผู้ใช้ใหม่ เรียบร้อยแล้ว', type: 'is-success'})
                        }
                    }
                },
            })
        },
        async editItem(item) {
            try {
                const id = String(item.uuid)
                const ciphertext = CryptoJS.AES.encrypt(id, process.env.SECRET_KEY)
                const result  = await this.$axios.get('/api/v1/user/'+encodeURIComponent(ciphertext))

                this.$buefy.modal.open({
                    parent: this,
                    component: ModalFormUserVue,
                    hasModalCard: true,
                    fullScreen: false,
                    canCancel: false,
                    props: {
                        typeAction: 'edit',
                        idUser: result.data[0].uuid,
                        firstnameData: result.data[0].firstname,
                        lastnameData: result.data[0].lastname,
                        emailData: result.data[0].email,
                        lineidData: result.data[0].line_id,
                        departmentData: result.data[0].department,
                        statusData: ((result.data[0].status === 'Y')?'true':'false')
                    },
                    events: {
                        'close':value => {
                            if(value === 'ok'){
                                this.fetchData()
                                this.$buefy.toast.open({message: 'แก้ไขข้อมูล เรียบร้อยแล้ว', type: 'is-success'})
                            }
                        }
                    },
                })
                
            } catch (error) {
                
            }
        },
        async deleteItem(item) {
            try {
                await this.$buefy.dialog.confirm({
                    title: 'ลบผู้ใช้งาน',
                    message: 'คุณต้องการลบผู้ใช้งาน ใช่ หรือ ไม่',
                    confirmText: 'ลบ',
                    cancelText: 'ยกเลิก',
                    type: 'is-danger',
                    hasIcon: true,
                    onConfirm: () => {
                        try {
                            const id = String(item.uuid)
                            const ciphertext = CryptoJS.AES.encrypt(id, process.env.SECRET_KEY)
                            this.$axios.delete('/api/v1/user/'+encodeURIComponent(ciphertext))

                            location.reload();
                            this.$buefy.toast.open({message: `ลบผู้ใช้งาน เรียบร้อยแล้ว `, type: 'is-success'})
                        } catch (error) {
                            this.$buefy.toast.open({message: `ไม่สามารถ ลบผู้ใช้งาน ได้ `, type: 'is-danger'})
                        }
                    }
                })
            } catch (error) {
                
            }
        },
    },
}

</script>
