import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'es', label: 'ES' },
    { code: 'ca', label: 'CA' },
    { code: 'en', label: 'EN' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 flex space-x-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          variant={i18n.language === lang.code ? "default" : "ghost"}
          size="sm"
          className={`px-3 py-1 text-sm font-medium ${
            i18n.language === lang.code
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "text-white hover:bg-white/20"
          }`}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
}
