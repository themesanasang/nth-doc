<template>
    <div>
        <client-only>
        <b-navbar type="is-primary">
            <template #brand>
                <b-navbar-item tag="router-link" :to="{ path: '/' }">
                    ระบบรับ-ส่งหนังสือราชการ
                </b-navbar-item>
            </template>
            <template #start>
                <b-navbar-item tag="router-link" :to="{ path: '/' }">
                    หน้าหลัก
                </b-navbar-item>
                <b-navbar-item v-show="isAuthenticated" tag="router-link" :to="{ path: '/reports' }">
                    รายงาน
                </b-navbar-item>
                <b-navbar-item tag="router-link" :to="{ path: '/manual' }">
                    คู่มือการใช้งาน
                </b-navbar-item>
                <b-navbar-item tag="router-link" :to="{ path: '/about' }">
                    เกี่ยวกับเรา
                </b-navbar-item>
            </template>

            <template #end>

                <b-navbar-item v-if="isAuthenticated" tag="div">
                <b-dropdown
                    position="is-bottom-left"
                    append-to-body
                    aria-role="menu">
                    <template #trigger>
                        <a class="navbar-item">
                            <b-icon icon="cog"></b-icon>
                            <b-icon icon="menu-down" class="g-icon-arrow"></b-icon>
                        </a>
                    </template>
                    <b-dropdown-item aria-role="listitem" value="departments">
                        <NuxtLink to="departments">แผนก</NuxtLink>
                    </b-dropdown-item>
                    <b-dropdown-item aria-role="listitem" value="users">
                        <NuxtLink to="users">ผู้ใช้งาน</NuxtLink>
                    </b-dropdown-item>
                    <b-dropdown-item aria-role="listitem" value="agencys">
                        <NuxtLink to="agencys">หน่วยงานส่ง</NuxtLink>
                    </b-dropdown-item>
                    <b-dropdown-item aria-role="listitem" value="receivers">
                        <NuxtLink to="receivers">ผู้รับ</NuxtLink>
                    </b-dropdown-item>
                    <b-dropdown-item aria-role="listitem" value="docgroup">
                        <NuxtLink to="docgroups">หมวดหนังสือ</NuxtLink>
                    </b-dropdown-item>
                </b-dropdown>
                <b-dropdown
                    position="is-bottom-left"
                    append-to-body
                    aria-role="menu">
                    <template #trigger>
                        <a class="navbar-item">
                            <b-icon icon="account"></b-icon>
                            <b-icon icon="menu-down" class="g-icon-arrow"></b-icon>
                        </a>
                    </template>
                    <b-dropdown-item custom aria-role="menuitem">
                            เข้าระบบโดย: <b> {{ loggedInUser.username }} </b>
                    </b-dropdown-item>
                    <hr class="dropdown-divider">
                    <b-dropdown-item aria-role="menuitem" value="profile">
                        ข้อมูลส่วนตัว
                    </b-dropdown-item>
                    <hr class="dropdown-divider" aria-role="menuitem">
                    <b-dropdown-item value="logout" aria-role="menuitem" @click="logout">
                        ออกจากระบบ
                    </b-dropdown-item>
                </b-dropdown>
                </b-navbar-item>

                <b-navbar-item v-else tag="div">
                    <b-button tag="router-link" 
                    type="is-success"
                    inverted 
                    outlined
                    icon-left="login"
                    :to="{ path: '/login' }">
                    เข้าสู่ระบบ
                    </b-button>
                </b-navbar-item> 
            
            </template>
        </b-navbar>
        </client-only>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },
  methods: {
    async logout() {
      await this.$auth.logout();
      this.$router.push('/login');
    }
  }
}
</script>