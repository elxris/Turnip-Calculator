import React from "react";
import { Box, Typography, Link } from "@material-ui/core";

import i18n from "./i18n";
import { Trans } from "react-i18next";

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
          <br/>
          <Trans i18nKey="priceChangeInfo">
            - Prices change <b>twice a day</b>. Be sure to log them.
            (We save your data in your device).
          </Trans>
        </Typography>
      </Box>
      <Box my={2}>
        <Typography variant="h5">{i18n.t('Changelog')}</Typography>
        <Typography variant="body1">
          {i18n.t('changelog1.1')} <br />
          {i18n.t('changelog1.2a')}
          <br />
          <Trans i18nKey="changelog1.3">
            1.3: Animations fixed. New icon, thanks {" "}
              <Link
                href="https://github.com/elxris/Turnip-Calculator/pull/2"
                target="_blank"
                rel="noopener"
              >
                @mtaylor76
              </Link>
              ! New horizontal marker for buy price, thanks{" "}
              <Link
                href="https://github.com/elxris/Turnip-Calculator/issues/5"
                target="_blank"
                rel="noopener"
              >
                @pudquick
              </Link>
              !
          </Trans>
        </Typography>
      </Box>
      <Box my={2}>
        <Typography variant="h5">{i18n.t('About')}</Typography>
        <Typography variant="body1">
          <Trans i18nKey="about1">
            This wouldn&apos;t be possible without{" "}
            <Link
              href="https://twitter.com/_Ninji/status/1244818665851289602"
              target="_blank"
              rel="noopener"
            >
              @_Ninji&apos;s
            </Link>{" "}
            effort. 
          </Trans>
          <br />
          <Trans i18nKey="about2">
            I got this inspiration from{" "}
            <Link
              href="https://mikebryant.github.io/ac-nh-turnip-prices/index.html"
              target="_blank"
              rel="noopener"
            >
              mikebryant&apos;s
            </Link>{" "}
            work. 
          </Trans>
          <br />
          <Trans i18nKey="about3">
             He is game dev! Follow him on twitter:{" "}
            <Link
              href="https://twitter.com/Consalv0"
              target="_blank"
              rel="noopener"
            >
              @Consalv0
            </Link>
            .
          </Trans>
          <br />
          <Trans i18nKey="about4">
            A bug? Report it{" "}
            <Link
              href="https://github.com/elxris/Turnip-Calculator/issues"
              target="_blank"
              rel="noopener"
            >
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
