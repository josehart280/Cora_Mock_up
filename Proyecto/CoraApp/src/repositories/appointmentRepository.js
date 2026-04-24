// ============================================
// Appointment Repository
// Data Access Layer for Supabase
// ============================================

import { supabase } from '../services/supabaseClient'

export const appointmentRepository = {
  /**
   * Get appointments for a patient
   */
  async getPatientAppointments(patientId, status = null) {
    let query = supabase
      .from('appointment_summary')
      .select('*')
      .eq('patient_id', patientId)
      .order('scheduled_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    if (error) throw error
    return data.map(transformAppointment)
  },

  /**
   * Get appointments for a therapist
   */
  async getTherapistAppointments(therapistId, status = null) {
    let query = supabase
      .from('appointment_summary')
      .select('*')
      .eq('psychologist_id', therapistId)
      .order('scheduled_at', { ascending: true })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    if (error) throw error
    return data.map(transformAppointment)
  },

  /**
   * Get the next upcoming appointment for a user
   */
  async getNextUpcoming(userId, role = 'patient') {
    const roleIdField = role === 'patient' ? 'patient_id' : 'psychologist_id'
    
    const { data, error } = await supabase
      .from('appointment_summary')
      .select('*')
      .eq(roleIdField, userId)
      .eq('status', 'scheduled')
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No upcoming appt
      throw error
    }
    return transformAppointment(data)
  }
}

function transformAppointment(dbRecord) {
  if (!dbRecord) return null
  return {
    id: dbRecord.id,
    scheduledAt: dbRecord.scheduled_at,
    duration: dbRecord.duration_minutes,
    status: dbRecord.status,
    type: dbRecord.session_type,
    roomId: dbRecord.room_id,
    patient: {
      id: dbRecord.patient_id,
      firstName: dbRecord.patient_first_name,
      lastName: dbRecord.patient_last_name,
      avatar: dbRecord.patient_avatar
    },
    psychologist: {
      id: dbRecord.psychologist_id,
      firstName: dbRecord.psychologist_first_name,
      lastName: dbRecord.psychologist_last_name,
      avatar: dbRecord.psychologist_avatar
    }
  }
}

export default appointmentRepository
