<template>
    <section class="section">
        <header class="docs-header">
            <b-breadcrumb align="is-left" size="is-medium">
                <b-breadcrumb-item tag='router-link' to="/">หน้าหลัก</b-breadcrumb-item>
                <b-breadcrumb-item tag='router-link' to="receivers">หน่วยงานผู้รับ</b-breadcrumb-item>
            </b-breadcrumb>
            
        </header>

        <div class="mb-4">
            <b-button
                label="เพิ่มหน่วยงานผู้รับ"
                type="is-success"
                icon-left="plus"
                @click="cardModal" />

            <b-button
                v-if="checkedRows.length > 0"
                label="ลบ"
                type="is-danger"
                icon-left="delete"
                @click="deleteAll"/>
        </div>

        <div class="columns">
            <div class="column">
                <b-table
                    ref="table"
                    :data="receiverData"
                    paginated
                    pagination-size="is-small"
                    per-page="10"
                    :checked-rows.sync="checkedRows"
                    checkable
                    :checkbox-position="checkboxPosition"
                    aria-page-label="Page"
                    aria-next-label="Next page"
                    aria-previous-label="Previous page"
                    aria-current-label="Current page">

                    <b-table-column  v-slot="props" label="ลำดับ" width="60">
                        {{ props.row.row_num }}
                    </b-table-column>

                    <b-table-column v-slot="props" field="receiver" label="หน่วยงาน" sortable searchable>
                        {{ props.row.receiver }}
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
import ModalFormReceiverVue from '../../components/ModalFormReceiver.vue'

export default {
    middleware: ['auth-user'],
    data() {
        return {
            receiverData: [],
            checkboxPosition: 'left',
            checkedRows: []
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
            const result = await this.$axios.get('/api/v1/doc/receiver')
            this.receiverData = result.data[0]
        },
        cardModal() {
            this.$buefy.modal.open({
                parent: this,
                component: ModalFormReceiverVue,
                hasModalCard: true,
                fullScreen: false,
                canCancel: false,
                props: {
                    typeAction: 'new',
                    receiverName: '',
                    receiverStatus: true
                },
                events: {
                    'close':value => {
                        if(value === 'ok'){
                            this.fetchData()
                            this.$buefy.toast.open({message: 'เพิ่มเรียบร้อยแล้ว', type: 'is-success'})
                        }
                    }
                },
            })
        },
        async editItem(item) {
            try {
                const id = String(item.id)
                const ciphertext = CryptoJS.AES.encrypt(id, process.env.SECRET_KEY)
                const result  = await this.$axios.get('/api/v1/doc/receiver/'+encodeURIComponent(ciphertext))

                this.$buefy.modal.open({
                    parent: this,
                    component: ModalFormReceiverVue,
                    hasModalCard: true,
                    fullScreen: false,
                    canCancel: false,
                    props: {
                        typeAction: 'edit',
                        idReceiver: result.data[0].id,
                        receiverName: result.data[0].receiver,
                        receiverStatus: ((result.data[0].status === 'Y')?'true':'false')
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
                    title: 'ลบหน่วยงาน',
                    message: 'คุณต้องการลบหน่วยงาน ใช่ หรือ ไม่',
                    confirmText: 'ลบ',
                    cancelText: 'ยกเลิก',
                    type: 'is-danger',
                    hasIcon: true,
                    onConfirm: () => {
                        try {
                            const id = String(item.id)
                            const ciphertext = CryptoJS.AES.encrypt(id, process.env.SECRET_KEY)
                            this.$axios.delete('/api/v1/doc/receiver/'+encodeURIComponent(ciphertext))

                            this.$buefy.toast.open({message: `ลบเรียบร้อยแล้ว`, type: 'is-success'})
                            location.reload();
                        } catch (error) {
                            this.$buefy.toast.open({message: `ไม่สามารถลบได้`, type: 'is-danger'})
                        }
                    }
                })
            } catch (error) {
                
            }
        },
        async deleteAll() {
            try {
                await this.$buefy.dialog.confirm({
                    title: 'ลบหน่วยงาน',
                    message: 'คุณต้องการลบหน่วยงาน ใช่ หรือ ไม่',
                    confirmText: 'ลบ',
                    cancelText: 'ยกเลิก',
                    type: 'is-danger',
                    hasIcon: true,
                    onConfirm: () => {
                        try {
                            for (const x in this.checkedRows) {
                                const id = String(this.checkedRows[x].id)
                                const ciphertext = CryptoJS.AES.encrypt(id, process.env.SECRET_KEY)
                                this.$axios.delete('/api/v1/doc/receiver/'+encodeURIComponent(ciphertext))
                            }

                            this.$buefy.toast.open({message: `ลบเรียบร้อยแล้ว`, type: 'is-success'})
                            location.reload();
                        } catch (error) {
                            this.$buefy.toast.open({message: `ไม่สามารถลบได้`, type: 'is-danger'})
                        }
                    }
                })
            } catch (error) {
                
            }
        },
    }
}

</script>
