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
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-md p-2 flex space-x-2">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            variant={i18n.language === lang.code ? "default" : "ghost"}
            size="sm"
            className={`px-3 py-1 text-sm font-medium ${
              i18n.language === lang.code
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {lang.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
