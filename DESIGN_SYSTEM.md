# DESIGN_SYSTEM.md – نظام التصميم

> يتم تنفيذ هذا النظام باستخدام **TailwindCSS**. الألوان المذكورة أدناه ستُضاف إلى `tailwind.config.ts` لتكون متاحة كـ `bg-primary`, `text-primary`, إلخ.

## الألوان (Colors)

### الأساسية (Dark Theme)
| الاستخدام | اللون | رمز Tailwind المقترح |
|-----------|-------|----------------------|
| الخلفية الرئيسية | `#0d0f14` | `bg-background` |
| سطح البطاقات/المراحل | `#13161e` | `bg-surface` |
| سطح ثانوي | `#1a1e2a` | `bg-surface2` |
| الحدود | `#232738` | `border-border` |
| النص الرئيسي | `#e8eaf0` | `text-text` |
| النص الخافت | `#6b7280` | `text-muted` |
| النص الباهت | `#9ca3af` | `text-dim` |

### ألوان المراحل (لون مميز لكل مرحلة)
| المرحلة | اللون | رمز Tailwind |
|---------|-------|--------------|
| ١. تعريف المشروع | `#6366f1` | `indigo-500` |
| ٢. تحليل المتطلبات | `#0ea5e9` | `sky-500` |
| ٣. تصميم قاعدة البيانات | `#10b981` | `emerald-500` |
| ٤. تصميم المعمارية | `#8b5cf6` | `violet-500` |
| ٥. تحديد Tech Stack | `#f59e0b` | `amber-500` |
| ٦. تصميم الواجهة في Figma | `#ec4899` | `pink-500` |
| ٧. إعداد بيئة التطوير | `#14b8a6` | `teal-500` |
| ٨. التطوير بنظام Sprints | `#3b82f6` | `blue-500` |
| ٩. الاختبار والـ QA | `#ef4444` | `red-500` |
| ١٠. Deployment | `#a855f7` | `purple-500` |
| ١١. المتابعة بعد الإطلاق | `#22c55e` | `green-500` |

### ألوان النصائح والتأكيدات
- `#fbbf24` (أصفر) → `yellow-400`

---

## الطباعة (Typography)
- **العناوين الرئيسية**: `text-4xl md:text-5xl font-bold` (خط `Inter` الافتراضي من Tailwind)
- **عناوين المراحل**: `text-lg font-semibold`
- **عناوين الخطوات**: `text-sm font-medium`
- **النص العادي**: `text-sm text-dim`
- **النص الصغير (تسميات)**: `text-xs font-semibold uppercase tracking-wider text-muted`

---

## المسافات (Spacing)
- استخدام مقياس Tailwind الافتراضي (0, 1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64...).
- الأمثلة:
  - `p-5` (20px) للـ `.phase-header`
  - `p-4` (16px) للـ `.step-header`
  - `gap-2` (8px)، `gap-3` (12px)، `gap-4` (16px)، `gap-6` (24px).

---

## الزوايا (Border Radius)
- `rounded-xl` (12px) للمراحل
- `rounded-lg` (8px) للخطوات
- `rounded-full` للشعارات والزر الدائري

---

## الظلال والتأثيرات
- عند فتح المرحلة: `shadow-[0_0_0_1px] shadow-phase-color` (يتم تحديد اللون ديناميكياً)
- عند hover: `hover:bg-surface2`
- انتقالات: `transition-all duration-200`

---

## المكونات الرئيسية (Components)

### 1. المرحلة (Phase)
- رأس: `flex items-center gap-4 p-5 cursor-pointer`
- الرقم: `w-9 h-9 rounded-full border-2 flex items-center justify-center`
- العنوان: `text-lg font-semibold`
- السهم: `transition-transform duration-200`

### 2. الخطوة (Step)
- رأس: `flex items-center gap-3 p-4 cursor-pointer`
- نقطة لونية: `w-2 h-2 rounded-full`
- العنوان: `text-sm font-medium`
- الجسم: `p-4 pt-0 space-y-3`

### 3. الأزرار (Buttons)
- زر أساسي: `px-4 py-2 rounded-lg border border-border bg-surface hover:bg-surface2 hover:border-primary transition`

### 4. شريط التقدم (Progress Bar)
- `h-1 bg-border rounded-full overflow-hidden`
- التعبئة: `h-full bg-gradient-to-r from-indigo-500 via-pink-500 to-green-500 transition-all`

### 5. النصائح (Tip Box)
- `bg-yellow-400/5 border border-yellow-400/20 rounded-lg p-3 flex gap-2`
- النص: `text-yellow-300 text-xs`

### 6. التصنيفات (Tags)
- `inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold`
- أداة: `bg-indigo-500/10 text-indigo-300 border border-indigo-500/25`
- مخرجات: `bg-emerald-500/10 text-emerald-300 border border-emerald-500/25`

### 7. حقل الإدخال (Input)
- `w-full bg-surface border border-border rounded-xl px-5 py-4 text-text`
- Focus: `focus:border-primary focus:ring-1 focus:ring-primary/30`

### 8. زر اختيار النوع (Workflow Select)
- حالة فارغة: `border-dashed border-border hover:border-primary/40`
- حالة مختارة: بطاقة تعرض أيقونة النوع ولونه مع زر "تغيير"

### 9. النافذة المنبثقة (Modal)
- Overlay: `bg-black/70 backdrop-blur-sm`
- المحتوى: `bg-surface border border-border rounded-2xl max-w-2xl`
- البطاقات: `bg-surface2/50 border-border rounded-xl p-5 hover:bg-surface2`
- البطاقة المختارة: `border-primary/50 shadow-lg shadow-primary/10`

### 10. زر البدء (Start Button)
- مفعّل: `bg-primary text-white hover:bg-indigo-400 shadow-lg shadow-primary/25`
- معطّل: `bg-surface2 text-muted border border-border cursor-not-allowed`

### 11. الرسوم المتحركة (Animations)
- `animate-fade-down`: ظهور من أعلى (fadeDown 0.25s)
- `animate-fade-in`: ظهور تدريجي (fadeIn 0.2s)
- `animate-scale-in`: تكبير تدريجي (scaleIn 0.25s)

### 12. بطاقة المشروع (Project Card)
- `bg-surface border border-border rounded-xl p-5 hover:bg-surface2`
- أيقونة النوع: `w-12 h-12 rounded-xl` بلون النوع
- زر حذف يظهر عند hover: `opacity-0 group-hover:opacity-100`

### 13. مربع الإكمال (Step Checkbox)
- `w-5 h-5 rounded-md border-2 border-border`
- مكتمل: `bg-green-500 border-green-500 text-white` مع أيقونة ✓
- النص عند الإكمال: `line-through text-muted`

### 14. نافذة تأكيد الحذف (Delete Dialog)
- نفس overlay الـ Modal
- `max-w-sm p-6 text-center`
- زر حذف: `bg-red-500 text-white hover:bg-red-400`

---

## التوافق مع RTL
- في `app/layout.tsx`: `<html dir="rtl">`
- استخدم `space-x-reverse` و `flex-row-reverse` عند الحاجة (Tailwind يدعم RTL).

## ملاحظات
- أي إضافة جديدة يجب أن تحترم هذه القيم.
- إذا احتجت لتعديل أي قيمة، قم بتحديث هذا الملف أولاً.