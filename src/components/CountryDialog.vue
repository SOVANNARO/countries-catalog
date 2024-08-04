<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import type { ICountry } from '../types/Country.ts'

const props = defineProps<{ dialog: boolean, country: ICountry | null }>()
const emit = defineEmits(['update:dialog'])

const localDialog = ref(props.dialog)

watch(() => props.dialog, (newVal) => {
  localDialog.value = newVal
})

const closeDialog = () => {
  localDialog.value = false
  emit('update:dialog', false)
}

watch(localDialog, (newVal) => {
  if (!newVal) {
    emit('update:dialog', false)
  }
})
</script>

<template>
  <v-dialog v-model="localDialog" max-width="600">
    <v-card v-if="props.country">
      <v-card-title class="d-flex">
        {{ props.country.name.common }}
        <v-spacer></v-spacer>
        <v-icon class="cursor-pointer" color="error" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <v-card-subtitle>{{ props.country.cca2 }} - {{ props.country.cca3 }}</v-card-subtitle>
      <v-card-text class="px-4">
        <p><strong>Official Name:</strong> {{ props.country.name.official }}</p>
        <v-divider></v-divider>
        <p><strong>Capital:</strong> {{ props.country.capital?.join(', ') || 'N/A' }}</p>
        <v-divider></v-divider>
        <p><strong>Region:</strong> {{ props.country.region }}</p>
        <v-divider></v-divider>
        <p><strong>Subregion:</strong> {{ props.country.subregion }}</p>
        <v-divider></v-divider>
        <p><strong>Population:</strong> {{ props.country.population }}</p>
        <v-divider></v-divider>
        <p><strong>Area:</strong> {{ props.country.area }} km²</p>
        <v-divider></v-divider>
        <p><strong>Languages:</strong> {{ props.country.languages ? Object.values(props.country.languages).join(', ') : 'N/A' }}</p>
        <v-divider></v-divider>
        <p><strong>Currencies:</strong>
          <span v-for="(currency, code) in props.country.currencies" :key="code">
            {{ currency.name }} ({{ currency.symbol }})
          </span>
        </p>
        <v-divider></v-divider>
        <p><strong>Timezones:</strong> {{ props.country.timezones.join(', ') }}</p>
        <v-divider></v-divider>
        <p><strong>Flag:</strong> <v-img :src="props.country.flags.png" max-width="100"></v-img></p>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>