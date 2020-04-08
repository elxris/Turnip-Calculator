import React from "react";
import { Box, Typography, Link as MaterialLink } from "@material-ui/core";
import { Trans } from "react-i18next";
import { string, node } from "prop-types";
import i18n from "./i18n";

const Link = ({ href, gh, children }) => (
  <MaterialLink
    href={href || `https://github.com/elxris/Turnip-Calculator/${gh}`}
    target="_blank"
    rel="noopener"
  >
    {children}
  </MaterialLink>
);
Link.propTypes = {
  href: string,
  gh: string,
  children: node.required,
};
Link.defaults = {
  href: undefined,
  gh: undefined,
};

const Footer = () => {
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
        <Typography variant="h5">{i18n.t("Usage")}</Typography>
        <Typography variant="body1">
          <Trans i18nKey="buyPriceInfo">
            - The <b>Buy Price</b> value is for your own island. It doesn&#39;t
            matter if you buy it in other island!
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
        <Typography variant="h5">{i18n.t("Changelog")}</Typography>
        <Typography variant="body1">
          {i18n.t("changelog1.1")} <br />
          {i18n.t("changelog1.2a")}
          <br />
          <Trans i18nKey="changelog1.3">
            1.3: Animations fixed. New icon (<Link gh="pull/2">@mtaylor76</Link>
            ). New horizontal marker for buy price (
            <Link gh="issues/5">@pudquick</Link>
            )!
          </Trans>
          <br />
          <Trans i18nKey="changelog1.4">
            1.4: Guaranteed Min. (
            <Link href="pull/10">@capoferro &amp; @nanoNago</Link>
            ). Localization Support (<Link gh="pull/15">@mtaylor76</Link>).
            French Localization (<Link gh="pull/16">@Ekaekale</Link>). New
            Currency Icon (<Link gh="pull/11">@alyphen</Link>). Bug Reporters (
            <Link gh="issues/14">@FoxFireX</Link>).
          </Trans>
        </Typography>
      </Box>
      <Box my={2}>
        <Typography variant="h5">{i18n.t("About")}</Typography>
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
    </Box>
  );
};

export default Footer;
