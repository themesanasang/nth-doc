<template>
  
   <div class="column is-4 is-offset-4">
     <div class="logo has-text-centered mb-4">
        <img src="@/assets/logo.png">
     </div>

    <h1 class="has-text-white-ter has-text-centered mb-4">ลืมรหัสผ่าน</h1>
    
    <b-notification
      v-show="error"
      type="is-danger is-light"
      aria-close-label="Close notification"
      role="alert">
      ชื่อผู้ใช้งานหรือรหัสผ่านผิด
    </b-notification>
    
    <div class="box">
        <form class="has-text-grey-light" @submit="onSubmit">
            <b-field label="อีเมล์ *" custom-class="has-text-white-ter">
                <b-input v-model="email" type="email" custom-class="login-input-bg has-text-white-ter is-normal"></b-input>
            </b-field>

            <button type="submit" class="button is-block is-success is-fullwidth mt-5">ตกลง</button>
        </form>
    </div>

    <div class="box-menu">
      <div class="has-text-centered">
        <NuxtLink class="button is-ghost has-text-grey-lighter is-size-6" to="/">หน้าหลัก</NuxtLink>
        <NuxtLink class="button is-ghost has-text-grey-lighter is-size-6" to="/login">เข้าสู่ระบบ</NuxtLink>
        <NuxtLink class="button is-ghost has-text-grey-lighter is-size-6" to="/register">สมัครใช้งาน</NuxtLink>
      </div>
    </div>

    <div class="has-text-centered is-size-7 mt-5">
      <p>© 2021 ThemeSanasang</p>
    </div>

  </div>

</template>

<script>
// import CryptoJS from 'crypto-js'

export default {
  layout: 'login-layout',
  middleware: 'guest',
  data () {
    return {
      email: '',
      error: null,
    }
  },
  methods: {
    onSubmit(e) {
      e.preventDefault()

      /* if(this.username === '' || this.password === '') {
        this.error = true
        return
      } */

      // const ciphertext = CryptoJS.AES.encrypt(String(this.password), process.env.SECRET_KEY)
      /* const payload = {
        data: {
          username: this.username,
          password: String(ciphertext)
        },
      } */

      /* try {
        this.error = false
        
        await this.$auth.loginWith('local', payload)
        this.$router.push('/')
      } catch (error) {
        this.error = error
      } */
    },
  }
}
</script>

<style scoped>
.logo img {
  width: 96px;
}

h1 {
  font-size: 24px;
  font-weight: 300;
  letter-spacing: -0.5px;
}

.box {
  background-color: #161b22 !important;
  border: 1px solid #21262d !important;
}

.box-menu {
  border: 1px solid #21262d !important;
  padding: 10px;
  border-radius: 6px;
  display: block;
}
</style>