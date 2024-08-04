<script lang="ts" setup>
import { onMounted, ref, watch, computed } from 'vue'
import { fetchCountries } from "../services/countriesService.ts";
import type { ICountry } from "../types/Country.ts";
import CountryDialog from './CountryDialog.vue'

const handleSearch = ref('')
const countries = ref<ICountry[]>([])
const filteredCountries = ref<ICountry[]>([])
const page = ref(1)
const itemsPerPage = 25
const paginatedCountries = ref<ICountry[]>([])
const activeSort = ref('')
const loading = ref(true)
const dialog = ref(false)
const selectedCountry = ref<ICountry | null>(null)

const fetchAndSetCountries = async () => {
  loading.value = true
  countries.value = await fetchCountries()
  filteredCountries.value = countries.value
  paginate()
  loading.value = false
}

const handleAscending = () => {
  filteredCountries.value.sort((a, b) => a.name.common.localeCompare(b.name.common))
  activeSort.value = 'ascending'
  paginate()
}

const handleDescending = () => {
  filteredCountries.value.sort((a, b) => b.name.common.localeCompare(a.name.common))
  activeSort.value = 'descending'
  paginate()
}

const handleReset = async () => {
  await fetchAndSetCountries()
  activeSort.value = ''
  handleSearch.value = ''
}

const filterCountries = () => {
  if (handleSearch.value) {
    filteredCountries.value = countries.value.filter(country =>
      country.name.common.toLowerCase().includes(handleSearch.value.toLowerCase())
    )
  } else {
    filteredCountries.value = countries.value
  }
  paginate()
}

const paginate = () => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  paginatedCountries.value = filteredCountries.value.slice(start, end)
}

const clearSearch = () => {
  handleSearch.value = ''
}

const appendIcon = computed(() => {
  return handleSearch.value ? 'mdi-close' : ''
})

const hasFilteredCountries = computed(() => {
  return filteredCountries.value.length > 0
})

const noFilteredCountries = computed(() => {
  return filteredCountries.value.length === 0
})

const skeletonLoaders = computed(() => {
  return Array.from({ length: itemsPerPage })
})

const openDialog = (country: ICountry) => {
  selectedCountry.value = country
  dialog.value = true
}

onMounted(fetchAndSetCountries)
watch(page, paginate)
watch(handleSearch, filterCountries)
</script>

<template>
  <v-container>
    <v-row justify="space-between">
      <v-col cols="6">
        <v-text-field
          v-model="handleSearch"
          :append-inner-icon="appendIcon"
          class="pt-3"
          density="compact"
          hide-details
          label="Search by country name"
          prepend-inner-icon="mdi-magnify"
          single-line
          variant="solo"
          @click:append-inner="clearSearch"
        />
      </v-col>
      <v-col class="d-flex justify-end" cols="6">
        <div class="d-flex flex-column align-items-end">
          <label>Sort by name</label>
          <div>
            <v-btn
              :color="activeSort === 'ascending' ? 'primary' : 'secondary'"
              :variant="activeSort === 'ascending' ? 'flat' : 'outlined'"
              size="small"
              @click="handleAscending"
            >Ascending</v-btn>
            <v-btn
              :color="activeSort === 'descending' ? 'primary' :'secondary'"
              :variant="activeSort === 'descending' ? 'flat' : 'outlined'"
              class="mx-2"
              size="small"
              @click="handleDescending"
            >Descending</v-btn>
            <v-btn
              color="error"
              size="small"
              variant="tonal"
              @click="handleReset"
            >Reset</v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="noFilteredCountries && !loading" cols="12">
        <v-alert type="info">
          Data not found
        </v-alert>
      </v-col>
      <v-col v-for="country in paginatedCountries" v-else :key="country.cca3" cols="12" lg="2" md="4" sm="6" xl="2">
        <v-card class="d-flex flex-column" height="290px" variant="outlined" @click="openDialog(country)">
          <v-img
            :src="country.flags.png"
            aspect-ratio="1.5"
            cover
            max-height="125"
          ></v-img>
          <v-card-title class="text-truncate">{{ country.name.common }}</v-card-title>
          <v-card-subtitle class="text-truncate">{{ country.cca2 }} - {{ country.cca3 }}</v-card-subtitle>
          <v-card-text>
            <div v-for="(alt, index) in country.altSpellings" :key="alt" class="text-truncate">
              {{ index < 2 ? alt : index === 2 ? '...' : '' }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-for="(_, index) in skeletonLoaders" v-if="loading" :key="index" cols="12" lg="2" md="4" sm="6" xl="2">
        <v-skeleton-loader
          class="mx-auto border"
          max-width="300"
          type="image, article"
        ></v-skeleton-loader>
      </v-col>
    </v-row>
    <v-pagination
      v-if="hasFilteredCountries"
      v-model="page"
      :length="Math.ceil(filteredCountries.length / itemsPerPage)"
      :total-visible="7"
      color="primary"
      rounded="circle"
    ></v-pagination>
    <CountryDialog :country="selectedCountry" :dialog="dialog" @update:dialog="dialog = $event" />
  </v-container>
</template>