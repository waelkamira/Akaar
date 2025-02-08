import NodeCache from 'node-cache';
import { handleHeartsAction } from './hearts';
import { handleLikesAction } from './likes';
import { handleEmojisAction } from './emojis';
import { supabase } from '../../../../lib/supabaseClient';

// إنشاء كائن للتخزين المؤقت
const cache = new NodeCache({ stdTTL: 60 * 10 }); // التخزين لمدة 10 دقائق

// التأكد من الاتصال بقاعدة البيانات
async function ensureSupabaseConnection() {
  try {
    // يمكننا إضافة منطق للتحقق من الاتصال إذا لزم الأمر
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw new Error('Database connection error');
  }
}

// معالج طلب GET
export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 5;
  const mealId = searchParams.get('mealId') || '';
  const email = searchParams.get('email') || '';
  const nonEmail = searchParams.get('nonEmail');
  const skip = (page - 1) * limit;

  await ensureSupabaseConnection();

  try {
    const query = {};
    if (email && !nonEmail) {
      query.userEmail = email;
    }
    if (mealId) {
      query.mealId = mealId;
    }

    // إنشاء مفتاح للتخزين المؤقت
    const cacheKey = `actions_${JSON.stringify(query)}_${page}_${limit}`;

    // محاولة الحصول على البيانات من التخزين المؤقت
    let actionRecords = cache.get(cacheKey);
    if (!actionRecords) {
      // Fetch action records from the database
      const { data, error } = await supabase
        .from('Action')
        .select('*')
        .match(query)
        .order('createdAt', { ascending: false })
        .range(skip, skip + limit - 1);

      if (error) {
        throw error;
      }

      actionRecords = data;

      // تخزين النتائج في التخزين المؤقت
      cache.set(cacheKey, actionRecords);
    }

    return new Response(JSON.stringify(actionRecords));
  } catch (error) {
    console.error('Error fetching action records:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const email = searchParams.get('email') || '';
    const data = await req.json();
    const { mealId, actionType } = data;

    if (!email) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        status: 401,
      });
    }
    console.log('email', email, 'mealId', mealId, 'actionType', actionType);

    if (!['likes', 'hearts', 'emojis'].includes(actionType)) {
      return new Response(JSON.stringify({ error: 'Invalid action type' }), {
        status: 400,
      });
    }

    // Fetch meal info
    const { data: meal, error: mealError } = await supabase
      .from('Meal')
      .select('*')
      .eq('id', mealId)
      .single();

    if (mealError) {
      console.error('Error fetching meal:', mealError);
      throw new Error('Internal Server Error');
    }

    // Check for existing action
    const { data: existingAction, error: existingActionError } = await supabase
      .from('Action')
      .select('*')
      .eq('userEmail', email)
      .eq('mealId', mealId)
      .single();

    if (existingActionError && existingActionError.code !== 'PGRST116') {
      console.error('Error fetching existing action:', existingActionError);
      throw new Error('Internal Server Error');
    }

    // Determine new action value
    const newActionValue = existingAction
      ? existingAction[actionType] === 1
        ? 0
        : 1
      : 1;

    let response;
    switch (actionType) {
      case 'hearts':
        response = await handleHeartsAction(
          email,
          mealId,
          newActionValue,
          meal
        );
        break;
      case 'likes':
        response = await handleLikesAction(email, mealId, newActionValue);
        break;
      case 'emojis':
        response = await handleEmojisAction(email, mealId, newActionValue);
        break;
    }

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
