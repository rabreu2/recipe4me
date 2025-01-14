'use server'
import {neon} from '@neondatabase/serverless'


export  default async function read(formData: FormData) {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const recipe = '%' + formData.get('recipe') + '%';
    await sql ('SELECT * FROM recipes WHERE name LIKE ($1)', [recipe]);
  }