import { supabase } from './supabase';

// ==================== 타입 정의 ====================

export interface PersonalExpense {
  id: number;
  user_id: string;
  expense_date: string; // YYYY-MM-DD
  expense_type: string;
  detail: string | null;
  amount: number;
  receipt_path: string | null;
  created_at: string;
}

export interface PersonalMileage {
  id: number;
  user_id: string;
  m_date: string; // YYYY-MM-DD
  distance_km: number;
  from_text: string;
  to_text: string;
  detail: string | null;
  amount_won: number;
  created_at: string;
  updated_at: string;
}

export interface CreateExpenseInput {
  user_id: string;
  expense_date: string; // YYYY-MM-DD
  expense_type: string;
  detail?: string;
  amount: number;
  receipt_path?: string;
}

export interface CreateMileageInput {
  user_id: string;
  m_date: string; // YYYY-MM-DD
  distance_km: number;
  from_text: string;
  to_text: string;
  detail?: string;
  amount_won: number;
}

export interface UpdateExpenseInput {
  expense_date?: string;
  expense_type?: string;
  detail?: string;
  amount?: number;
  receipt_path?: string;
}

export interface UpdateMileageInput {
  m_date?: string;
  distance_km?: number;
  from_text?: string;
  to_text?: string;
  detail?: string;
  amount_won?: number;
}

// ==================== 개인 지출 (카드/현금) ====================

/**
 * 개인 지출 등록
 */
export async function createPersonalExpense(data: CreateExpenseInput): Promise<PersonalExpense> {
  const { data: expense, error } = await supabase
    .from('personal_expenses')
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error('Error creating personal expense:', error);
    throw new Error(`지출 등록 실패: ${error.message}`);
  }

  return expense;
}

/**
 * 개인 지출 목록 조회
 */
export async function getPersonalExpenses(
  userId: string,
  filters?: {
    year?: number;
    month?: number;
  }
): Promise<PersonalExpense[]> {
  let query = supabase
    .from('personal_expenses')
    .select('*')
    .eq('user_id', userId)
    .order('expense_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (filters?.year) {
    const startDate = `${filters.year}-01-01`;
    const endDate = `${filters.year}-12-31`;
    query = query.gte('expense_date', startDate).lte('expense_date', endDate);
  }

  if (filters?.month !== undefined && filters?.year) {
    const startDate = `${filters.year}-${String(filters.month + 1).padStart(2, '0')}-01`;
    const endDate = `${filters.year}-${String(filters.month + 1).padStart(2, '0')}-31`;
    query = query.gte('expense_date', startDate).lte('expense_date', endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching personal expenses:', error);
    throw new Error(`지출 조회 실패: ${error.message}`);
  }

  return data || [];
}

/**
 * 개인 지출 수정
 */
export async function updatePersonalExpense(
  id: number,
  userId: string,
  updates: UpdateExpenseInput
): Promise<PersonalExpense> {
  const { data: expense, error } = await supabase
    .from('personal_expenses')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating personal expense:', error);
    throw new Error(`지출 수정 실패: ${error.message}`);
  }

  return expense;
}

/**
 * 개인 지출 삭제
 */
export async function deletePersonalExpense(id: number, userId: string): Promise<void> {
  const { error } = await supabase
    .from('personal_expenses')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting personal expense:', error);
    throw new Error(`지출 삭제 실패: ${error.message}`);
  }
}

// ==================== 개인 마일리지 ====================

/**
 * 개인 마일리지 등록
 */
export async function createPersonalMileage(data: CreateMileageInput): Promise<PersonalMileage> {
  const { data: mileage, error } = await supabase
    .from('personal_mileage')
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error('Error creating personal mileage:', error);
    throw new Error(`마일리지 등록 실패: ${error.message}`);
  }

  return mileage;
}

/**
 * 개인 마일리지 목록 조회
 */
export async function getPersonalMileages(
  userId: string,
  filters?: {
    year?: number;
    month?: number;
  }
): Promise<PersonalMileage[]> {
  let query = supabase
    .from('personal_mileage')
    .select('*')
    .eq('user_id', userId)
    .order('m_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (filters?.year) {
    const startDate = `${filters.year}-01-01`;
    const endDate = `${filters.year}-12-31`;
    query = query.gte('m_date', startDate).lte('m_date', endDate);
  }

  if (filters?.month !== undefined && filters?.year) {
    const startDate = `${filters.year}-${String(filters.month + 1).padStart(2, '0')}-01`;
    const endDate = `${filters.year}-${String(filters.month + 1).padStart(2, '0')}-31`;
    query = query.gte('m_date', startDate).lte('m_date', endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching personal mileages:', error);
    throw new Error(`마일리지 조회 실패: ${error.message}`);
  }

  return data || [];
}

/**
 * 개인 마일리지 수정
 */
export async function updatePersonalMileage(
  id: number,
  userId: string,
  updates: UpdateMileageInput
): Promise<PersonalMileage> {
  const { data: mileage, error } = await supabase
    .from('personal_mileage')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating personal mileage:', error);
    throw new Error(`마일리지 수정 실패: ${error.message}`);
  }

  return mileage;
}

/**
 * 개인 마일리지 삭제
 */
export async function deletePersonalMileage(id: number, userId: string): Promise<void> {
  const { error } = await supabase
    .from('personal_mileage')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting personal mileage:', error);
    throw new Error(`마일리지 삭제 실패: ${error.message}`);
  }
}

// ==================== 통계 ====================

/**
 * 개인 지출 통계 조회
 */
export async function getPersonalExpenseStats(
  userId: string,
  year?: number,
  month?: number
): Promise<{
  totalAmount: number;
  count: number;
  byType: Record<string, number>;
}> {
  let query = supabase
    .from('personal_expenses')
    .select('amount, expense_type')
    .eq('user_id', userId);

  if (year) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    query = query.gte('expense_date', startDate).lte('expense_date', endDate);
  }

  if (month !== undefined && year) {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-31`;
    query = query.gte('expense_date', startDate).lte('expense_date', endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching expense stats:', error);
    throw new Error(`지출 통계 조회 실패: ${error.message}`);
  }

  const expenses = data || [];
  const totalAmount = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const byType: Record<string, number> = {};

  expenses.forEach((e) => {
    const type = e.expense_type || '기타';
    byType[type] = (byType[type] || 0) + (e.amount || 0);
  });

  return {
    totalAmount,
    count: expenses.length,
    byType,
  };
}

/**
 * 개인 마일리지 통계 조회
 */
export async function getPersonalMileageStats(
  userId: string,
  year?: number,
  month?: number
): Promise<{
  totalDistance: number;
  totalAmount: number;
  count: number;
}> {
  let query = supabase
    .from('personal_mileage')
    .select('distance_km, amount_won')
    .eq('user_id', userId);

  if (year) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    query = query.gte('m_date', startDate).lte('m_date', endDate);
  }

  if (month !== undefined && year) {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-31`;
    query = query.gte('m_date', startDate).lte('m_date', endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching mileage stats:', error);
    throw new Error(`마일리지 통계 조회 실패: ${error.message}`);
  }

  const mileages = data || [];
  const totalDistance = mileages.reduce((sum, m) => sum + Number(m.distance_km || 0), 0);
  const totalAmount = mileages.reduce((sum, m) => sum + (m.amount_won || 0), 0);

  return {
    totalDistance,
    totalAmount,
    count: mileages.length,
  };
}
