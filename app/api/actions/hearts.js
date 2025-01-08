import { supabase } from '../../../lib/supabaseClient';
import { invalidateCacheByPrefix } from '../../../lib/cacheUtils';

export async function handleHeartsAction(email, mealId, newActionValue, meal) {
  try {
    // التحقق من وجود سجل مشابه
    const { data: existingAction, error: existingActionError } = await supabase
      .from('Action')
      .select('*')
      .eq('userEmail', email)
      .eq('mealId', mealId)
      .single();

    if (existingActionError && existingActionError.code !== 'PGRST116') {
      throw new Error('Internal Server Error');
    }

    let message;

    // تحديث أو حذف السجل بناءً على القيمة الجديدة
    if (existingAction) {
      if (newActionValue === 0) {
        // حذف السجل إذا كانت القيمة الجديدة 0
        const { error } = await supabase
          .from('Action')
          .delete()
          .eq('userEmail', email)
          .eq('mealId', mealId);

        if (error) {
          throw error;
        }
        message = 'تم إلغاء الإعجاب بهذه الوصفة بنجاح';
      } else {
        // تحديث السجل إذا كانت القيمة الجديدة 1
        const { error } = await supabase
          .from('Action')
          .update({ hearts: newActionValue })
          .eq('userEmail', email)
          .eq('mealId', mealId);

        if (error) {
          throw error;
        }
        message = 'تمت إضافة الوصفة إلى قائمة المفضلة بنجاح';
      }
    } else {
      // إنشاء السجل إذا لم يكن موجوداً
      const { error } = await supabase
        .from('Action')
        .insert({ userEmail: email, mealId, hearts: newActionValue });

      if (error) {
        throw error;
      }
      message = 'تمت إضافة الوصفة إلى قائمة المفضلة بنجاح';
    }

    // تحديث التخزين المؤقت
    invalidateCacheByPrefix('actions_');

    return { message, newActionValue };
  } catch (error) {
    console.error('Error handling hearts action:', error);
    return { error: 'Internal Server Error' };
  }
}
