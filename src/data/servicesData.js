import { BookOpen, Code, Camera, Calendar, Heart, Activity, MessageSquare, Globe, Truck, Briefcase } from 'lucide-react';
import React from 'react';

export const servicesData = [
  { 
    name: 'خدمات تعليمية', 
    path: '/services/educational', 
    description: 'دروس خصوصية، مساعدة في الواجبات، وتحضير للامتحانات', 
    icon: BookOpen 
  },
  { 
    name: 'خدمات إبداعية', 
    path: '/services/creative', 
    description: 'تصميم جرافيك، تصوير، ومونتاج فيديو', 
    icon: Camera 
  },
  { 
    name: 'خدمات تقنية', 
    path: '/services/technical', 
    description: 'برمجة، تطوير مواقع، وحل المشاكل التقنية', 
    icon: Code 
  },
  { 
    name: 'خدمات فعاليات', 
    path: '/services/events', 
    description: 'تنظيم وإدارة الفعاليات والمناسبات', 
    icon: Calendar 
  },
  { 
    name: 'خدمات الرعاية', 
    path: '/services/care', 
    description: 'رعاية الأطفال والمسنين', 
    icon: Heart 
  },
  { 
    name: 'خدمات صحية', 
    path: '/services/health', 
    description: 'استشارات صحية وتغذية', 
    icon: Activity 
  },
  { 
    name: 'خدمات تسويق', 
    path: '/services/marketing', 
    description: 'تسويق رقمي وإدارة وسائل التواصل الاجتماعي', 
    icon: MessageSquare 
  },
  { 
    name: 'خدمات ترجمة', 
    path: '/services/translation', 
    description: 'ترجمة وثائق ومحتوى', 
    icon: Globe 
  },
  { 
    name: 'خدمات نقل', 
    path: '/services/transportation', 
    description: 'توصيل وخدمات النقل', 
    icon: Truck 
  },
  { 
    name: 'خدمات مهنية', 
    path: '/services/professional', 
    description: 'استشارات مهنية وتطوير مهارات', 
    icon: Briefcase 
  }
];

export const testimonialData = [
  {
    name: "أحمد محمود",
    role: "طالب هندسة",
    text: "ساعدتني المنصة على تطوير مهاراتي وكسب دخل إضافي أثناء دراستي. أنصح جميع الطلاب بالانضمام!",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "سارة خالد",
    role: "طالبة تصميم",
    text: "وجدت فرصًا كثيرة لعرض تصاميمي وبناء محفظة أعمال احترافية من خلال المشاريع التي حصلت عليها عبر المنصة.",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "محمد علي",
    role: "عميل",
    text: "الخدمات المقدمة من طلاب الجامعات ذات جودة عالية وبأسعار مناسبة. تجربتي كانت ممتازة!",
    image: "https://randomuser.me/api/portraits/men/22.jpg"
  }
];

export const statisticsData = [
  { value: "5000+", label: "طالب مسجل" },
  { value: "12000+", label: "خدمة مقدمة" },
  { value: "95%", label: "نسبة رضا العملاء" },
  { value: "40+", label: "خدمة متنوعة" }
];

export const benefitsData = [
  { 
    title: "دعم المهارات الطلابية", 
    description: "نؤمن بقدرات طلاب الجامعات ونسعى لمساعدتهم على تطوير مهاراتهم العملية",
    icon: "Star" 
  },
  { 
    title: "منصة آمنة وموثوقة", 
    description: "نضمن أعلى معايير الأمان والشفافية في جميع التعاملات",
    icon: "Shield" 
  },
  { 
    title: "مجتمع متفاعل", 
    description: "انضم إلى مجتمع من الطلاب والخبراء لتبادل الخبرات والمعرفة",
    icon: "Users" 
  },
  { 
    title: "توفير الوقت والجهد", 
    description: "احصل على الخدمة التي تحتاجها بسرعة وسهولة دون عناء البحث",
    icon: "Clock" 
  }
];
