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

    if (status && status !== 'all') {
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

    if (status && status !== 'all') {
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
      .maybeSingle()

    if (error) throw error
    return transformAppointment(data)
  },

  /**
   * Create a new appointment
   */
  async createAppointment({ patientId, psychologistId, scheduledAt, type, duration = 60 }) {
    // Generate a simple room ID for the session
    const roomId = `room-${Math.random().toString(36).substring(2, 9)}`

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        patient_id: patientId,
        psychologist_id: psychologistId,
        scheduled_at: scheduledAt,
        session_type: type,
        duration_minutes: duration,
        status: 'scheduled',
        room_id: roomId
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Cancel an appointment
   */
  async cancelAppointment(appointmentId) {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appointmentId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Subscribe to real-time changes for a user's appointments
   */
  subscribeToChanges(userId, role, onUpdate) {
    const roleIdField = role === 'patient' ? 'patient_id' : 'psychologist_id'

    return supabase
      .channel(`appointments-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `${roleIdField}=eq.${userId}`
        },
        (payload) => {
          onUpdate(payload)
        }
      )
      .subscribe()
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
