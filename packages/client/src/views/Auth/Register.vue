<template>
  <div>
    <h1>
      Register
    </h1>
    <div class="fill-height fill-width d-flex justify-center">
      <div>
        <span class="mb-4" />

        <span class="mb-6">Already have an account?
          <RouterLink to="/login">
            <span>Log in</span>
          </RouterLink></span>

        <VDivider />

        <!-- Forgot password link -->
        <span class="fill-width d-flex justify-space-between mt-3">
          <RouterLink to="/forgotpassword">
            <span>Forgot your password?</span>
          </RouterLink>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Register',
  data() {
    return {
      formData: {
        name: {
          type: 'text',
          name: 'name',
          label: 'Your name',
          placeholder: 'Bruce Wayne',
          value: '',
          error: '',
          isRequired: true,
        },
        email: {
          type: 'text',
          name: 'email',
          label: 'Your email',
          placeholder: 'bruce@wayne-enterprise.com',
          value: '',
          error: '',
          isRequired: true,
        },
        password: {
          type: 'password',
          name: 'passwprd',
          label: 'Your password (min. 3 chars)',
          placeholder: '',
          value: '',
          error: '',
          isRequired: true,
        },
      },
    };
  },
  methods: {
    registerWithGoogle() {
      window.location.href = `${process.env.VUE_APP_API_URL}/auth/google`;
    },
    registerWithTwitter() {
      window.location.href = `${process.env.VUE_APP_API_URL}/auth/twitter`;
    },
    async localRegister() {
      this._validateInputs();
      if (
        this.formData.email.error
          || this.formData.name.error
          || this.formData.password.error
      ) {
        return;
      }
      try {
        await this.$store.dispatch('register', {
          name: this.formData.name.value,
          email: this.formData.email.value,
          password: this.formData.password.value,
        });
      } catch (error) {
        console.error(error);
      }
    },
    /**
       * Validate the form input fields.
       */
    _validateInputs() {
      this.validateName();
      this.validateEmail();
      this.validatePassword();
    },
    /**
       * Validate the name field
       */
    validateName() {
      if (this.formData.name.value.length < 3) {
        this.formData.name.error = 'Please provide a name with at least 2 characters.';
        return;
      }
      this.formData.name.error = '';
    },
    /**
       * Validate the email field
       */
    validateEmail() {
      const isEmail = String(this.formData.email.value)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
      if (!isEmail) {
        this.formData.email.error = 'Please enter a valid email address.';
        return;
      }

      this.formData.email.error = '';
    },
    /**
       * Validate the password field
       */
    validatePassword() {
      if (this.formData.password.value.length < 3) {
        this.formData.password.error = 'Please provide a password with at least 3 characters.';
        return;
      }
      this.formData.password.error = '';
    },
  },
});
</script>
