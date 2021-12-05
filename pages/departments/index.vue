<template>
    <section class="section">
        <header class="docs-header">
            <b-breadcrumb align="is-left" size="is-medium">
                <b-breadcrumb-item tag='router-link' to="/">หน้าหลัก</b-breadcrumb-item>
                <b-breadcrumb-item tag='router-link' to="departments">แผนก</b-breadcrumb-item>
            </b-breadcrumb>
            
        </header>

        <div class="mb-4">
            <b-button
                label="เพิ่มแผนก"
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
                    :data="departmentData"
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

                    <b-table-column v-slot="props" field="department" label="แผนก" sortable >
                        {{ props.row.department }}
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
                </b-table>
            </div>
        </div>
       
       
    </section>
</template>

<script>

export default {
    middleware: ['auth-user'],
    data() {
        return {
            departmentData: [],
            checkboxPosition: 'left',
            checkedRows: []
        }
    }, 
    mounted () {
        this.fetchData()
    },
    methods: {
        async fetchData () {
            const result = await this.$axios.get('/api/v1/department')
            this.departmentData = result.data[0]
        },
        cardModal() {

        },
        deleteAll() {
            this.$console.log(this.checkedRows)
        }
    }
}

</script>
