import { describe, it, expect } from 'vitest'
import { Client } from 'pg'

describe('Database integration', () => {
  it('should create a table and execute a transaction', async () => {
    const client = new Client({
      host: '127.0.0.1',
      port: 54322,
      database: 'postgres',
      user: 'postgres',
      password: 'postgres'
    })

    await client.connect()

    try {
      await client.query('BEGIN')

      await client.query(`
        CREATE TABLE IF NOT EXISTS test_products (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL
        )
      `)

      const result = await client.query(`
        INSERT INTO test_products (name)
        VALUES ($1)
        RETURNING *
      `, ['Laptop'])

      expect(result.rows[0].name).toBe('Laptop')

      await client.query('ROLLBACK')
    } finally {
      await client.end()
    }
  })
})

