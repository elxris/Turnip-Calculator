import React from "react";
import { Box, Typography, Link } from "@material-ui/core";

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
        <Typography variant="h5">How to use it</Typography>
        <Typography variant="body1">
          - The <b>Buy Price</b> value is on your own island. It doesn&apos;t
          matter if you buy it in other island!
          <br />- Prices Changes <b>twice a day</b>. Be sure to log it. (We save
          your data in your device).
        </Typography>
      </Box>
      <Box my={2}>
        <Typography variant="h5">Changelog</Typography>
        <Typography variant="body1">
          1.1: Clear data button! Please use it responsibly! <br />
          1.2a: Fixed ranges of patterns
          <br />
          1.3: Animations fixed. New icon, thanks{" "}
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
        </Typography>
      </Box>
      <Box my={2}>
        <Typography variant="h5">About</Typography>
        <Typography variant="body1">
          This wouldn&apos;t be possible without{" "}
          <Link
            href="https://twitter.com/_Ninji/status/1244818665851289602"
            target="_blank"
            rel="noopener"
          >
            @_Ninji&apos;s
          </Link>{" "}
          effort. <br />I got this inspiration from{" "}
          <Link
            href="https://mikebryant.github.io/ac-nh-turnip-prices/index.html"
            target="_blank"
            rel="noopener"
          >
            mikebryant&apos;s
          </Link>{" "}
          work. <br />
          Finally, but not last, my brother&apos;s help with design. He is game
          dev! Follow him on twitter:{" "}
          <Link
            href="https://twitter.com/Consalv0"
            target="_blank"
            rel="noopener"
          >
            @Consalv0
          </Link>
          . <br />A bug? Report it{" "}
          <Link
            href="https://github.com/elxris/Turnip-Calculator/issues"
            target="_blank"
            rel="noopener"
          >
            here
          </Link>
          .
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
