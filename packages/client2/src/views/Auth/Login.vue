<template>
  <div>
    <h1>{{ headline }}</h1>
    <div>
      <div>
        <span />

        <span>
          Don't have an account yet?
          <RouterLink to="/register">
            <span>Register</span>
          </RouterLink>
        </span>

        <hr>

        <!-- Register via email + password -->
        <form
          @submit.prevent="localLogin"
        >
          <!-- Email -->
          <InputField
            :type="formData.email.type"
            :name="formData.email.name"
            :label="formData.email.label"
            :placeholder="formData.email.placeholder"
            v-model="formData.email.value"
            :isRequired="formData.email.isRequired"
            :error="formData.email.error"
            @change="validateEmail"
          />

          <!-- Password -->
          <InputField
            :type="formData.password.type"
            :name="formData.password.name"
            :label="formData.password.label"
            :placeholder="formData.password.placeholder"
            v-model="formData.password.value"
            :isRequired="formData.password.isRequired"
            :error="formData.password.error"
            @change="validatePassword"
          />

          <!-- Submit button -->
          <PrimaryButton
            class="w-full"
            type="submit"
          >
            <div class="w-full flex items-center justify-center">
              <span> Login </span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </PrimaryButton>

          <!-- Show error message if login fails -->
          <div
            v-if="$store.state.auth.error.area === 'login'"
            class="text-red-500"
          >
            {{ $store.state.auth.error.message }}
          </div>
        </form>

        <!-- Forgot password link -->
        <span class="w-full flex justify-between mt-3">
          <RouterLink to="/forgotpassword">
            <span class="text-blue-700 underline">Forgot your password?</span>
          </RouterLink>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Login',
  data() {
    return {
      formData: {
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
    /**
       * Log in via Google.
       */
    loginWithGoogle() {
      window.location.href = `${process.env.VUE_APP_API_URL}/auth/google`;
    },
    /**
       * Log in via Twitter.
       */
    loginWithTwitter() {
      window.location.href = `${process.env.VUE_APP_API_URL}/auth/twitter`;
    },
    /**
       * Log in via email and password.
       */
    async localLogin() {
      this._validateInputs();
      if (this.formData.email.error || this.formData.password.error) {
        return;
      }
      // Trigger action from auth store.
      this.$store.dispatch('login', {
        email: this.formData.email.value,
        password: this.formData.password.value,
      });
    },
    /**
       * Validate the form input fields.
       */
    _validateInputs() {
      this.validateEmail();
      this.validatePassword();
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
