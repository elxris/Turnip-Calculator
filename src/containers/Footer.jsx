import React, { useMemo, Fragment } from "react";
import { Box, Typography, Link as MaterialLink } from "@material-ui/core";
import { Trans } from "react-i18next";
import Localizer from "./Localizer";
import { string, node } from "prop-types";
import { useTranslation } from "react-i18next";
import { version } from "../../package.json";
import { QuantileRange } from "../components";
import contributors from "../data/contributors.json";

const Link = ({ href, children }) => (
  <MaterialLink href={href} target="_blank" rel="noopener">
    {children}
  </MaterialLink>
);
Link.propTypes = {
  href: string,
  children: node,
};
Link.defaults = {
  href: undefined,
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
            <br />
            <Trans i18nKey="mostLikelyInfo">
              - The <b>Most Likely</b> value range is where <QuantileRange /> of
              the turnip prices will fall.
            </Trans>
          </Typography>
        </Box>
        <Box my={2}>
          <Typography variant="h5">{t("About")}</Typography>
          <Typography variant="body1">
            <Trans i18nKey="contributors">
              Thank you all contributors so far!
            </Trans>{" "}
            {contributors
              .filter(
                ({ author }) =>
                  !["actions-user", "weblate"].includes(author.login)
              )
              .sort((a, b) => b.total - a.total)
              .map(({ author }) => (
                <Fragment key={author.id}>
                  <Link href={author.html_url}>{`@${author.login}`}</Link>{" "}
                </Fragment>
              ))}
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
          {`v${version || "2.x"}`}
        </Typography>
      </Box>
    );
  }, [t]);
};

export default Footer;
