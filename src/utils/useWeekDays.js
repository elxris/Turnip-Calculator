import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useWeekDays = () => {
  const { t } = useTranslation();

  return useMemo(() => {
    const weekDays = t("Mon Tue Wed Thu Fri Sat").split(" ");
    const [AM, PM] = [t("AM"), t("PM")];
    return {
      weekDaysCombined: weekDays.reduce(
        (acc, day) => [...acc, `${day} ${AM}`, `${day} ${PM}`],
        []
      ),
      weekDays,
      AM,
      PM,
    };
  }, [t]);
};

export default useWeekDays;
