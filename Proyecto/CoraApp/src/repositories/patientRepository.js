// ============================================
// Patient Repository
// Data Access Layer for Supabase
// ============================================

import { supabase } from '../services/supabaseClient'

export const patientRepository = {
  /**
   * Get patient profile details
   */
  async getProfile(patientId) {
    const { data, error } = await supabase
      .from('patient_profiles')
      .select('*, profiles(*)')
      .eq('id', patientId)
      .maybeSingle()

    if (error) throw error
    return data
  },

  /**
   * Get assigned therapist for a patient
   */
  async getAssignedTherapist(patientId) {
    const { data, error } = await supabase
      .from('patient_profiles')
      .select('therapist_id')
      .eq('id', patientId)
      .maybeSingle()

    if (error) throw error
    if (!data || !data.therapist_id) return null

    // Fetch therapist details from verified_psychologists view
    const { data: therapist, error: tError } = await supabase
      .from('verified_psychologists')
      .select('*')
      .eq('id', data.therapist_id)
      .maybeSingle()

    if (tError) throw tError
    return therapist
  }
}

export default patientRepository
