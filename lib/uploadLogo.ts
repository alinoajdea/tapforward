import { supabase } from './supabaseClient'

export async function uploadLogo(userId: string, file: File) {
  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}/company-logo.${fileExt}`
  const { data, error } = await supabase.storage
    .from('logos')
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: '3600',
    })
  if (error) throw error

  const { data: publicData } = supabase.storage.from('logos').getPublicUrl(filePath)
  return publicData.publicUrl
}
