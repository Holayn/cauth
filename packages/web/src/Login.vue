<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white rounded-lg shadow-md w-full max-w-sm p-8">
      <h1 class="text-2xl font-semibold mb-1">Sign in</h1>

      <template v-if="error">
        <p class="text-red-500 mb-4">{{ errorMessage }}</p>
      </template>
      <template v-else>
        <p v-if="service" class="text-sm text-gray-500 mb-6">to continue to {{ service.displayName }}</p>
        <p v-else class="text-sm text-gray-300 mb-6">Loading...</p>
        <form @submit.prevent="login" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label for="username" class="text-sm text-gray-700">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              autocomplete="username"
              required
              :disabled="!service"
              class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-50"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label for="password" class="text-sm text-gray-700">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              :disabled="!service"
              class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-50"
            />
          </div>
          <p v-if="loginError" class="text-sm text-red-500">{{ loginError }}</p>
          <button
            type="submit"
            :disabled="!service || loading"
            class="w-full py-2 rounded bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    return {
      route: useRoute(),
      router: useRouter(),
    }
  },
  data() {
    return {
      service: null,
      username: '',
      password: '',
      error: false,
      errorMessage: '',
      loading: false,
      loginError: '',
    } as {
      service: { name: string, displayName: string, enable2fa: boolean, url: string } | null,
      username: string,
      password: string,
      error: boolean,
      errorMessage: string,
      loading: boolean,
      loginError: string,
    }
  },
  computed: {
    serviceParam() {
      return this.route.query.service as string;
    },
  },
  created() {
    if (!this.serviceParam) {
      this.error = true;
      this.errorMessage = 'Service is required';
    }
  },
  async mounted() {
    if (this.error) {
      return;
    }

    try {
      const res = await fetch(`/api/service?name=${this.serviceParam}`);
      if (!res.ok) {
        if (res.status === 404) {
          this.error = true;
          this.errorMessage = 'Service not found';
        } else {
          this.error = true;
          this.errorMessage = 'Failed to load service info';
        }
      }
      this.service = await res.json();
      if (this.service) {
        window.document.title = `Sign in to ${this.service.displayName}`;
      }
    } catch (err) {
      this.error = true;
      this.errorMessage = 'Failed to fetch service info';
    }
  },
  methods: {
    async login() {
      this.loading = true;
      this.loginError = '';
      try {
        const res = await fetch(`/api/${this.serviceParam}/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });
        if (!res.ok) {
          this.loginError = res.status === 401 ? 'Invalid username or password' : 'Login failed';
          return;
        }
        const data = await res.json();
        if (data.twoFA) {
          this.router.push({ name: 'MFA', query: { service: this.serviceParam } });
        } else if (data.code && this.service) {
          window.location.href = `${this.service.url}/api/auth/callback?code=${data.code}`;
        } else if (data.success === false) {
          this.loginError = data.reason || 'Bad login';
        }
      } catch (err) {
        this.loginError = 'Login request failed';
      } finally {
        this.loading = false;
      }
    }
  },
}
</script>
