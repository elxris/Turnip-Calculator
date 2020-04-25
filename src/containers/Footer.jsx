import React, { useMemo } from "react";
import { Box, Typography, Link as MaterialLink } from "@material-ui/core";
import { Trans } from "react-i18next";
import Localizer from "./Localizer";
import { string, node } from "prop-types";
import { useTranslation } from "react-i18next";

const Link = ({ href, gh, children }) => (
  <MaterialLink
    href={href || `https://github.com/elxris/Turnip-Calculator/issues/${gh}`}
    target="_blank"
    rel="noopener"
  >
    {children}
  </MaterialLink>
);
Link.propTypes = {
  href: string,
  gh: string,
  children: node,
};
Link.defaults = {
  href: undefined,
  gh: undefined,
};

const Footer = () => {
  const { t } = useTranslation();
  return useMemo(() => {
    return (
      <Box
        my={4}
        px={4}
        py={2}
        color="bkgs.mainAlt"
        bgcolor="bkgs.contentAlt"
        borderRadius={16}
      >
        <Box my={2}>
          <Typography variant="h5">{t("Usage")}</Typography>
          <Typography variant="body1">
            <Trans i18nKey="buyPriceInfo">
              - The <b>Buy Price</b> value is for your own island. It
              doesn&#39;t matter if you buy it in other island!
            </Trans>
            <br />
            <Trans i18nKey="priceChangeInfo">
              - Prices change <b>twice a day</b>. Be sure to log them. (We save
              your data in your device).
            </Trans>
            <br />
            <Trans i18nKey="guaranteedMinInfo">
              - The <b>Week min</b> value is a guaranteed minimum price you will
              get this week. Wait at least for this price.
            </Trans>
          </Typography>
        </Box>
        <Box my={2}>
          <Typography variant="h5">{t("About")}</Typography>
          <Typography variant="body1">
            <Trans i18nKey="contributors">
              Thank you all contributors so far!
            </Trans>{" "}
            <Link gh="2">@mtaylor76</Link>
            <Link gh="15">(x)</Link>
            <Link gh="24">(x)</Link>
            <Link gh="33">(x)</Link>
            <Link gh="39">(x)</Link> <Link gh="18">@DevSplash</Link>
            <Link gh="20">(x)</Link>
            <Link gh="28">(x)</Link>
            <Link gh="41">(x)</Link> <Link gh="22">@marcolai</Link>
            <Link gh="38">(x)</Link>
            <Link gh="40">(x)</Link> <Link gh="21">@nekomoto</Link>
            <Link gh="23">(x)</Link> <Link gh="26">@fabiomurru96</Link>
            <Link gh="31">(x)</Link> <Link gh="34">@dstaley</Link>
            <Link gh="35">(x)</Link> <Link gh="36">@ndoll</Link>
            <Link gh="37">(x)</Link> <Link gh="5">@pudquick</Link>{" "}
            <Link gh="10">@capoferro &amp; @nanoNago</Link>{" "}
            <Link gh="16">@Ekaekale</Link> <Link gh="11">@alyphen</Link>{" "}
            <Link gh="14">@FoxFireX</Link> <Link gh="19">@ninehole90</Link>{" "}
            <Link gh="25">@saitho</Link> <Link gh="23">@DotnetChen</Link>{" "}
            <Link gh="27">@Noelierx</Link> <Link gh="29">@JarodDif</Link>{" "}
            <Link gh="30">@CalebProvost</Link>{" "}
          </Typography>
          <Typography variant="body1">
            <Trans i18nKey="about1">
              This wouldn&apos;t be possible without{" "}
              <Link href="https://twitter.com/_Ninji/status/1244818665851289602">
                @_Ninji&apos;s
              </Link>{" "}
              effort.
            </Trans>
            <br />
            <Trans i18nKey="about2">
              I got this inspiration from{" "}
              <Link href="https://mikebryant.github.io/ac-nh-turnip-prices/index.html">
                mikebryant&apos;s
              </Link>{" "}
              work.
            </Trans>
            <br />
            <Trans i18nKey="about3">
              He is game dev! Follow him on twitter:{" "}
              <Link href="https://twitter.com/Consalv0">@Consalv0</Link>.
            </Trans>
            <br />
            <Trans i18nKey="about4">
              A bug? Report it{" "}
              <Link href="https://github.com/elxris/Turnip-Calculator/issues">
                here
              </Link>
              .
            </Trans>
          </Typography>
        </Box>
        <Localizer />
        <Typography variant="body1" align="right">
          v1.9.1
        </Typography>
      </Box>
    );
  }, [t]);
};

export default Footer;
