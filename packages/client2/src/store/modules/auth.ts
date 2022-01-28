import axios from 'axios';
import {Commit} from 'vuex';

interface AuthState {
  user: Record<string, unknown>;
  loadingUser: boolean;
  isAuthenticated: boolean;
  access_token: string;
  error: Record<string, unknown>;
}

export default<{state: AuthState}>{
  //===========================
  // STATEI
  //===========================
  state: {
    user: {},
    loadingUser: true,
    isAuthenticated: false,
    access_token: '',
    error: {},
  },

  //===========================
  // Mutations.
  //===========================
  mutations: {
    SET_USER(
      state: AuthState, 
      user: Record<string, unknown>
      ): void {
      state.user = user;
      state.isAuthenticated = true;
      state.loadingUser = false;
      state.error = {};
    },
    SET_ACCESS_TOKEN(
      state: AuthState, 
      token = ''
      ): void {
      if (token) {
        window.localStorage.setItem('access_token', token);
        return;
      }
      window.localStorage.removeItem('access_token');
      state.access_token = token;
    },
    SET_USER_ERROR_OR_LOGOUT(
      state: AuthState, 
      error: Record<string, unknown>
      ): void {
      state.error = error;
      state.user = {};
      state.isAuthenticated = false;
      state.loadingUser = false;
      state.access_token = '';
    },
  },

  //===========================
  // ACTIONS
  //===========================
  actions: {
    /**
     * Fetch the currently logged in user from the DB.
     * @param {object} context
     *  
     * @returns
     */
    async fetchUser(
      { commit }: { commit: Commit }
      ): Promise<void | boolean> {
      try {
        // Send api request.
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/auth/user`,
          {
            withCredentials: true,
          },
        );
        // Put user into store.
        if (res.status === 200) {
          commit('SET_USER', res.data);
          commit(
            'SET_ACCESS_TOKEN',
            window.localStorage.getItem('access_token'),
          );
          return true;
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data) {
          commit('SET_USER_ERROR_OR_LOGOUT', { ...error.response.data, area: 'fetchUser' });
          return false;
        }
        commit('SET_USER_ERROR_OR_LOGOUT', {
          error: 'Server error',
          message: 'Sorry, something went wrong',
          statusCode: 500,
          area: 'fetchUser',
        })

      }
    },

    /**
     * Register user via email and password.
     * 
     * @param {object} context
     *   The context object. 
     * 
     * @param {object} formData 
     *   The form data.
     * @returns 
     * 
     */
    async register(
      { state, commit }: { state: AuthState, commit: Commit }, 
      formData: Record<string, unknown>
      ): Promise<void | Record<string, unknown>> {
      try {
        const res = await axios.post(
          `${process.env.VUE_APP_API_URL}/auth/register`,
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          },
          {
            withCredentials: true,
          },
        )

        if (res.status === 201) {
          window.location.href = `${process.env.VUE_APP_FRONTEND_URL}/dashboard`;
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
          commit('SET_USER_ERROR_OR_LOGOUT', {
            ...error.response.data,
            area: 'register',
          });
          return state.error;
        }
        commit('SET_USER_ERROR_OR_LOGOUT', {
          error: 'Server error',
          message: 'Sorry, something went wrong',
          statusCode: 500,
          area: 'register',
        });
        return state.error;
      }
    },

    /**
     * Log in user via email and password.
     * 
     * @param {object} context
     *   The context object.
     * 
     * @param {object} formData
     *   The form data that holds email and password.
     *  
     * @returns 
     */
    async login(
      { state, commit }: { state: AuthState, commit: Commit },
      { email, password }: { email: string, password: string }
      ): Promise<void | Record<string, unknown>> {
      try {
        const res = await axios.post(
          `${process.env.VUE_APP_API_URL}/auth/login`,
          { email, password },
          {
            withCredentials: true,
          },
        );
        if (res.status === 201) {
          window.location.href = `${process.env.VUE_APP_FRONTEND_URL}/dashboard`;
        }
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error) && error.response?.data) {
          commit('SET_USER_ERROR_OR_LOGOUT', {
            ...error.response.data,
            area: 'login',
          });
          return state.error;
        }

        commit('SET_USER_ERROR_OR_LOGOUT', {
          error: 'Server error',
          message: 'Sorry, something went wrong',
          statusCode: 500,
          area: 'login',
        });
        return state.error;
      }
    },

    /**
     * Log user out.
     * 
     * @param {object} context
     *   The context object. 
     */
    async logout(
      { commit }: { commit: Commit }
      ): Promise<void> {
      const res = await axios.get('http://localhost:3000/auth/logout', {
        withCredentials: true,
      });
      commit('SET_USER_ERROR_OR_LOGOUT');
    },
  },
};
