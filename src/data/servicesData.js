import {
  BookOpen,
  Code,
  Camera,
  Calendar,
  Heart,
  Activity,
  MessageSquare,
  Globe,
  Truck,
  Briefcase,
} from "lucide-react";
import React from "react";

export const servicesData = [
  {
    name: "خدمات تعليمية",
    path: "/services/educational",
    description: "دروس خصوصية، مساعدة في الواجبات، وتحضير للامتحانات",
    icon: BookOpen,
  },

  {
    name: "خدمات الرعاية",
    path: "/services/care",
    description: "رعاية الأطفال والمسنين",
    icon: Heart,
  },

  {
    name: "خدمات تسويق",
    path: "/services/marketing",
    description: "تسويق رقمي وإدارة وسائل التواصل الاجتماعي",
    icon: MessageSquare,
  },
  {
    name: "خدمات ترجمة",
    path: "/services/translation",
    description: "ترجمة وثائق ومحتوى",
    icon: Globe,
  },
  {
    name: "خدمات نقل",
    path: "/services/transportation",
    description: "توصيل وخدمات النقل",
    icon: Truck,
  },
  {
    name: "خدمات مهنية",
    path: "/services/professional",
    description: "استشارات مهنية وتطوير مهارات",
    icon: Briefcase,
  },
];

export const testimonialData = [
  {
    name: "أحمد محمود",
    role: "طالب هندسة",
    text: "ساعدتني المنصة على تطوير مهاراتي وكسب دخل إضافي أثناء دراستي. أنصح جميع الطلاب بالانضمام!",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "سارة خالد",
    role: "طالبة تصميم",
    text: "وجدت فرصًا كثيرة لعرض تصاميمي وبناء محفظة أعمال احترافية من خلال المشاريع التي حصلت عليها عبر المنصة.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "محمد علي",
    role: "عميل",
    text: "الخدمات المقدمة من طلاب الجامعات ذات جودة عالية وبأسعار مناسبة. تجربتي كانت ممتازة!",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
  },
];

export const statisticsData = [
  { value: "5000+", label: "طالب مسجل" },
  { value: "12000+", label: "خدمة مقدمة" },
  { value: "95%", label: "نسبة رضا العملاء" },
  { value: "40+", label: "خدمة متنوعة" },
];

export const benefitsData = [
  {
    title: "دعم المهارات الطلابية",
    description:
      "نؤمن بقدرات طلاب الجامعات ونسعى لمساعدتهم على تطوير مهاراتهم العملية",
    icon: "Star",
  },
  {
    title: "منصة آمنة وموثوقة",
    description: "نضمن أعلى معايير الأمان والشفافية في جميع التعاملات",
    icon: "Shield",
  },
  {
    title: "مجتمع متفاعل",
    description: "انضم إلى مجتمع من الطلاب والخبراء لتبادل الخبرات والمعرفة",
    icon: "Users",
  },
  {
    title: "توفير الوقت والجهد",
    description: "احصل على الخدمة التي تحتاجها بسرعة وسهولة دون عناء البحث",
    icon: "Clock",
  },
];

export const subServicesData = {
  educational: [
    {
      name: "تعليم العزف",
      path: "/services/خدمات تعليمية/تعليم العزف",
      description: "دروس عزف على الجيتار والبيانو",
      icon: BookOpen,
    },
    {
      name: "تعليم اللغة العربية",
      path: "/services/خدمات تعليمية/تعليم اللغة العربية",
      description: "دروس لغة عربية لجميع المستويات",
      icon: BookOpen,
    },
    {
      name: "تعليم اللغة الإنجليزية",
      path: "/services/خدمات تعليمية/تعليم اللغة الإنجليزية",
      description: "تحسين مهارات اللغة الإنجليزية",
      icon: BookOpen,
    },
    {
      name: "تعليم العزف",
      path: "/services/خدمات تعليمية/تعليم العزف",
      description: "دروس عزف على الجيتار والبيانو",
      icon: BookOpen,
    },
    {
      name: "تعليم العزف",
      path: "/services/خدمات تعليمية/تعليم العزف",
      description: "دروس عزف على الجيتار والبيانو",
      icon: BookOpen,
    },
  ],
  creative: [
    {
      name: "تطوير المواقع",
      path: "/services/خدمات تقنية/تطوير المواقع",
      description: "برمجة مواقع ويب احترافية",
      icon: Code,
    },
    {
      name: "حل مشاكل البرمجة",
      path: "/services/خدمات تقنية/حل مشاكل البرمجة",
      description: "مساعدتك في حل الأخطاء البرمجية",
      icon: Code,
    },
  ],
  technical: [
    {
      name: "التصوير الفوتوغرافي",
      path: "/services/خدمات إبداعية/التصوير الفوتوغرافي",
      description: "جلسات تصوير احترافية",
      icon: Camera,
    },
    {
      name: "تصميم الجرافيك",
      path: "/services/خدمات إبداعية/تصميم الجرافيك",
      description: "تصميم الشعارات والهوية البصرية",
      icon: Camera,
    },
  ],
};
