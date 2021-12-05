<template>
  <div>
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
            <b-navbar-item href="#">
                คู่มือการใช้งาน
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{ path: '/about' }">
                เกี่ยวกับเรา
            </b-navbar-item>
        </template>

        <template #end>

            <b-navbar-item v-if="loggedIn" tag="div">
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
                  <b-dropdown-item value="user">
                      <NuxtLink to="user">ผู้ใช้งาน</NuxtLink>
                  </b-dropdown-item>
                  <b-dropdown-item value="agency">
                      <NuxtLink to="agency">หน่วยงานส่ง</NuxtLink>
                  </b-dropdown-item>
                  <b-dropdown-item value="receiver">
                      <NuxtLink to="receiver">ผู้รับ</NuxtLink>
                  </b-dropdown-item>
                  <b-dropdown-item value="doctype">
                      <NuxtLink to="dpctype">ประเภทหนังสือ</NuxtLink>
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
                          เข้าระบบโดย: <b>{{ user.username }}</b>
                  </b-dropdown-item>
                  <hr class="dropdown-divider">
                  <b-dropdown-item value="profile">
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

    <section class="main-content columns">
      <div class="container column is-12">
        <Nuxt />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: this.$auth.user,
      loggedIn: this.$auth.loggedIn
    };
  },
  methods: {
    async logout() {
      await this.$auth.logout();
      this.$router.push('/login');
    }
  }
}
</script>
