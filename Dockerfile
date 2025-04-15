# مرحلة البناء
FROM node:18-alpine AS builder

# تعيين مجلد العمل
WORKDIR /app

# نسخ ملفات التبعيات أولاً
COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./

# تثبيت التبعيات وPrisma CLI
RUN npm install
RUN npx prisma generate

# نسخ باقي الملفات
COPY . .

# بناء التطبيق
RUN npm run build

# مرحلة التشغيل
FROM node:18-alpine

WORKDIR /app

# نسخ التبعيات المثبتة وملفات البناء
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./

# تعيين المنفذ
EXPOSE 3000

# أمر التشغيل
CMD ["npm", "start"]