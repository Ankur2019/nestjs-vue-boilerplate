<template>
  <VContainer fluid>
    <VRow
      justify="center"
      align="center"
    >
      <VCol>
        <VCard>
          <VCardTitle class="align-end">
            <div class="display-1 primary--text">
              Users
            </div>
            <VSpacer />
            <VTextField
              v-model="search"
              appendIcon="mdi-magnify"
              label="Search"
              hideDetails
            />
            <VTooltip top>
              <template #activator="{ on }">
                <VBtn
                  icon
                  color="green darken-1"
                  v-on="on"
                  @click="exportCsv"
                >
                  <VIcon class="mt-1">
                    mdi-table-arrow-right
                  </VIcon>
                </VBtn>
              </template>
              <span>Export To CSV</span>
            </VTooltip>
          </VCardTitle>
          <VDataTable
            :headers="headers"
            :items="report"
            itemKey="userId"
            :customSort="customSort"
            :loading="isLoading"
            :search="search"
            sortBy="registrationDate"
            sortDesc
            mustSort
            showExpand
          >
            <template #expanded-item="{ headers: {length: numCol}, item }">
              <td :colspan="numCol">
                <div class="py-2">
                  <div
                    v-for="key in ['preferredStyles', 'experienceLevels']"
                    :key="key"
                    class="my-1"
                  >
                    <strong>{{ startCase(key) }}</strong>:
                    <template v-if="item[key].length">
                      <VChip
                        v-for="value in item[key]"
                        :key="value"
                        small
                        class="elevation-1 mx-1"
                      >
                        {{ value }}
                      </VChip>
                    </template>
                    <VChip
                      v-else
                      small
                      class="elevation-1 mx-1 warning"
                    >
                      N/A
                    </VChip>
                  </div>
                </div>
              </td>
            </template>
            {{ /* eslint-disable vue/valid-v-slot */ }}
            <template #item.registrationDate="{value}">
              {{ formatDate(value) }}
            </template>
            <template #item.socialLogins="{value}">
              <img
                v-if="value.includes('Google')"
                :src="require('@/assets/socials/google-logo.png')"
                alt="google-logo"
              >
              <div
                v-if="value.includes('Facebook')"
                class="rounded d-inline-block"
                style="background-color: #1877F2; height: 30px; width: 30px"
              >
                <img
                  :src="require('@/assets/socials/fb-logo.png')"
                  alt="fb-logo"
                >
              </div>

              <span v-if="!value">
                N/A
              </span>
            </template>
          </VDataTable>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script lang="ts">
import axios from 'axios';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { parse } from 'json2csv';
import { startCase } from 'lodash';
import {
  defineComponent,
  ComputedOptions,
  MethodOptions,
  ComponentPropsOptions,
  ComputedGetter,
} from 'vue';
import { download } from '@/helpers';
import { User, SocialLogin } from '@/type';

dayjs.extend(localizedFormat);

interface Methods extends MethodOptions {
  startCase: typeof startCase;

  formatDate(date: string): string;

  customSort(items: ReportElement[], index: ReportKeys[], isDesc: boolean[]): ReportElement[];

  exportCsv(): void;
}

type ReportKeys =
  | 'registrationDate'
  | 'userId'
  | 'socialLogins'
  | 'referralCode'
  | 'referredCode'
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'userLevel'
  | 'experienceLevels'
  | 'preferredStyles';

interface Header {
  text: string;
  value: ReportKeys;
}

interface Data {
  users: User[];
  headers: Header[];
  isLoading: boolean;
  search: string;
}

type ReportElement = {
  [K in ReportKeys]: K extends 'experienceLevels' | 'preferredStyles' ? string[] : string;
};

interface Computed extends ComputedOptions {
  report: ComputedGetter<ReportElement[]>;
}

export default defineComponent<ComponentPropsOptions, unknown, Data, Computed, Methods>({
  name: 'UserList',
  data() {
    return {
      users: [],
      isLoading: false,
      search: '',
      headers: [
        { text: 'Registration Date', value: 'registrationDate' },
        { text: 'User ID', value: 'userId' },
        { text: 'Social Logins', value: 'socialLogins' },
        { text: 'Referral Code', value: 'referralCode' },
        { text: 'Referred Code', value: 'referredCode' },
        { text: 'Email', value: 'email' },
        { text: 'First Name', value: 'firstName' },
        { text: 'Last Name', value: 'lastName' },
        { text: 'User Level', value: 'userLevel' },
      ],
    };
  },
  computed: {
    report(): ReportElement[] {
      return this.users.map((user: User): ReportElement => {
        const {
          createdAt,
          _id: userId,
          socialLogins,
          referralCode,
          referredCode,
          username: email,
          firstName,
          lastName,
          userLevel,
          preferredStyles,
          experienceLevels,
        } = user;

        return {
          registrationDate: createdAt || 'N/A',
          socialLogins: (socialLogins?.map((login: SocialLogin) => login.name) || []).join(),
          referralCode,
          referredCode: referredCode || 'N/A',
          userId,
          email,
          firstName,
          lastName,
          userLevel,
          preferredStyles,
          experienceLevels,
        };
      });
    },
  },
  methods: {
    startCase,
    formatDate(date: string): string {
      return dayjs(date).format('LL');
    },
    customSort(items, index, isDesc) {
      if (index.length) {
        const key = index[0] as ReportKeys;
        const sortedItems: ReportElement[] = items.sort((a, b) => {
          const valA = a[key] as string;
          const valB = b[key] as string;
          if (key === 'registrationDate') {
            const dateA = new Date(valA).getTime() || 0 as number;
            const dateB = new Date(valB).getTime() || 0 as number;
            if (isDesc[0]) {
              return dateB - dateA;
            }
            return dateA - dateB;
          }
          if (isDesc[0]) {
            return valB.localeCompare(valA);
          }
          return valA.localeCompare(valB);
        });
        return sortedItems;
      }

      return this.report;
    },
    exportCsv() {
      const fields = this.headers.map((header: Header) => header.text);
      const csvData = this.report.map((el: ReportElement) => {
        const keyValuePairs = this.headers.map((header: Header) => [header.text, el[header.value as ReportKeys]]);
        return Object.fromEntries(keyValuePairs);
      });
      const csv = parse(csvData, { fields });
      download(csv, 'Users.csv');
    },
  },
  async created() {
    this.isLoading = true;
    const userResponse = await axios.get<{ users: User[] }>('/users');
    this.users = userResponse.data.users;
    this.isLoading = false;
  },
});
</script>

<style scoped lang="scss">
  .spacer {
    flex-grow: 2 !important;
  }
</style>
