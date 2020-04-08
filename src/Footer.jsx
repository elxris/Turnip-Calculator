import React from "react";
import { Box, Typography, Link as MaterialLink } from "@material-ui/core";
import { Trans } from "react-i18next";
import { string, node } from "prop-types";
import i18n from "./i18n";

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
        <Typography variant="h5">{i18n.t("About")}</Typography>
        <Typography variant="body1">
          <Trans i18nKey="contributors">
            Thank you all contributors so far!
          </Trans>{" "}
          <Link gh="2">@mtaylor76</Link> <Link gh="5">@pudquick</Link>{" "}
          <Link gh="10">@capoferro &amp; @nanoNago</Link>{" "}
          <Link gh="15">@mtaylor76</Link> <Link gh="16">@Ekaekale</Link>{" "}
          <Link gh="11">@alyphen</Link> <Link gh="14">@FoxFireX</Link>{" "}
          <Link gh="19">@ninehole90</Link> <Link gh="21">@nekomoto</Link>
          <Link gh="23">(1)</Link> <Link gh="26">@fabiomurru96</Link>{" "}
          <Link gh="25">@saitho</Link> <Link gh="23">@DotnetChen</Link>{" "}
          <Link gh="22">@marcolai</Link> <Link gh="18">@DevSplash</Link>
          <Link gh="20">(1)</Link> <Link gh="16">@Ekaekale</Link>
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
        <Typography variant="body1" align="right">
          v1.5
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
