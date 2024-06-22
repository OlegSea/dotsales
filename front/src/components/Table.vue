<script setup lang="ts">
// get data from api located at localhost:3000/api/leads
import { useQueryClient, useQuery, useMutation } from '@tanstack/vue-query'

// Access QueryClient instance
const queryClient = useQueryClient()

// Query
const { isPending, isError, data, error } = useQuery({
  queryKey: ['leads'],
  // FIXME: Убрать хардкод, тащить его из compose.yml
  // Если не работает - исправьте айпи на свой
  queryFn: () => fetch(`http://127.0.0.1:3000/api/leads`).then(res => res.json()),
})

</script>

<template>
<span v-if="isPending">Loading...</span>
  <span v-else-if="isError">Error: {{ error?.message }}</span>
  <!-- We can assume by this point that `isSuccess === true` -->
  <table v-else>
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Price</th>
        <th>Responsible</th>
        <th>Status</th>
        <th>Date</th>
        <th>Contacts</th>
        <th>Phone Number</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.price }}</td>
        <td>{{ item.responsible }}</td>
        <td>
          <span :style="{ color: item.status.color }">{{ item.status.name }}</span>
        </td>
        <td>{{ new Date(item.date * 1000) }}</td>
        <td>
          <ul>
            <li v-for="contact in item.contacts" :key="contact.name">
              {{ contact.name }}
            </li>
          </ul>
        </td>
        <td>{{ item.contacts[0].phone }}</td>
        <td>{{ item.contacts[0].email }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style>
  /* ... other styles ... */

  body {
    background-color: #222;
    color: #fff;
    font-family: 'Roboto', sans-serif;
  }

  table {
    background-color: #333;
    border-collapse: collapse;
  }

  th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #555;
  }

  th {
    background-color: #555;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    margin-bottom: 5px;
  }
</style>