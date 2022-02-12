<template>
  <VContainer>
    <div class="primary--text text-center">
      <Header>
        Now entering your personal chat studio...
      </Header>
    </div>
  </VContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import Bus, { NOTIFICATION } from '@/bus';
import { redirectUserAfterLogin, handleAxiosError } from '@/helpers';
import SocialLoginService from '@/services/SocialLoginService';

export default defineComponent({
  name: 'GoogleLogin',

  computed: {
    ...mapState(['user']),
  },

  async created() {
    try {
      const { isLoggedIn, redirectUrl } = await SocialLoginService.verifyGoogleLogin();

      if (!isLoggedIn) {
        Bus.emit(NOTIFICATION.ERROR, {
          message: 'Login with google failed',
        });
        await this.$router.push('/');

        return;
      }

      // redirect according to role
      const redirection = await redirectUserAfterLogin(this.user, redirectUrl);
      await this.$router.push(redirection.route);
    } catch (e) {
      handleAxiosError(e);
    }
  },
});
</script>
