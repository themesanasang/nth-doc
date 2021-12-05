<template>
    <section class="section">

       <b-tabs v-model="activeTab">

            <!-- รับหนังสือ -->
            <b-tab-item label="รับหนังสือ" icon="arrow-down">
                
                <div v-show="loggedIn" class="mb-4">
                   <b-button
                        label="รับหนังสือ"
                        type="is-success"
                        icon-left="plus"
                        @click="cardModal" />
                </div>

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

                    <b-table-column v-slot="props" field="book_number" label="เลขหนังสือ" width="180">
                        <a @click="props.toggleDetails(props.row)">
                            {{ props.row.book_number }}
                        </a>
                    </b-table-column>

                    <b-table-column v-slot="props" field="book_name"  label="ชื่อหนังสือ" sortable>
                        <a @click="props.toggleDetails(props.row)">
                            {{ props.row.book_name }}
                        </a>
                    </b-table-column>

                    <b-table-column v-slot="props" field="date_receive" label="วันที่รับ" sortable centered width="150">
                        {{ props.row.date_receive }}
                    </b-table-column>

                    
                    <b-table-column v-if="loggedIn"  v-slot="props" label="" >
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
                            <p class="panel-block has-text-grey-lighter">รหัส: {{ props.row.id }}</p>
                            <p class="panel-block has-text-grey-lighter">เลขหนังสือ: {{ props.row.book_number }}</p>
                            <p class="panel-block has-text-grey-lighter">ชื่อหนังสือ: {{ props.row.book_name }}</p>
                            <p class="panel-block has-text-grey-lighter">วันรับ: {{ props.row.date_receive }} เวลารับ {{ props.row.time_receive }}</p>
                            <p class="panel-block has-text-grey-lighter">ส่งจาก: {{ props.row.agency_name }}</p>
                            <p class="panel-block has-text-grey-lighter">ถึง: {{ props.row.receiver_name }}</p>
                            <p class="panel-block has-text-grey-lighter">หมายเหตุ: {{ props.row.note }}</p>
                        </article>
                    </template>
                </b-table>
            </b-tab-item>
            <!--./ รับหนังสือ -->

            <!-- ส่งหนังสือ -->
            <b-tab-item label="ส่งหนังสือ" icon="arrow-up">
                
            </b-tab-item>
            <!--./ ส่งหนังสือ -->

        </b-tabs>
       
    </section>
</template>

<script>
import CryptoJS from 'crypto-js'
import { mapState } from 'vuex'
import ModalReceive from '~/components/ModalFormReceive'


export default {
    name: 'HomePage',
    /* async asyncData({ $axios }) {
        const [receiveData] = await Promise.all([
            $axios.get('/api/v1/doc/receive/list')
        ])

        return { docReceiveData: receiveData.data }
    }, */
    data() {
        return {
            activeTab: 0,
            docReceiveData: []
        }
    }, 
    computed: {
        ...mapState('auth', ['loggedIn']),
    },
    mounted () {
        this.fetchData()
    },
    methods: {
        async fetchData () {
            const receiveData = await this.$axios.get('/api/v1/doc/receive/list')
            this.docReceiveData = receiveData.data
        },
        cardModal() {
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
                    groupNameData: '',
                    bookDateData: new Date(),
                    receiverNameData: '',
                    noteData: '',
                },
                events: {
                    'close':value => {
                        if(value === 'ok'){
                            this.fetchData()
                            this.$buefy.toast.open({message: 'รับหนังสือใหม่ เรียบร้อยแล้ว', type: 'is-success'})
                        }
                    }
                },
            })
        },
        async editItem(item) {
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
        }
    }
}
</script>
