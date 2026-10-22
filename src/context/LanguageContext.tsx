import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "es" | "zh";

export const LANGUAGES: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "zh", label: "Chinese", native: "中文" },
];

/**
 * Chrome strings only — navigation, utility bar and footer headings.
 * Page content stays in English, which is how usps.com handles the two
 * translated mirrors: the shell and the navigation change language.
 */
const DICT: Record<Exclude<Lang, "en">, Record<string, string>> = {
  es: {
    "Quick Tools": "Herramientas rápidas",
    Send: "Enviar",
    Receive: "Recibir",
    Shop: "Tienda",
    Business: "Negocios",
    International: "Internacional",
    Help: "Ayuda",
    Locations: "Ubicaciones",
    Support: "Soporte",
    "Informed Delivery": "Entrega informada",
    "Register / Sign In": "Registrarse / Iniciar sesión",
    "Sign Out": "Cerrar sesión",
    "Admin Dashboard": "Panel de administración",
    "Mail & Shipping": "Correo y envíos",
    "Track & Manage": "Rastrear y administrar",
    "Postal Store": "Tienda postal",
    "About USPS": "Acerca de USPS",
    "Privacy Policy": "Política de privacidad",
    "Terms of Use": "Términos de uso",
    "Site Index": "Índice del sitio",
    "Back to top": "Volver arriba",
    "Search USPS.com": "Buscar en USPS.com",
  },
  zh: {
    "Quick Tools": "快捷工具",
    Send: "寄送",
    Receive: "接收",
    Shop: "商店",
    Business: "企业",
    International: "国际",
    Help: "帮助",
    Locations: "网点",
    Support: "支持",
    "Informed Delivery": "知情投递",
    "Register / Sign In": "注册 / 登录",
    "Sign Out": "退出登录",
    "Admin Dashboard": "管理面板",
    "Mail & Shipping": "邮件与运输",
    "Track & Manage": "追踪与管理",
    "Postal Store": "邮政商店",
    "About USPS": "关于 USPS",
    "Privacy Policy": "隐私政策",
    "Terms of Use": "使用条款",
    "Site Index": "网站地图",
    "Back to top": "返回顶部",
    "Search USPS.com": "搜索 USPS.com",
  },
};

interface LanguageValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Translates a chrome string, falling back to the English original. */
  t: (key: string) => string;
  languageLabel: string;
}

const LanguageContext = createContext<LanguageValue | null>(null);

const STORAGE_KEY = "usps_lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "es" || saved === "zh") return saved;
    } catch {
      /* storage unavailable */
    }
    return "en";
  });

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const value = useMemo<LanguageValue>(() => {
    const t = (key: string) => (lang === "en" ? key : DICT[lang][key] ?? key);
    const languageLabel = LANGUAGES.find((l) => l.code === lang)?.native ?? "English";
    return { lang, setLang, t, languageLabel };
  }, [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside a LanguageProvider");
  return ctx;
}
