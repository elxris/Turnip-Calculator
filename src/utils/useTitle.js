import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const useTitle = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // allows title to be localised
    document.title = t("Turnip Calculator");
  }, [t]);
};

export default useTitle;
