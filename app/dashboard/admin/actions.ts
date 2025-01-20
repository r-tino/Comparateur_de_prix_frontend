// app/dashboard/admin/actions.ts

'use server'

import { revalidatePath } from 'next/cache'
import { Category, User, DeletionRequest } from '@/types/admin'

// Update Category
export async function updateCategory(id: string, data: Partial<Category>) {
  // Simulate updating a category
  console.log(`Updating category with ID: ${id}`, data)
  revalidatePath('/dashboard/admin/categories')
}

// Users
export async function getUsers() {
  // Simulate fetching users
  return [] as User[]
}

export async function deleteUser(id: string) {
  // Simulate deleting a user
  console.log(`Deleting user with ID: ${id}`)
  revalidatePath('/dashboard/admin/gestions-des-comptes')
}

// Deletion Requests
export async function getDeletionRequests(): Promise<DeletionRequest[]> {
  // Simulate fetching deletion requests
  return [
    {
      id: '1',
      nom: 'John Doe',
      email: 'john@example.com',
      dateDemande: '2023-05-15',
      status: 'En attente'
    },
    {
      id: '2',
      nom: 'Jane Smith',
      email: 'jane@example.com',
      dateDemande: '2023-05-16',
      status: 'En attente'
    }
  ] as DeletionRequest[]
}

export async function approveDeletionRequest(id: string) {
  // Simulate approving a deletion request
  console.log(`Approving deletion request with ID: ${id}`)
  revalidatePath('/dashboard/admin/gestions-des-comptes')
}

export async function rejectDeletionRequest(id: string) {
  // Simulate rejecting a deletion request
  console.log(`Rejecting deletion request with ID: ${id}`)
  revalidatePath('/dashboard/admin/gestions-des-comptes')
}