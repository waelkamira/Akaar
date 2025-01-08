import { supabase } from '../../../lib/supabaseClient';
import { invalidateCacheByPrefix } from '../../../lib/cacheUtils';

export async function handleEmojisAction(email, mealId, newActionValue) {
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

    // تحديث أو إنشاء السجل بناءً على القيمة الجديدة
    if (existingAction) {
      if (newActionValue === 0) {
        // تحديث السجل بإزالة الإيموجي إذا كانت القيمة الجديدة 0
        const { error } = await supabase
          .from('Action')
          .update({ emojis: newActionValue })
          .eq('userEmail', email)
          .eq('mealId', mealId);

        if (error) {
          throw error;
        }
        message = 'تمت إزالة الإيموجي من هذه الوصفة بنجاح';
      } else {
        // تحديث السجل بإضافة الإيموجي إذا كانت القيمة الجديدة 1
        const { error } = await supabase
          .from('Action')
          .update({ emojis: newActionValue })
          .eq('userEmail', email)
          .eq('mealId', mealId);

        if (error) {
          throw error;
        }
        message = 'تمت إضافة الإيموجي إلى هذه الوصفة بنجاح';
      }
    } else {
      // إنشاء السجل إذا لم يكن موجوداً
      const { error } = await supabase
        .from('Action')
        .insert({ userEmail: email, mealId, emojis: newActionValue });

      if (error) {
        throw error;
      }
      message = 'تمت إضافة الإيموجي إلى هذه الوصفة بنجاح';
    }

    // تحديث التخزين المؤقت
    invalidateCacheByPrefix('actions_');

    return { message, newActionValue };
  } catch (error) {
    console.error('Error handling emojis action:', error);
    return { error: 'Internal Server Error' };
  }
}
