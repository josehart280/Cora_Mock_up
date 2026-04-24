// ============================================
// Dashboard Repository
// Aggregated data for dashboards
// ============================================

import { supabase } from '../services/supabaseClient'

export const dashboardRepository = {
  /**
   * Get stats for a patient dashboard
   */
  async getPatientStats(patientId) {
    // 1. Get total sessions this month
    const firstDayOfMonth = new Date()
    firstDayOfMonth.setDate(1)
    firstDayOfMonth.setHours(0, 0, 0, 0)

    const { count: sessionsThisMonth, error: err1 } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', patientId)
      .eq('status', 'completed')
      .gte('scheduled_at', firstDayOfMonth.toISOString())

    if (err1) throw err1

    // 2. Get active subscription
    const { data: subscription, error: err2 } = await supabase
      .from('subscriptions')
      .select('plan, status, price_cents, current_period_end')
      .eq('user_id', patientId)
      .eq('status', 'active')
      .maybeSingle()

    if (err2) throw err2

    // 3. Weeks active (mocked for now based on profile created_at)
    const { data: profile } = await supabase
      .from('profiles')
      .select('created_at')
      .eq('id', patientId)
      .single()
    
    const weeksActive = profile ? Math.ceil((new Date() - new Date(profile.created_at)) / (1000 * 60 * 60 * 24 * 7)) : 0

    return {
      sessionsThisMonth: sessionsThisMonth || 0,
      activePlan: subscription?.plan || 'per_session',
      planStatus: subscription?.status || 'none',
      planPrice: (subscription?.price_cents || 0) / 100,
      renewalDate: subscription?.current_period_end,
      weeksActive
    }
  },

  /**
   * Get stats for a therapist dashboard
   */
  async getTherapistStats(therapistId) {
    // 1. Active patients (unique patients with scheduled or completed appointments)
    const { data: patients, error: err1 } = await supabase
      .from('appointments')
      .select('patient_id')
      .eq('psychologist_id', therapistId)
    
    const uniquePatients = new Set(patients?.map(p => p.patient_id)).size

    // 2. Monthly sessions
    const firstDayOfMonth = new Date()
    firstDayOfMonth.setDate(1)
    const { count: sessionsThisMonth, error: err2 } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', therapistId)
      .eq('status', 'completed')
      .gte('scheduled_at', firstDayOfMonth.toISOString())

    if (err2) throw err2

    // 3. Earnings and rating from profile
    const { data: profile, error: err3 } = await supabase
      .from('psychologist_profiles')
      .select('average_rating, total_reviews, total_sessions, hourly_rate_usd')
      .eq('id', therapistId)
      .single()

    if (err3) throw err3

    return {
      activePatients: uniquePatients,
      sessionsThisMonth: sessionsThisMonth || 0,
      averageRating: parseFloat(profile.average_rating) || 0,
      totalReviews: profile.total_reviews || 0,
      monthlyEarnings: (sessionsThisMonth || 0) * (profile.hourly_rate_usd || 0) * 0.85 // 85% payout
    }
  }
}

export default dashboardRepository
