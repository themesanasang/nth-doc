<template>
    <section class="section">

       <b-tabs v-model="activeTab">

            <!-- === รับหนังสือ === -->
            <b-tab-item label="รับหนังสือ" icon="arrow-down">
                
                <div v-show="isAuthenticated" class="mb-4">
                   <b-button
                        label="รับหนังสือ"
                        type="is-success"
                        icon-left="plus"
                        @click="cardModalReceive" />
                </div>

                <!-- table receive -->
                <b-table
                    ref="table"
                    :data="docReceiveData"
                    paginated
                    pagination-size="is-small"
                    per-page="10"
                    detailed
                    detail-key="id"
                    aria-page-label="Page"
                    aria-next-label="Next page"
                    aria-previous-label="Previous page"
                    aria-current-label="Current page">

                    <b-table-column v-slot="props" field="book_number" label="เลขหนังสือ" width="180" sortable searchable>
                        <a @click="props.toggleDetails(props.row)">
                            {{ props.row.book_number }}
                        </a>
                    </b-table-column>

                    <b-table-column v-slot="props" field="book_name"  label="ชื่อหนังสือ" sortable searchable>
                        <a @click="props.toggleDetails(props.row)">
                            {{ props.row.book_name }}
                        </a>
                    </b-table-column>

                    <b-table-column v-slot="props" field="date_receive" label="วันที่รับ" sortable searchable centered width="150">
                        {{ props.row.date_receive }}
                    </b-table-column>

                    
                    <b-table-column v-if="isAuthenticated"  v-slot="props" label="" >
                        <div class="field is-grouped">
                            <p class="control">
                                <a class="button is-dark is-small is-outlined" @click="editItemReceive(props.row)">
                                    <b-icon icon="pen" size="is-small"></b-icon>
                                </a>
                            </p>
                            <p class="control">
                                <a class="button is-dark is-small is-outlined" @click="deleteItemReceive(props.row)">
                                    <b-icon icon="delete" size="is-small"></b-icon>
                                </a>
                            </p>
                        </div> 
                    </b-table-column>

                    <template #detail="props">
                        <article class="panel is-primary">
                            <p class="panel-block has-text-grey-lighter">รหัส: {{ props.row.id }}</p>
                            <p class="panel-block has-text-grey-lighter">เลขหนังสือ: {{ props.row.book_number }}</p>
                            <p class="panel-block has-text-grey-lighter">ชื่อหนังสือ: {{ props.row.book_name }}</p>
                            <p class="panel-block has-text-grey-lighter">วันรับ: {{ props.row.date_receive }} เวลารับ {{ props.row.time_receive }}</p>
                            <p class="panel-block has-text-grey-lighter">ส่งจาก: {{ props.row.agency_name }}</p>
                            <p class="panel-block has-text-grey-lighter">ถึง: {{ props.row.receiver_name }}</p>
                            <p class="panel-block has-text-grey-lighter">หมายเหตุ: {{ props.row.note }}</p>
                        </article>
                    </template>

                    <template #empty>
                        <div class="has-text-centered">ไม่มีข้อมูล</div>
                    </template>
                </b-table>
                <!-- ./table receive -->

            </b-tab-item>
            <!-- === ./รับหนังสือ === -->

            <!-- === ส่งหนังสือ === -->
            <b-tab-item label="ส่งหนังสือ" icon="arrow-up">
                
                <div v-show="isAuthenticated" class="mb-4">
                   <b-button
                        label="ส่งหนังสือ"
                        type="is-warning"
                        icon-left="plus"
                        @click="cardModalSend" />
                </div>

                <!-- table send -->
                <b-table
                    ref="table"
                    :data="docSendData"
                    paginated
                    pagination-size="is-small"
                    per-page="10"
                    detailed
                    detail-key="id"
                    aria-page-label="Page"
                    aria-next-label="Next page"
                    aria-previous-label="Previous page"
                    aria-current-label="Current page">

                    <b-table-column v-slot="props" field="book_number" label="เลขหนังสือ" width="180" sortable searchable>
                        <a @click="props.toggleDetails(props.row)">
                            {{ props.row.book_number }}
                        </a>
                    </b-table-column>

                    <b-table-column v-slot="props" field="book_name"  label="ชื่อหนังสือ" sortable searchable>
                        <a @click="props.toggleDetails(props.row)">
                            {{ props.row.book_name }}
                        </a>
                    </b-table-column>

                    <b-table-column v-slot="props" field="date_send" label="วันที่ส่ง" sortable searchable centered width="150">
                        {{ props.row.date_send }}
                    </b-table-column>

                    
                    <b-table-column v-if="isAuthenticated"  v-slot="props" label="" >
                        <div class="field is-grouped">
                            <p class="control">
                                <a class="button is-dark is-small is-outlined" @click="editItemSend(props.row)">
                                    <b-icon icon="pen" size="is-small"></b-icon>
                                </a>
                            </p>
                            <p class="control">
                                <a class="button is-dark is-small is-outlined" @click="deleteItemSend(props.row)">
                                    <b-icon icon="delete" size="is-small"></b-icon>
                                </a>
                            </p>
                        </div> 
                    </b-table-column>

                    <template #detail="props">
                        <article class="panel is-primary">
                            <p class="panel-block has-text-grey-lighter">รหัส: {{ props.row.id }}</p>
                            <p class="panel-block has-text-grey-lighter">เลขหนังสือ: {{ props.row.book_number }}</p>
                            <p class="panel-block has-text-grey-lighter">ชื่อหนังสือ: {{ props.row.book_name }}</p>
                            <p class="panel-block has-text-grey-lighter">วันส่ง: {{ props.row.date_send }} เวลารับ {{ props.row.time_send }}</p>
                            <p class="panel-block has-text-grey-lighter">ส่งจาก: {{ props.row.agency_name }}</p>
                            <p class="panel-block has-text-grey-lighter">ถึง: {{ props.row.receiver_name }}</p>
                            <p class="panel-block has-text-grey-lighter">หมายเหตุ: {{ props.row.note }}</p>
                        </article>
                    </template>

                    <template #empty>
                        <div class="has-text-centered">ไม่มีข้อมูล</div>
                    </template>
                </b-table>
                <!-- ./table send -->

            </b-tab-item>
            <!-- === ./ส่งหนังสือ === -->

        </b-tabs>
       
    </section>
</template>

<script>
import CryptoJS from 'crypto-js'
import { mapGetters } from 'vuex'
import ModalReceive from '~/components/ModalFormReceive'
import ModalFormSendVue from '~/components/ModalFormSend.vue'

export default {
    name: 'HomePage',
    data() {
        return {
            activeTab: 0,
            docReceiveData: [],
            docSendData: []
        }
    }, 
    computed: {
        ...mapGetters(['isAuthenticated']),
    },
    mounted () {
        $(function(){
            $("table input[type=text]").attr('placeholder', 'ค้นหา...')
        })
        
        this.fetchDataReceive()
        this.fetchDataSend()
    },
    methods: {
        async fetchDataReceive () {
            try {
                const receiveData = await this.$axios.get('/api/v1/doc/receive/list')
                this.docReceiveData = receiveData.data
            } catch (error) {
                this.$buefy.toast.open({message: `ไม่สามารถโหลดข้อมูลหนังสือได้ กรุณาแจ้งผู้ดูแลระบบ`, type: 'is-danger'})
            }
        },
        async fetchDataSend () {
            try {
                const sendData = await this.$axios.get('/api/v1/doc/send/list')
                this.docSendData = sendData.data
            } catch (error) {
                this.$buefy.toast.open({message: `ไม่สามารถโหลดข้อมูลหนังสือได้ กรุณาแจ้งผู้ดูแลระบบ`, type: 'is-danger'})
            }
        },
        cardModalReceive() {
            this.$buefy.modal.open({
                parent: this,
                component: ModalReceive,
                hasModalCard: true,
                fullScreen: true,
                canCancel: false,
                props: {
                    typeAction: 'new',
                    dateReceiveData: new Date(),
                    timeReceiveData: new Date(),
                    agencyNameData: '',
                    bookNumberData: '',
                    bookNameData: '',
                    groupNameData: null,
                    bookDateData: new Date(),
                    receiverNameData: '',
                    noteData: '',
                },
                events: {
                    'close':value => {
                        if(value === 'ok'){
                            this.fetchDataReceive()
                            this.$buefy.toast.open({message: 'รับหนังสือใหม่เรียบร้อยแล้ว', type: 'is-success'})
                        }
                    }
                },
            })
        },
        async editItemReceive(item) {
            try {
                const id = String(item.id)
                const ciphertext = CryptoJS.AES.encrypt(id, process.env.SECRET_KEY)
                const result  = await this.$axios.get('/api/v1/doc/receive/'+encodeURIComponent(ciphertext))

                // this.$console.log(result.data[0].time_receive)

                this.$buefy.modal.open({
                    parent: this,
                    component: ModalReceive,
                    hasModalCard: true,
                    fullScreen: true,
                    canCancel: false,
                    props: {
                        typeAction: 'edit',
                        idBook: result.data[0].id,
                        dateReceiveData: new Date(result.data[0].date_r),
                        timeReceiveData: new Date(result.data[0].date_r+' '+result.data[0].time_receive),
                        agencyIDData: result.data[0].agency,
                        agencyNameData: result.data[0].agency_name,
                        bookNumberData: result.data[0].book_number,
                        bookNameData: result.data[0].book_name,
                        groupNameData: result.data[0].group,
                        bookDateData: new Date(result.data[0].date_b),
                        receiverIDData: result.data[0].receiver,
                        receiverNameData: result.data[0].receiver_name,
                        noteData: result.data[0].note,
                    },
                    events: {
                        'close':value => {
                            if(value === 'ok'){
                                this.fetchDataReceive()
                                this.$buefy.toast.open({message: 'แก้ไขข้อมูลเรียบร้อยแล้ว', type: 'is-success'})
                            }
                        }
                    },
                })
                
            } catch (error) {
                
            }
        },
        async deleteItemReceive(item) {
            try {
                await this.$buefy.dialog.confirm({
                    title: 'ลบหนังสือรับเข้า',
                    message: 'คุณต้องการลบหนังสือรับเข้า ใช่ หรือ ไม่',
                    confirmText: 'ลบ',
                    cancelText: 'ยกเลิก',
                    type: 'is-danger',
                    hasIcon: true,
                    onConfirm: () => {
                        try {
                            const id = String(item.id)
                            const ciphertext = CryptoJS.AES.encrypt(id, process.env.SECRET_KEY)
                            this.$axios.delete('/api/v1/doc/receive/'+encodeURIComponent(ciphertext))

                            this.$buefy.toast.open({message: `ลบหนังสือรับเข้า หมายเลข `+item.id +' เรียบร้อยแล้ว', type: 'is-success'})
                            location.reload();
                        } catch (error) {
                            this.$buefy.toast.open({message: `ไม่สามารถลบหนังสือรับเข้า หมายเลข `+item.id +' ได้', type: 'is-danger'})
                        }
                    }
                })
            } catch (error) {
                
            }
        },
        cardModalSend() {
            this.$buefy.modal.open({
                parent: this,
                component: ModalFormSendVue,
                hasModalCard: true,
                fullScreen: true,
                canCancel: false,
                props: {
                    typeAction: 'new',
                    dateSendData: new Date(),
                    timeSendData: new Date(),
                    agencyNameData: '',
                    bookNumberData: '',
                    bookNameData: '',
                    groupNameData: null,
                    bookDateData: new Date(),
                    receiverNameData: '',
                    noteData: '',
                },
                events: {
                    'close':value => {
                        if(value === 'ok'){
                            this.fetchDataSend()
                            this.$buefy.toast.open({message: 'ส่งหนังสือใหม่เรียบร้อยแล้ว', type: 'is-success'})
                        }
                    }
                },
            })
        },
        async editItemSend(item) {
            try {
                const id = String(item.id)
                const ciphertext = CryptoJS.AES.encrypt(id, process.env.SECRET_KEY)
                const result  = await this.$axios.get('/api/v1/doc/send/'+encodeURIComponent(ciphertext))

                this.$buefy.modal.open({
                    parent: this,
                    component: ModalFormSendVue,
                    hasModalCard: true,
                    fullScreen: true,
                    canCancel: false,
                    props: {
                        typeAction: 'edit',
                        idBook: result.data[0].id,
                        dateSendData: new Date(result.data[0].date_r),
                        timeSendData: new Date(result.data[0].date_r+' '+result.data[0].time_send),
                        agencyIDData: result.data[0].agency,
                        agencyNameData: result.data[0].agency_name,
                        bookNumberData: result.data[0].book_number,
                        bookNameData: result.data[0].book_name,
                        groupNameData: result.data[0].group,
                        bookDateData: new Date(result.data[0].date_b),
                        receiverIDData: result.data[0].receiver,
                        receiverNameData: result.data[0].receiver_name,
                        noteData: result.data[0].note,
                    },
                    events: {
                        'close':value => {
                            if(value === 'ok'){
                                this.fetchDataSend()
                                this.$buefy.toast.open({message: 'แก้ไขข้อมูลเรียบร้อยแล้ว', type: 'is-success'})
                            }
                        }
                    },
                })
                
            } catch (error) {
                
            }
        },
        async deleteItemSend(item) {
            try {
                await this.$buefy.dialog.confirm({
                    title: 'ลบหนังสือส่ง',
                    message: 'คุณต้องการลบหนังสือส่ง ใช่ หรือ ไม่',
                    confirmText: 'ลบ',
                    cancelText: 'ยกเลิก',
                    type: 'is-danger',
                    hasIcon: true,
                    onConfirm: () => {
                        try {
                            const id = String(item.id)
                            const ciphertext = CryptoJS.AES.encrypt(id, process.env.SECRET_KEY)
                            this.$axios.delete('/api/v1/doc/send/'+encodeURIComponent(ciphertext))

                            this.$buefy.toast.open({message: `ลบหนังสือส่ง หมายเลข `+item.id +' เรียบร้อยแล้ว', type: 'is-success'})
                            location.reload();
                        } catch (error) {
                            this.$buefy.toast.open({message: `ไม่สามารถลบหนังสือส่ง หมายเลข `+item.id +' ได้', type: 'is-danger'})
                        }
                    }
                })
            } catch (error) {
                
            }
        }
    }
}
</script>
