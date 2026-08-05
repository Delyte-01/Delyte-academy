export async function updateStudent(
  id: string,
  updates: { status?: 'active' | 'inactive' | 'suspended'; role?: 'student' | 'admin' | 'super_admin' }
) {
  const res = await fetch(`/api/admin/students/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update student');
  }

  return res.json();
}

export async function deleteStudent(id: string) {
  const res = await fetch(`/api/admin/students/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete student');
  }

  return res.json();
}