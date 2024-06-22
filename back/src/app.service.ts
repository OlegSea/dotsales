import { Injectable } from '@nestjs/common';
import axios from 'axios'
import { readFile } from 'fs/promises';
import { Lead, Status, Contact } from './types'
import { log } from 'console';

const base_url = "https://taalexashow.amocrm.ru"



@Injectable()
export class AppService {
  access_token: string;

  constructor() {
    this.read_secret('token').then(token => { this.access_token = token });
  }

  async read_secret(name: string): Promise<string> {
    return await readFile(`/run/secrets/${name}`, 'utf8');
  }

  async get_user_from_id(id: number): Promise<string> {

    const response = await axios.get(`${base_url}/api/v4/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.access_token}`
      }
    })
    return response.data.name
  }

  async get_status_from_id(pipeline_id: number, id: number): Promise<Status> {

    const response = await axios.get(`${base_url}/api/v4/leads/pipelines/${pipeline_id}/statuses/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.access_token}`
      }
    })
    return {
      "name": response.data.name,
      "color": response.data.color
    }
  }

  async parse_contacts(data): Promise<Contact[]> {
    let result = []
    for (let contact of data) {
      const response = await axios.get(`${base_url}/api/v4/contacts/${contact.id}`, {
        headers: {
          'Authorization': `Bearer ${this.access_token}`
        }
      })

      const phone_search = response.data.custom_fields_values.find(item => item.field_id == 87187)
      let phone = ""
      if (phone_search) {
        phone = phone_search.values[0].value
      }
      const email_search = response.data.custom_fields_values.find(item => item.field_id == 87189)
      let email = ""
      if (email_search) {
        email = email_search.values[0].value
      }

      result.push({
        "name": response.data.name,
        "email": email,
        "phone": phone
      })
    }

    return result
  }

  async parse_leads(data): Promise<Lead[]> {
    let result = []
    if (!data._embedded) {
      return result
    }

    for (let lead of data._embedded.leads) {
      result.push({
        "id": lead.id,
        "name": lead.name,
        "price": lead.price,
        "responsible": await this.get_user_from_id(lead.responsible_user_id),
        "status": await this.get_status_from_id(lead.pipeline_id, lead.status_id),
        "date": lead.created_at,
        "contacts": await this.parse_contacts(lead._embedded.contacts)
      })
    }

    return result
  }

  async leads(query: { query: string }): Promise<Lead[]> {
    const response = await axios.get(`${base_url}/api/v4/leads`, {
      headers: {
        'Authorization': `Bearer ${this.access_token}`
      },
      params: {
        "with": "contacts",
        "query": query.query
      }
    })

    const leads = await this.parse_leads(response.data)

    return leads
  }
}
