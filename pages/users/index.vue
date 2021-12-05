<template>
    <section class="section">
        <header class="docs-header">
            <b-breadcrumb align="is-left" size="is-medium">
                <b-breadcrumb-item tag='router-link' to="/">หน้าหลัก</b-breadcrumb-item>
                <b-breadcrumb-item tag='router-link' to="users" active>ผู้ใช้งาน</b-breadcrumb-item>
            </b-breadcrumb>
            <div class="columns">
                <div class="column">
                    <h2 class="title has-text-white-ter">ผู้ใช้งาน</h2>
                </div>
            </div>
        </header>
       
       
    </section>
</template>

<script>

export default {
   middleware: ['auth-user'],
}

</script>
